<#assign
    heroTitle = title.getData()
    heroHighlight = highlightedText.getData()
    heroDescription = description.getData()
    heroAlt = illustrationAlt.getData()
    heroImageURL = ""
/>

<#if illustration.getData()?has_content>
    <#assign heroImage = jsonFactoryUtil.createJSONObject(illustration.getData()) />
    <#assign heroImageURL = heroImage.getString("url") />
</#if>

<section class="nxc-hero nxc-section">
    <div class="nxc-container nxc-hero__layout">
        <div class="nxc-hero__content">
            <h1 class="nxc-hero__title">
                ${htmlUtil.escape(heroTitle)}
                <#if heroHighlight?has_content>
                    <span>${htmlUtil.escape(heroHighlight)}</span>
                </#if>
            </h1>

            <p class="nxc-hero__description">
                ${htmlUtil.escape(heroDescription)}
            </p>

            <#if ctaLabel.getData()?has_content && ctaUrl.getData()?has_content>
                <a
                    class="nxc-button nxc-button--primary"
                    href="${htmlUtil.escapeHREF(ctaUrl.getData())}"
                    target="${htmlUtil.escapeAttribute(ctaTarget.getData()!'_self')}"
                >
                    ${htmlUtil.escape(ctaLabel.getData())}
                </a>
            </#if>
        </div>

        <#if heroImageURL?has_content>
            <div class="nxc-hero__media">
                <img
                    alt="${htmlUtil.escapeAttribute(heroAlt)}"
                    loading="eager"
                    src="${htmlUtil.escapeHREF(heroImageURL)}"
                />
            </div>
        </#if>
    </div>
</section>
