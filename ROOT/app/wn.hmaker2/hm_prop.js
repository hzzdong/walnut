(function($z){
$z.declare([
    'zui',
    'wn/util',
    'ui/menu/menu',
    'app/wn.hmaker2/hm__methods_panel',
    'app/wn.hmaker2/hm_prop_folder',
    'app/wn.hmaker2/hm_prop_page',
    'app/wn.hmaker2/hm_prop_edit',
    'app/wn.hmaker2/hm_prop_other',
], function(ZUI, Wn, MenuUI, 
    HmPanelMethods,
    PropFolderUI,
    PropPageUI,
    PropEditUI,
    PropOtherUI){
//==============================================
var html = function(){/*
<div class="ui-arena hm-panel hm-prop" ui-fitparent="yes">
    <header>
        <ul class="hm-W">
            <li class="hmpn-tt"><i class="zmdi zmdi-settings"></i> {{hmaker.prop.title}}</li>
            <li class="hmpn-opt" ui-gasket="opt"></li>
            <li class="hmpn-pin"><i class="fa fa-thumb-tack"></i></li>
        </ul>
    </header>
    <section>
        <div class="hmpp-con hmpp-con-folder"  ui-gasket="folder"></div>
        <div class="hmpp-con hmpp-con-page"    ui-gasket="page"></div>
        <div class="hmpp-con hmpp-con-edit"    ui-gasket="edit"></div>
        <div class="hmpp-con hmpp-con-other"   ui-gasket="other"></div>
    </section>
</div>
*/};
//==============================================
return ZUI.def("app.wn.hm_prop", {
    dom  : $z.getFuncBodyAsStr(html.toString()),
    css  : "theme/app/wn.hmaker2/hmaker_prop.css",
    //...............................................................
    init : function() {
        var UI = HmPanelMethods(this);
        
        UI.listenBus("active:block",  function(){UI.showProp("edit");});
        UI.listenBus("active:com",    function(){UI.showProp("edit");});
        UI.listenBus("active:page",   function(){UI.showProp("page");});
        UI.listenBus("active:folder", function(){UI.showProp("folder");});
        UI.listenBus("active:other",  function(){UI.showProp("other");});
    },
    //...............................................................
    redraw : function() {
        var UI = this;

        // 文件夹
        new PropFolderUI({
            parent : UI,
            gasketName : "folder"
        }).render(function(){
            UI.defer_report("folder");
        });
        
        // 页
        new PropPageUI({
            parent : UI,
            gasketName : "page"
        }).render(function(){
            UI.defer_report("page");
        });

        // 编辑控件&块
        new PropEditUI({
            parent : UI,
            gasketName : "edit"
        }).render(function(){
            UI.defer_report("edit");
        });

        // 其他
        new PropOtherUI({
            parent : UI,
            gasketName : "other"
        }).render(function(){
            UI.defer_report("other");
        });

        // 返回延迟加载
        return ["folder", "page", "edit", "other"];
    },
    //...............................................................
    showProp : function(key) {
        var UI = this;
        UI.arena.find("section>.hmpp-con")
            .removeAttr("current")
                .filter(".hmpp-con-"+key)
                    .attr("current", "yes");
        UI.resize(true);
    }
    //...............................................................
});
//===================================================================
});
})(window.NutzUtil);