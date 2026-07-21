const navigation = fragmentElement.querySelector(
    '[data-nxc-mobile-navigation]'
);
const panel = fragmentElement.querySelector('[data-nxc-navigation-panel]');
const toggle = fragmentElement.querySelector('[data-nxc-navigation-toggle]');
const toggleLabel = fragmentElement.querySelector(
    '[data-nxc-navigation-label]'
);

if (navigation && panel && toggle && toggleLabel) {
    const closeLabel =
        fragmentElement
            .querySelector('[data-nxc-close-label]')
            ?.textContent.trim() || 'Close navigation';
    const openLabel =
        fragmentElement
            .querySelector('[data-nxc-open-label]')
            ?.textContent.trim() || 'Open navigation';
    const panelId = `${fragmentEntryLinkNamespace}-navigation-panel`;

    panel.id = panelId;
    toggle.setAttribute('aria-controls', panelId);

    const setOpen = (open) => {
        navigation.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? closeLabel : openLabel);
        toggleLabel.textContent = open ? closeLabel : openLabel;
    };

    if (layoutMode === 'edit') {
        navigation.classList.add('is-edit-mode');
        toggle.disabled = true;
        setOpen(true);
    }
    else {
        setOpen(false);

        toggle.addEventListener('click', () => {
            setOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });

        fragmentElement.addEventListener('click', (event) => {
            const link = event.target.closest('a');

            if (link && panel.contains(link)) {
                setOpen(false);
            }
        });

        fragmentElement.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
                toggle.focus();
            }
        });
    }

    navigation.dataset.nexcentMobileNavigationReady = 'true';
}
