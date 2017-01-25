(function($z){
$z.declare([
    'zui',
    'wn/util',
    'ui/form/form',
    'ui/menu/menu',
    'app/wn.hmaker2/support/hm__methods_panel',
], function(ZUI, Wn, FormUI, MenuUI, HmMethods){
//==============================================
var html = `
<div class="ui-arena hm-prop-page" ui-fitparent="yes">
    <div class="pp-attr">
        <header>
            <i class="zmdi zmdi-alert-circle-o"></i>
            <b>{{hmaker.page.attr}}</b>
        </header>
        <section ui-gasket="form"></section>
    </div>
    <div class="pp-links">
        <header>
            <i class="zmdi zmdi-link"></i>
            <b>{{hmaker.page.links}}</b>
        </header>
        <aside ui-gasket="menu"></aside>
        <section><div></div></section>
    </div>
</div>
`;
//==============================================
return ZUI.def("app.wn.hm_prop_page", {
    dom  : html,
    //...............................................................
    init : function() {
        var UI = HmMethods(this);

        UI.listenBus("active:page",  UI.refresh);
    },
    //...............................................................
    redraw : function(){
        var UI = this;

        // 页面设置
        new FormUI({
            parent : UI,
            gasketName : "form",
            arenaClass : "page-form",
            fitparent : false,
            on_change : function(){
                var attr = this.getData();
                UI.pageUI().setPageAttr(attr);
            },
            uiWidth : "all",
            fields : [{
                key    : "title",
                title  : "i18n:hmaker.page.title",
                type   : "string",
                editAs : "input"
            }, {
                key    : "margin",
                title  : "i18n:hmaker.page.margin",
                type   : "string",
                dft    : "",
                emptyAsNull : false,
                editAs : "input"
            }, {
                key    : "color",
                title  : "i18n:hmaker.prop.color",
                type   : "string",
                dft    : "",
                emptyAsNull : false,
                editAs : "color",
            }, {
                key    : "background",
                title  : "i18n:hmaker.prop.background",
                type   : "string",
                dft    : "",
                emptyAsNull : false,
                editAs : "background",
                uiConf : UI.getBackgroundImageEditConf()
            }]
        }).render(function(){
            UI.defer_report("form");
        });

        // 链接资源的操作菜单
        new MenuUI({
            parent : UI,
            gasketName : "menu",
            setup : [{
                icon : '<i class="zmdi zmdi-plus"></i>',
                text : "i18n:hmaker.page.links_add",
                handler : function(){
                    UI.alert("add");
                }
            }, {
                icon : '<i class="zmdi zmdi-refresh"></i>',
                text : "i18n:hmaker.page.links_refresh",
                handler : function(){
                    UI.alert("refresh");
                }
            }]
        }).render(function(){
            UI.defer_report("menu");
        });

        // 返回延迟加载
        return ["form", "menu"];
    },
    //...............................................................
    refresh : function(){
        var attr = this.pageUI().getPageAttr(true);
        this.gasket.form.setData(attr);       
    },
    //...............................................................
    resize : function(){
        var UI = this;
        var jAttr  = UI.arena.find(">.pp-attr");
        var jLinks = UI.arena.find(">.pp-links");
        
        // 计算链接区域整体高度
        var H  = UI.arena.height();
        var H0 = jAttr.outerHeight(true);
        var H1 = H - H0 - 2;
        jLinks.css("height", Math.max(H1, 240));

        // 计算链接列表起始位置
        var jLinksHead  = jLinks.children("header");
        var jLinksAside = jLinks.children("aside");
        var jLinksList  = jLinks.children("section");
        jLinksList.css("top", jLinksHead.outerHeight(true)
                            + jLinksAside.outerHeight(true));
    },
    //...............................................................
});
//===================================================================
});
})(window.NutzUtil);