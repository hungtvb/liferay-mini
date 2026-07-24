const footer = fragmentElement.querySelector('[data-nxc-editable-footer]');

if (footer) {
    if (layoutMode === 'edit') {
        footer.classList.add('is-edit-mode');
    }

    footer.dataset.nexcentEditableFooterReady = 'true';
}
