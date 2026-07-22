package com.nexcent.site.shell.rest.internal.resource.v1_0;

import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.site.navigation.model.SiteNavigationMenu;
import com.liferay.site.navigation.model.SiteNavigationMenuItem;
import com.liferay.site.navigation.service.SiteNavigationMenuItemLocalService;
import com.liferay.site.navigation.service.SiteNavigationMenuLocalService;
import com.liferay.site.navigation.type.SiteNavigationMenuItemType;
import com.liferay.site.navigation.type.SiteNavigationMenuItemTypeRegistry;
import com.nexcent.site.shell.rest.dto.v1_0.AccountContext;
import com.nexcent.site.shell.rest.dto.v1_0.NavigationItem;
import com.nexcent.site.shell.rest.dto.v1_0.NavigationMenu;
import com.nexcent.site.shell.rest.dto.v1_0.SiteIdentity;
import com.nexcent.site.shell.rest.dto.v1_0.SiteShell;
import com.nexcent.site.shell.rest.resource.v1_0.SiteShellResource;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

@Component(
    properties = "OSGI-INF/liferay/rest/v1_0/site-shell.properties",
    scope = ServiceScope.PROTOTYPE,
    service = SiteShellResource.class
)
public class SiteShellResourceImpl extends BaseSiteShellResourceImpl {

    @Override
    public SiteShell getSiteSiteShell(Long siteId) throws Exception {
        Group group = _groupLocalService.getGroup(siteId);
        Locale locale = contextAcceptLanguage.getPreferredLocale();
        ThemeDisplay themeDisplay = (ThemeDisplay)contextHttpServletRequest.getAttribute(
            WebKeys.THEME_DISPLAY);
        List<String> warnings = new ArrayList<>();

        SiteShell siteShell = new SiteShell();

        siteShell.setAccount(_toAccountContext(themeDisplay));
        siteShell.setCompanyNavigation(
            _getNavigationMenu(
                group.getGroupId(), "Footer Company", _COMPANY_MENU_ALIASES,
                locale, themeDisplay, warnings));
        siteShell.setHeaderNavigation(
            _getNavigationMenu(
                group.getGroupId(), "Header", _HEADER_MENU_ALIASES, locale,
                themeDisplay, warnings));
        siteShell.setSite(_toSiteIdentity(group, locale, themeDisplay));
        siteShell.setSupportNavigation(
            _getNavigationMenu(
                group.getGroupId(), "Footer Support", _SUPPORT_MENU_ALIASES,
                locale, themeDisplay, warnings));
        siteShell.setWarnings(warnings.toArray(new String[0]));

        return siteShell;
    }

    private NavigationMenu _getNavigationMenu(
            long groupId, String label, String[] aliases, Locale locale,
            ThemeDisplay themeDisplay, List<String> warnings)
        throws Exception {

        SiteNavigationMenu siteNavigationMenu = _resolveNavigationMenu(
            groupId, aliases);
        NavigationMenu navigationMenu = new NavigationMenu();

        navigationMenu.setName(label);

        if (siteNavigationMenu == null) {
            navigationMenu.setExternalReferenceCode(StringPool.BLANK);
            navigationMenu.setNavigationItems(new NavigationItem[0]);
            warnings.add("Missing navigation menu: " + label);

            return navigationMenu;
        }

        navigationMenu.setExternalReferenceCode(
            siteNavigationMenu.getExternalReferenceCode());
        navigationMenu.setName(siteNavigationMenu.getName());
        navigationMenu.setNavigationItems(
            _toNavigationItems(
                siteNavigationMenu.getSiteNavigationMenuId(), 0,
                StringPool.BLANK, locale, themeDisplay, new HashSet<>(), 0
            ).toArray(new NavigationItem[0]));

        return navigationMenu;
    }

