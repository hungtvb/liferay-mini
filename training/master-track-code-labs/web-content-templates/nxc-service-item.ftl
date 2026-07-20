<#assign
    serviceTitle = title.getData()
    serviceDescription = description.getData()
    serviceIconURL = ""
/>

<#if icon.getData()?has_content>
    <#assign serviceIcon = jsonFactoryUtil.createJSONObject(icon.getData()) />
    <#assign serviceIconURL = serviceIcon.getString("url") />
</#if>

<article class="nxc-service-card">
    <#if serviceIconURL?has_content>
        <img
            alt="${htmlUtil.escapeAttribute(iconAlt.getData())}"
            class="nxc-service-card__icon"
            loading="lazy"
            src="${htmlUtil.escapeHREF(serviceIconURL)}"
        />
    </#if>

    <h3>${htmlUtil.escape(serviceTitle)}</h3>
    <p>${htmlUtil.escape(serviceDescription)}</p>

    <#if linkLabel.getData()?has_content && linkUrl.getData()?has_content>
        <a class="nxc-link" href="${htmlUtil.escapeHREF(linkUrl.getData())}">
            ${htmlUtil.escape(linkLabel.getData())}
        </a>
    </#if>
</article>
