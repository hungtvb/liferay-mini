<%@ include file="/init.jsp" %>

<div id="<portlet:namespace />contentImportRoot"></div>

<script>
Liferay.Loader.require(
    'nexcent-training-web/js/index',
    function(module) {
        module.default({
            rootId: '<portlet:namespace />contentImportRoot',
            siteId: <%= themeDisplay.getScopeGroupId() %>
        });
    }
);
</script>