    private List<SiteNavigationMenuItem> _getSiteNavigationMenuItems(
            long siteNavigationMenuId, long parentSiteNavigationMenuItemId,
            SiteNavigationMenuItem parentSiteNavigationMenuItem)
        throws Exception {

        if (parentSiteNavigationMenuItem != null) {
            SiteNavigationMenuItemType siteNavigationMenuItemType =
                _siteNavigationMenuItemTypeRegistry.
                    getSiteNavigationMenuItemType(parentSiteNavigationMenuItem);

            if ((siteNavigationMenuItemType != null) &&
                siteNavigationMenuItemType.isDynamic()) {

                return siteNavigationMenuItemType.
                    getChildrenSiteNavigationMenuItems(
                        contextHttpServletRequest,
                        parentSiteNavigationMenuItem);
            }
        }

        return _siteNavigationMenuItemLocalService.
            getSiteNavigationMenuItems(
                siteNavigationMenuId, parentSiteNavigationMenuItemId);
    }

    private SiteNavigationMenu _resolveNavigationMenu(
        long groupId, String[] aliases) {

        for (String alias : aliases) {
            SiteNavigationMenu siteNavigationMenu =
                _siteNavigationMenuLocalService.
                    fetchSiteNavigationMenuByExternalReferenceCode(
                        alias, groupId);

            if (siteNavigationMenu != null) {
                return siteNavigationMenu;
            }
        }

        for (String alias : aliases) {
            SiteNavigationMenu siteNavigationMenu =
                _siteNavigationMenuLocalService.fetchSiteNavigationMenuByName(
                    groupId, alias);

            if (siteNavigationMenu != null) {
                return siteNavigationMenu;
            }
        }

        return null;
    }

    private AccountContext _toAccountContext(ThemeDisplay themeDisplay)
        throws Exception {

        boolean signedIn = !contextUser.isGuestUser();
        AccountContext accountContext = new AccountContext();

        accountContext.setAccountURL(
            (themeDisplay != null) ?
                String.valueOf(themeDisplay.getURLMyAccount()) :
                "/group/control_panel/manage");
        accountContext.setCreateAccountURL(
            (themeDisplay != null) ?
                PortalUtil.getCreateAccountURL(
                    contextHttpServletRequest, themeDisplay) :
                "/web/guest/create-account");
        accountContext.setDisplayName(
            signedIn ? contextUser.getFullName() : StringPool.BLANK);
        accountContext.setEmailAddress(
            signedIn ? contextUser.getEmailAddress() : StringPool.BLANK);
        accountContext.setLoginURL(
            (themeDisplay != null) ? themeDisplay.getURLSignIn() :
                "/c/portal/login");
        accountContext.setLogoutURL(
            (themeDisplay != null) ? themeDisplay.getURLSignOut() :
                "/c/portal/logout");
        accountContext.setPortraitURL(
            (signedIn && (themeDisplay != null)) ?
                contextUser.getPortraitURL(themeDisplay) : StringPool.BLANK);
        accountContext.setSignedIn(signedIn);

        return accountContext;
    }

