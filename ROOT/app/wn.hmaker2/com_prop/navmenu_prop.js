(function($z){
$z.declare([
    'zui',
    'wn/util',
    'app/wn.hmaker2/hm__methods_panel',
    'ui/form/form',
    'ui/mask/mask'
], function(ZUI, Wn, HmMethods, FormUI, MaskUI){
//==============================================
var html = `
<div class="ui-code-template">
    <div code-id="item" class="cnavmp-item">
        <span key="newtab">
            <u><i class="fa fa-check-square"></i><i class="fa fa-square-o"></i></u>
            <em>{{hmaker.com.navmenu.newtab}}</em>
        </span>
        <span key="link-icon"><i class="zmdi zmdi-label-alt"></i></span>
        <span key="toar-icon" balloon="right:hmaker.com.navmenu.toar_check_tip"><i class="ui-radio"></i></span>
        <span key="text"></span>
        <span key="toar-bid">
            <i class="zmdi zmdi-arrow-right"></i>
            <em>{{hmaker.com.navmenu.toar_area_none}}</em>
            <i class="zmdi zmdi-caret-down"></i>
        </span>
        <span key="href"></span>
    </div>
    <div code-id="empty" class="cnavmp-empty">
        <i class="fa fa-warning"></i> {{hmaker.com.navmenu.empty}}
    </div>
    <div code-id="toar.drop" class="toar-drop">
        <ul>
            <li value=""><i class="zmdi zmdi-minus"></i><em>{{hmaker.com.navmenu.toar_area_none}}</em>
        </ul>
    </div>
</div>
<div class="ui-arena hmc-navmenu-prop" ui-fitparent="yes">
    <section class="cnavmp-form" ui-gasket="form"></section>
    <section class="cnavmp-actions">
        <ul>
            <li act="createItem"><i class="fa fa-plus"></i> {{hmaker.com._.create}}</li>
            <li act="deleteItem"><i class="zmdi zmdi-delete"></i> {{hmaker.com._.del}}</li>
            <li act="movePrev"><i class="zmdi zmdi-long-arrow-up"></i> {{hmaker.com._.move_up}}</li>
            <li act="moveNext"><i class="zmdi zmdi-long-arrow-down"></i> {{hmaker.com._.move_down}}</li>
        </ul>
    </section>
    <section class="cnavmp-item-list"></section>
</div>`;
//==============================================
return ZUI.def("app.wn.hm_com_navmenu_prop", {
    dom  : html,
    //...............................................................
    init : function(){
        HmMethods(this);
    },
    //...............................................................
    events : {
        // 各种动作
        'click .cnavmp-actions li' : function(e) {
            var UI = this;
            var jq = $(e.currentTarget);
            var actionName = jq.attr("act");

            // 创建的话什么参数都不需要
            if("createItem" == actionName) {
                $z.invoke(UI.uiCom, actionName);
            }
            // 其他的需要一个当前高亮项
            else {
                var jItem = UI.currentItem();
                if(jItem.length == 0) {
                    alert(UI.msg('hmaker.com.navmenu.nocurrent'));
                    return;
                }
                var index = jItem.prevAll().length;
                $z.invoke(UI.uiCom, actionName, "createItem"==actionName?[]:[index]);
            }
        },
        // 切换当前项目
        'click .cnavmp-item' : function(e) {
            var UI = this;
            var jItem = $(e.currentTarget);
            var index = jItem.prevAll().length;

            UI.uiCom.selectItem(index);
        },
        // 区域显示: 默认高亮项目
        'click .cnavmp-item > span[key="toar-icon"]' : function(e) {
            e.stopPropagation();
            var UI = this;
            var jRadio = $(e.currentTarget).children(".ui-radio");

            // 已经选中了，取消选中
            if(jRadio.attr("checked")) {
                UI.uiCom.uncheckToggleAreaItem();
            }
            // 选中指定项目
            else {
                var jItem  = $(e.currentTarget).closest(".cnavmp-item");
                var index  = jItem.prevAll().length;
                UI.uiCom.checkToggleAreaItem(index);
            }
        },
        // 编辑文字
        'click .cnavmp-item[current] span[key="text"]' : function(e) {
            var UI = this;
            var jq = $(e.currentTarget);
            var jItem = jq.closest(".cnavmp-item");
            var index = jItem.prevAll().length;

            $z.editIt(jq, function(newval, oldval) {
                if(newval && newval!=oldval) {
                    UI.uiCom.updateItemField(index, "text", newval);
                }
            });
        },
        // 区域显示: 选择目标区域
        'click .cnavmp-item[current] > span[key="toar-bid"]' : function(e) {
            e.stopPropagation();
            var UI = this;
            var jBID  = $(e.currentTarget);
            var jItem = jBID.closest(".cnavmp-item");

            // 得到当前的分栏
            var comId = UI.gasket.form.getData("layoutComId");
            
            // 如果没有分栏，则显示警告
            if(!comId){
                alert(UI.msg("hmaker.com.navmenu.toar_no_bar"));
                return;
            }

            // 获取分栏下的区域列表
            var biList = UI.pageUI().getLayoutComBlockDataArray(comId);

            // 显示一个下拉框(带全局覆盖的 masker)
            var jDropMask = $('<div class="toar-drop-mask"></div>').appendTo(jItem);
            var jDrop     = UI.ccode("toar.drop").appendTo(jItem);
            var jDropUl   = jDrop.find("ul");

            // 循环添加项目
            for(var bi of biList) {
                $('<li><i class="fa fa-square-o"></i><b></b></li>')
                    .attr({
                        "value" : bi.bid
                    }).appendTo(jDropUl)
                        .find('b').text(bi.bid);
            }

            // 最后让内容区域，停靠到正确的地方
            $z.dock(jBID, jDrop);
        },
        'click .cnavmp-item .toar-drop-mask' : function(e) {
            e.stopPropagation();
            var jDropMask = $(e.currentTarget);
            var jDrop     = jDropMask.next();

            jDrop.remove();
            jDropMask.remove();
        },
        'click .cnavmp-item .toar-drop li' : function(e) {
            e.stopPropagation();
            var UI  = this;
            var jq  = $(e.currentTarget);
            var val = jq.attr("value");

            var jItem = jq.closest(".cnavmp-item");
            var index = jItem.prevAll().length;
            
            UI.uiCom.updateItemField(index, "toarId", val || null);
        },
        // 编辑链接
        'click .cnavmp-item[current] span[key="href"]' : function(e) {
            var UI = this;
            var jq = $(e.currentTarget);
            var jItem = jq.closest(".cnavmp-item");
            var index = jItem.prevAll().length;
            var item  = UI.uiCom.getItemData(index);
            var oHome = UI.getHomeObj();

            // 弹出遮罩层
            new MaskUI({
                app : UI.app,
                dom : 'ui/pop/pop.html',
                css : 'ui/pop/pop.css',
                events : {
                    "click .pm-btn-ok" : function(){
                        var href = this.body.getData();
                        UI.uiCom.updateItemField(index, "href", href);
                        this.close();
                    },
                    "click .pm-btn-cancel" : function(){
                        this.close();
                    }
                }, 
                setup : {
                    uiType : 'ui/support/edit_link',
                    uiConf : {
                        setup : {
                            defaultPath : oHome
                        },
                        ext : {
                            test : function(str) {
                                return /^be:.+$/.test(str);
                            },
                            uiType : 'app/wn.hmaker2/support/edit_behavior',
                            uiConf : {
                                uiPage : this.pageUI()
                            }
                        }
                    }
                }
            }).render(function(){
                this.$main.find('.pm-title').text(UI.msg('hmaker.edit_link.title'));
                this.body.setData(item.href);
            });
        },
        // 是否打开新窗口
        'click .cnavmp-item span[key="newtab"]' : function(e) {
            var UI = this;
            var jq = $(e.currentTarget);
            var jItem = jq.closest(".cnavmp-item");
            var index = jItem.prevAll().length;
            var item  = UI.uiCom.getItemData(index);

            // 没必要冒泡了，因为任何非激活的项目都可以点击这个
            // 点了这个，会导致本空间的所有 dom 被重刷的
            e.stopPropagation();

            UI.uiCom.updateItemField(index, "newtab", !item.newtab);
        },
    },
    //...............................................................
    currentItem : function() {
        return this.arena.find(".cnavmp-item[current]");
    },
    //...............................................................
    redraw : function() {
        var UI = this;

         // 通用样式设定
        new FormUI({
            parent : UI,
            gasketName : "form",
            uiWidth : "all",
            on_change : function(key, val) {
                // 如果是改变了类型
                if("atype" == key) {
                    // 重新刷新一下分栏列表
                    if("toggleArea" == val){
                        this.enableField("layoutComId");
                        UI.__reload_toggleAreaItems();
                    }
                    // 否则禁止分栏列表
                    else {
                        this.disableField("layoutComId");
                    }
                    // 更新菜单条项目编辑模式
                    UI._update_menu_items($z.obj(key, val));
                }
                // 最后通知修改
                UI.notifyComChange($z.obj(key, val));
            },
            parseData : function(com){
                // 根据菜单的链接类型，来处理下拉列表的启用状态
                if("toggleArea" == com.atype){
                    this.enableField("layoutComId");
                }
                // 禁用分栏选择下拉列表
                else {
                    this.disableField("layoutComId");
                }
                return com;
            },
            fields : [{
                key   : "mode",
                title : "i18n:hmaker.com.navmenu.mode",
                type  : "string",
                editAs : "switch", 
                uiConf : {
                    items : [{
                        text : 'i18n:hmaker.com.navmenu.mode_default',
                        val  : 'default',
                    }, {
                        text : 'i18n:hmaker.com.navmenu.mode_aside',
                        val  : 'aside',
                    }]
                }
            }, {
                key   : "itemAlign",
                title : "i18n:hmaker.com.navmenu.itemAlign",
                type  : "string",
                editAs : "switch", 
                uiConf : {
                    items : [{
                        icon : '<i class="fa fa-align-left">',
                        val  : 'left',
                    }, {
                        icon : '<i class="fa fa-align-center">',
                        val  : 'center',
                    }, {
                        icon : '<i class="fa fa-align-right">',
                        val  : 'right',
                    }]
                }
            }, {
                key   : "atype",
                title : "i18n:hmaker.com.navmenu.atype.title",
                type  : "string",
                dft : "link",
                editAs : "switch",
                uiConf : {
                    items : [{
                        text : 'i18n:hmaker.com.navmenu.atype.link',
                        val  : 'link',
                    }, {
                        text : 'i18n:hmaker.com.navmenu.atype.toggleArea',
                        val  : 'toggleArea',
                    }]
                }
            }, {
                key   : "layoutComId",
                title : "i18n:hmaker.com.navmenu.atype.layoutComId",
                type  : "string",
                disabled : true,
                editAs : "droplist",
                uiConf : {
                    icon  : function(ag){
                        return UI.msg("hmaker.com."+ag.ctype+".icon");
                    },
                    text  : function(ag){
                        return UI.msg("hmaker.com."+ag.ctype+".name")+"#"+ag.cid;
                    },
                    value : function(ag){
                        return ag.cid;
                    },
                    items : []
                }
            }]
        }).render(function(){
            UI.__reload_toggleAreaItems();
            UI.defer_report("form");
        });

        // 返回延迟加载
        return ["form"];
    },
    //...............................................................
    __reload_toggleAreaItems : function(){
        var UI   = this;
        var items = UI.pageUI().getLayoutComInfoList();

        var cLayout = UI.gasket.form.getFormCtrl("layoutComId");
        var clData  = cLayout.getData();
        cLayout.setItems(items);
        cLayout.setData(clData);
    },
    //...............................................................
    update : function(com) {
        var UI = this;
        var jList = UI.arena.find('.cnavmp-item-list').empty();

        // 首先得到所有的菜单项
        var items = UI.uiCom.getMenuItems();
        
        // 显示空
        if(items.length == 0) {
            jList.append(UI.ccode("empty"));
        }
        // 显示列表
        else {
            for(var item of items) {
                var jItem = UI.ccode("item").appendTo(jList);
                jItem.attr("current", item.current ? "yes" : null);
                jItem.children('[key="toar-icon"]').children("i").attr({
                    "checked" : item.toarChecked ? "yes" : null
                });
                jItem.children('[key="text"]').text(item.text);
                jItem.children('[key="href"]')
                    .text(item.href || this.msg("hmaker.com.navmenu.nohref"))
                    .attr("nohref", item.href ? null : "yes");
                jItem.children('[key="newtab"]').attr("open-newtab", item.newtab ? "yes" : null);
                if(item.toarId) {
                    var jToarId = jItem.children('[key="toar-bid"]');
                    jToarId.attr("toar-id", item.toarId)
                        .find("em").text(item.toarId);
                }
            }
        }

        // 让高亮的滚屏出来
        var jCurrentItem = jList.find('[current]');
        if(jCurrentItem.length > 0) {
            var rectList = $z.rect(jList);
            var rectItem = $z.rect(jCurrentItem);
            // console.log($z.rectObj(rectList,"top,bottom"), $z.rectObj(rectItem, "top,height"))
            if(rectItem.bottom >= rectList.bottom || rectItem.top <= rectList.top){
                jCurrentItem[0].scrollIntoView(false);
            }
        }

        // 更新菜单条项目编辑模式
        UI._update_menu_items(com);

        // 更新 form
        UI.gasket.form.update(com);

        // 打开提示
        UI.balloon();

        // 最后在调用一遍 resize
        UI.resize(true);
    },
    //...............................................................
    // 根据 com.atype 来表示菜单列表的显示模式
    _update_menu_items : function(com) {
        this.arena.find('.cnavmp-item-list').attr({
            "atype" : com.atype || "link"
        });
    },
    //...............................................................
    resize : function() {
        // var UI = this;
        // var jS0 = UI.arena.find(".cnavmp-item-list");
        // var jS1 = UI.arena.find(".cnavmp-actions");
        // var jForm   = UI.arena.find(".cnavmp-form");

        // var H = UI.arena.height();
        // jForm.css({
        //     "height" : H - jS0.outerHeight(true) - jS1.outerHeight(true)
        // });
    }
});
//===================================================================
});
})(window.NutzUtil);