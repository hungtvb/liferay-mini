import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

import pixelmatch from 'pixelmatch';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';

const outputDirectory = path.resolve('build/visual-parity');
const referenceURL = process.env.NXC_REFERENCE_URL ?? 'http://127.0.0.1:4174';
const candidateURL = process.env.NXC_CANDIDATE_URL ?? 'http://127.0.0.1:4173';
const maximumMismatchRatio = Number(
    process.env.NXC_MAXIMUM_MISMATCH_RATIO ?? '0.015'
);

const viewports = [
    {height: 900, label: '1440', width: 1440},
    {height: 1024, label: '768', width: 768},
    {height: 812, label: '375', width: 375},
];

const deterministicCSS = `
*, *::before, *::after {
    animation-delay: 0s !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
    transition-delay: 0s !important;
    transition-duration: 0.01ms !important;
}

[data-aos] {
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
}

.ticker__marquee {
    animation: none !important;
    transform: none !important;
}
`;

async function waitForServer(url) {
    const deadline = Date.now() + 60_000;

    while (Date.now() < deadline) {
        try {
            const response = await fetch(url);

            if (response.ok) {
                return;
            }
        }
        catch {
            // Server is still starting.
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    throw new Error(`Timed out waiting for ${url}`);
}

async function stabilizePage(page, kind) {
    await page.addStyleTag({content: deterministicCSS});

    await page.evaluate(
        ({css, pageKind}) => {
            const installStyle = (root) => {
                const style = document.createElement('style');
                style.dataset.nexcentVisualAudit = 'true';
                style.textContent = css;
                root.append(style);

                root.querySelectorAll('*').forEach((element) => {
                    if (element.shadowRoot) {
                        installStyle(element.shadowRoot);
                    }
                });
            };

            installStyle(document.head);

            if (pageKind === 'reference') {
                const swiper = window.swiper;

                swiper?.autoplay?.stop?.();
                swiper?.slideToLoop?.(0, 0, false);
                swiper?.slideTo?.(0, 0, false);

                document.querySelectorAll('[data-aos]').forEach((element) => {
                    element.classList.add('aos-animate');
                    element.removeAttribute('data-aos');
                });
            }
        },
        {css: deterministicCSS, pageKind: kind}
    );

    await page.evaluate(async () => {
        await document.fonts?.ready;

        const collectImages = (root) => {
            const images = [...root.querySelectorAll('img')];

            root.querySelectorAll('*').forEach((element) => {
                if (element.shadowRoot) {
                    images.push(...collectImages(element.shadowRoot));
                }
            });

            return images;
        };

        await Promise.all(
            collectImages(document).map((image) => {
                if (image.complete) {
                    return undefined;
                }

                return new Promise((resolve) => {
                    image.addEventListener('load', resolve, {once: true});
                    image.addEventListener('error', resolve, {once: true});
                });
            })
        );
    });

    await page.waitForTimeout(250);
}

async function capture(browser, url, viewport, kind) {
    const context = await browser.newContext({
        colorScheme: 'light',
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
        viewport: {height: viewport.height, width: viewport.width},
    });
    const page = await context.newPage();

    await page.goto(url, {timeout: 60_000, waitUntil: 'networkidle'});

    if (kind === 'candidate') {
        await page.waitForFunction(() => {
            const host = document.querySelector('nexcent-react-page');

            return Boolean(host?.shadowRoot?.querySelector('.wrapper'));
        });
    }

    await stabilizePage(page, kind);

    const screenshotPath = path.join(
        outputDirectory,
        `${viewport.label}-${kind}.png`
    );

    await page.screenshot({
        animations: 'disabled',
        fullPage: true,
        path: screenshotPath,
    });

    await context.close();

    return screenshotPath;
}

async function compareScreenshots(referencePath, candidatePath, viewport) {
    const reference = PNG.sync.read(await readFile(referencePath));
    const candidate = PNG.sync.read(await readFile(candidatePath));
    const width = Math.max(reference.width, candidate.width);
    const height = Math.max(reference.height, candidate.height);
    const normalizedReference = new PNG({height, width});
    const normalizedCandidate = new PNG({height, width});

    PNG.bitblt(
        reference,
        normalizedReference,
        0,
        0,
        reference.width,
        reference.height,
        0,
        0
    );
    PNG.bitblt(
        candidate,
        normalizedCandidate,
        0,
        0,
        candidate.width,
        candidate.height,
        0,
        0
    );

    const difference = new PNG({height, width});
    const mismatchedPixels = pixelmatch(
        normalizedReference.data,
        normalizedCandidate.data,
        difference.data,
        width,
        height,
        {
            alpha: 0.65,
            diffColor: [255, 0, 0],
            diffColorAlt: [0, 96, 255],
            includeAA: false,
            threshold: 0.15,
        }
    );
    const totalPixels = width * height;
    const mismatchRatio = mismatchedPixels / totalPixels;
    const diffPath = path.join(
        outputDirectory,
        `${viewport.label}-diff.png`
    );

    await writeFile(diffPath, PNG.sync.write(difference));

    return {
        candidateHeight: candidate.height,
        diffPath,
        mismatchedPixels,
        mismatchRatio,
        referenceHeight: reference.height,
        totalPixels,
        viewport: viewport.label,
        width,
    };
}

await mkdir(outputDirectory, {recursive: true});
await Promise.all([waitForServer(referenceURL), waitForServer(candidateURL)]);

const browser = await chromium.launch({headless: true});
const results = [];

try {
    for (const viewport of viewports) {
        const referencePath = await capture(
            browser,
            referenceURL,
            viewport,
            'reference'
        );
        const candidatePath = await capture(
            browser,
            candidateURL,
            viewport,
            'candidate'
        );

        results.push(
            await compareScreenshots(referencePath, candidatePath, viewport)
        );
    }
}
finally {
    await browser.close();
}

const report = {
    candidateURL,
    maximumMismatchRatio,
    referenceURL,
    results,
};

await writeFile(
    path.join(outputDirectory, 'report.json'),
    `${JSON.stringify(report, null, 2)}\n`
);

console.log('\nNexcent visual parity report');
console.log('================================');

for (const result of results) {
    console.log(
        `${result.viewport}px: ${(result.mismatchRatio * 100).toFixed(3)}% ` +
            `(${result.mismatchedPixels}/${result.totalPixels} pixels), ` +
            `height reference=${result.referenceHeight}, candidate=${result.candidateHeight}`
    );
}

const failures = results.filter(
    (result) =>
        result.mismatchRatio > maximumMismatchRatio ||
        result.referenceHeight !== result.candidateHeight
);

if (failures.length > 0) {
    console.error(
        `\nVisual parity failed for: ${failures
            .map((result) => `${result.viewport}px`)
            .join(', ')}`
    );
    process.exitCode = 1;
}
