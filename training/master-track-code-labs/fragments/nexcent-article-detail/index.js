const articleDetail = fragmentElement.querySelector('[data-nxc-article-detail]');
const backLink = fragmentElement.querySelector('.nxc-article-detail__back-link');

if (articleDetail) {
    articleDetail.dataset.runtimeState = 'ready';
}

if (backLink) {
    backLink.addEventListener('click', (event) => {
        let hasSameSiteReferrer = false;

        try {
            hasSameSiteReferrer =
                Boolean(document.referrer) &&
                new URL(document.referrer).origin === window.location.origin;
        }
        catch {
            hasSameSiteReferrer = false;
        }

        if (hasSameSiteReferrer && window.history.length > 1) {
            event.preventDefault();
            window.history.back();
        }
    });
}