    private List<NavigationItem> _toNavigationItems(
            long siteNavigationMenuId, long parentSiteNavigationMenuItemId,
            String parentExternalReferenceCode, Locale locale,
            ThemeDisplay themeDisplay, Set<Long> visitedIds, int depth)
        throws Exception {

        if (depth >= _MAX_DEPTH) {
            return List.of();
        }

        SiteNavigationMenuItem parentSiteNavigationMenuItem = null;

        if (parentSiteNavigationMenuItemId > 0) {
            parentSiteNavigationMenuItem =
                _siteNavigationMenuItemLocalService.
                    fetchSiteNavigationMenuItem(
                        parentSiteNavigationMenuItemId);
        }

        List<NavigationItem> navigationItems = new ArrayList<>();
        PermissionChecker permissionChecker =
            PermissionThreadLocal.getPermissionChecker();
        Layout layout = (themeDisplay != null) ? themeDisplay.getLayout() : null;
        int order = 0;

        for (SiteNavigationMenuItem siteNavigationMenuItem :
                _getSiteNavigationMenuItems(
                    siteNavigationMenuId, parentSiteNavigationMenuItemId,
                    parentSiteNavigationMenuItem)) {

            long siteNavigationMenuItemId =
                siteNavigationMenuItem.getSiteNavigationMenuItemId();

            if (!visitedIds.add(siteNavigationMenuItemId)) {
                continue;
            }

            SiteNavigationMenuItemType siteNavigationMenuItemType =
                _siteNavigationMenuItemTypeRegistry.
                    getSiteNavigationMenuItemType(siteNavigationMenuItem);

            if ((siteNavigationMenuItemType == null) ||
                ((permissionChecker != null) &&
                 !siteNavigationMenuItemType.hasPermission(
                     permissionChecker, siteNavigationMenuItem))) {

                continue;
            }

            String externalReferenceCode =
                siteNavigationMenuItem.getExternalReferenceCode();
            String url = siteNavigationMenuItemType.getRegularURL(
                contextHttpServletRequest, siteNavigationMenuItem);
            NavigationItem navigationItem = new NavigationItem();

            navigationItem.setExternalReferenceCode(externalReferenceCode);
            navigationItem.setLabel(
                siteNavigationMenuItemType.getTitle(
                    siteNavigationMenuItem, locale));
            navigationItem.setOrder(order++);
            navigationItem.setParentExternalReferenceCode(
                parentExternalReferenceCode);
            navigationItem.setSelected(
                (layout != null) && siteNavigationMenuItemType.isSelected(
                    true, siteNavigationMenuItem, layout));
            navigationItem.setTarget(
                siteNavigationMenuItemType.getTarget(siteNavigationMenuItem));
            navigationItem.setUrl(
                Validator.isNull(url) ? StringPool.POUND : url);

            navigationItems.add(navigationItem);
            navigationItems.addAll(
                _toNavigationItems(
                    siteNavigationMenuId, siteNavigationMenuItemId,
                    externalReferenceCode, locale, themeDisplay, visitedIds,
                    depth + 1));
        }

        return navigationItems;
    }

    private SiteIdentity _toSiteIdentity(
            Group group, Locale locale, ThemeDisplay themeDisplay)
        throws Exception {

        SiteIdentity siteIdentity = new SiteIdentity();

        siteIdentity.setExternalReferenceCode(group.getExternalReferenceCode());
        siteIdentity.setHomeURL("/web" + group.getFriendlyURL());
        siteIdentity.setLogoURL(
            (themeDisplay != null) ? group.getLogoURL(themeDisplay, true) :
                StringPool.BLANK);
        siteIdentity.setName(group.getDescriptiveName(locale));
        siteIdentity.setSiteId(group.getGroupId());

        return siteIdentity;
    }

    private static final String[] _COMPANY_MENU_ALIASES = {
        "NXC-FOOTER-COMPANY", "NEXCENT-FOOTER-COMPANY",
        "Nexcent Footer Company", "Footer Company"
    };

    private static final String[] _HEADER_MENU_ALIASES = {
        "NXC-HEADER", "NEXCENT-HEADER", "Nexcent Header", "Header"
    };

    private static final int _MAX_DEPTH = 8;

    private static final String[] _SUPPORT_MENU_ALIASES = {
        "NXC-FOOTER-SUPPORT", "NEXCENT-FOOTER-SUPPORT",
        "Nexcent Footer Support", "Footer Support"
    };

    @Reference
    private GroupLocalService _groupLocalService;

    @Reference
    private SiteNavigationMenuItemLocalService
        _siteNavigationMenuItemLocalService;

    @Reference
    private SiteNavigationMenuItemTypeRegistry
        _siteNavigationMenuItemTypeRegistry;

    @Reference
    private SiteNavigationMenuLocalService _siteNavigationMenuLocalService;
}
