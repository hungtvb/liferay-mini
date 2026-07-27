const COLOR_TOKEN_BY_HEX: Record<string, string> = {
    '#18191f': 'var(--nxc-color-navigation, #18191f)',
    '#237d31': 'var(--nxc-color-primary-active, #237d31)',
    '#263238': 'var(--nxc-color-secondary, #263238)',
    '#388e3b': 'var(--nxc-color-primary-hover, #388e3b)',
    '#4caf4f': 'var(--nxc-color-primary, #4caf4f)',
    '#4d4d4d': 'var(--nxc-color-heading, #4d4d4d)',
    '#717171': 'var(--nxc-color-text, #717171)',
    '#89939e': 'var(--nxc-color-muted, #89939e)',
    '#abbed1': 'var(--nxc-color-border, #abbed1)',
    '#d9dbe1': 'var(--nxc-color-footer-placeholder, #d9dbe1)',
    '#e8f5e9': 'var(--nxc-color-accent-surface, #e8f5e9)',
    '#f5f7fa': 'var(--nxc-color-surface, #f5f7fa)',
    '#fff': 'var(--nxc-color-white, #fff)',
    '#ffffff': 'var(--nxc-color-white, #ffffff)',
};

export function normalizeCssDeclarationValue(value: string): string {
    return value
        .replace(/(-?\d*\.?\d+)rem\b/g, (_, rawValue: string) => {
            const pixels = Number(rawValue) * 10;
            const normalized = Number.isInteger(pixels)
                ? pixels
                : Number(pixels.toFixed(3));

            return `${normalized}px`;
        })
        .replace(
            /#(?:ffffff|4caf4f|388e3b|237d31|263238|4d4d4d|717171|89939e|18191f|abbed1|f5f7fa|e8f5e9|d9dbe1|fff)(?![0-9a-f])/gi,
            (rawColor: string) =>
                COLOR_TOKEN_BY_HEX[rawColor.toLowerCase()] ?? rawColor
        );
}
