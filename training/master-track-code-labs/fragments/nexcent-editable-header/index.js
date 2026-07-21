const header = fragmentElement.querySelector('[data-nxc-editable-header]');
const panel = fragmentElement.querySelector('[data-nxc-header-panel]');
const toggle = fragmentElement.querySelector('[data-nxc-header-toggle]');
const toggleLabel = fragmentElement.querySelector(
    '[data-nxc-header-toggle-label]'
);

if (header && panel && toggle && toggleLabel) {
    fragmentElement.__nxcHeaderAbortController?.abort();

    const controller = new AbortController();
    const {signal} = controller;

    fragmentElement.__nxcHeaderAbortController = controller;

    const closeLabel =
        fragmentElement
            .querySelector('[data-nxc-header-close-label]')
            ?.textContent.trim() || 'Close navigation';
    const openLabel =
        fragmentElement
            .querySelector('[data-nxc-header-open-label]')
            ?.textContent.trim() || 'Open navigation';
    const panelId = `${fragmentEntryLinkNamespace}-editable-header-panel`;
    const mobileMedia = window.matchMedia('(max-width: 56.25rem)');

    panel.id = panelId;
    toggle.setAttribute('aria-controls', panelId);

    const setOpen = (open, {focusFirst = false} = {}) => {
        const mobileOpen = mobileMedia.matches && open;

        header.classList.toggle('is-open', mobileOpen);
        toggle.setAttribute('aria-expanded', String(mobileOpen));
        toggle.setAttribute('aria-label', mobileOpen ? closeLabel : openLabel);
        toggleLabel.textContent = mobileOpen ? closeLabel : openLabel;
        panel.setAttribute(
            'aria-hidden',
            String(mobileMedia.matches && !mobileOpen)
        );

        if (mobileOpen && focusFirst) {
            window.requestAnimationFrame(() => {
                panel
                    .querySelector(
                        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                    )
                    ?.focus();
            });
        }
    };

    const syncViewport = () => {
        if (layoutMode === 'edit') {
            header.classList.add('is-edit-mode');
            toggle.disabled = true;
            panel.setAttribute('aria-hidden', 'false');

            return;
        }

        header.classList.remove('is-edit-mode');
        toggle.disabled = false;
        setOpen(false);
    };

    syncViewport();

    if (layoutMode !== 'edit') {
        toggle.addEventListener(
            'click',
            () => {
                const nextOpen =
                    toggle.getAttribute('aria-expanded') !== 'true';

                setOpen(nextOpen, {focusFirst: nextOpen});
            },
            {signal}
        );

        panel.addEventListener(
            'click',
            (event) => {
                if (event.target.closest('a')) {
                    setOpen(false);
                }
            },
            {signal}
        );

        document.addEventListener(
            'click',
            (event) => {
                if (
                    mobileMedia.matches &&
                    header.classList.contains('is-open') &&
                    !fragmentElement.contains(event.target)
                ) {
                    setOpen(false);
                }
            },
            {signal}
        );

        document.addEventListener(
            'keydown',
            (event) => {
                if (
                    event.key === 'Escape' &&
                    header.classList.contains('is-open')
                ) {
                    setOpen(false);
                    toggle.focus();
                }
            },
            {signal}
        );

        mobileMedia.addEventListener('change', syncViewport, {signal});
    }

    header.dataset.nexcentEditableHeaderReady = 'true';
}
