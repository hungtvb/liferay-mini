const header = fragmentElement.querySelector('[data-nxc-editable-header]');
const panel = fragmentElement.querySelector('[data-nxc-header-panel]');
const toggle = fragmentElement.querySelector('[data-nxc-header-toggle]');
const toggleLabel = fragmentElement.querySelector(
    '[data-nxc-header-toggle-label]'
);

if (header && panel && toggle && toggleLabel) {
    const closeLabel =
        fragmentElement
            .querySelector('[data-nxc-header-close-label]')
            ?.textContent.trim() || 'Close navigation';
    const openLabel =
        fragmentElement
            .querySelector('[data-nxc-header-open-label]')
            ?.textContent.trim() || 'Open navigation';
    const panelId = `${fragmentEntryLinkNamespace}-editable-header-panel`;
    const mobileMedia = window.matchMedia('(max-width: 767.98px)');

    panel.id = panelId;
    toggle.setAttribute('aria-controls', panelId);

    const setOpen = (open, {focusFirst = false} = {}) => {
        header.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? closeLabel : openLabel);
        toggleLabel.textContent = open ? closeLabel : openLabel;

        if (open && focusFirst) {
            window.requestAnimationFrame(() => {
                panel
                    .querySelector(
                        '.nxc-editable-header__navigation-link, .nxc-editable-header__action'
                    )
                    ?.focus();
            });
        }
    };

    if (layoutMode === 'edit') {
        header.classList.add('is-edit-mode');
        toggle.disabled = true;
        setOpen(true);
    }
    else {
        setOpen(false);

        toggle.addEventListener('click', () => {
            const nextOpen = toggle.getAttribute('aria-expanded') !== 'true';

            setOpen(nextOpen, {focusFirst: nextOpen});
        });

        panel.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                setOpen(false);
            }
        });

        document.addEventListener('click', (event) => {
            if (
                mobileMedia.matches &&
                header.classList.contains('is-open') &&
                !fragmentElement.contains(event.target)
            ) {
                setOpen(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (
                event.key === 'Escape' &&
                header.classList.contains('is-open')
            ) {
                setOpen(false);
                toggle.focus();
            }
        });

        mobileMedia.addEventListener('change', (event) => {
            if (!event.matches) {
                setOpen(false);
            }
        });
    }

    header.dataset.nexcentEditableHeaderReady = 'true';
}
