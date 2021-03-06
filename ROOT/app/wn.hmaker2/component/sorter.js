(function($z){
$z.declare([
    'zui',
    'wn/util',
    'app/wn.hmaker2/support/hm__methods_com',
    '/gu/rs/ext/hmaker/hmc_sorter.js'
], function(ZUI, Wn, HmComMethods){
//==============================================
var html = '<div class="ui-arena hmc-sorter hmc-cnd hm-empty-save"></div>';
//==============================================
return ZUI.def("app.wn.hm_com_sorter", {
    dom     : html,
    keepDom   : true,
    className : "!hm-com-sorter",
    //...............................................................
    init : function(){
        HmComMethods(this);
    },
    //...............................................................
    events : {
        // 设置默认值
        "click ul li" : function(e) {
            if(this.isActived()) {
                var jLi = $(e.currentTarget);
                var index = jLi.prevAll().length;
                this.setEnabled(jLi.attr("enabled") ? -1 : index);
            }
        }
    },
    //...............................................................
    redraw : function(){
        this.arena.addClass("hmc-cnd");
    },
    //...............................................................
    paint : function(com) {
        var UI = this;

        // 标识保存时属性
        UI.arena.addClass("hm-empty-save");

        // 绘制
        UI.arena.hmc_sorter(_.extend({
            forIDE    : true,
            emptyHtml : '<i class="zmdi zmdi-alert-circle-o"></i> ' 
                        + UI.msg("hmaker.com.sorter.empty")
        }, com));
    },
    //...............................................................
    setEnabled : function(index, com) {
        var UI  = this;
        com = com || UI.getData();

        if(_.isArray(com.fields)) {
            for(var i=0; i<com.fields.length; i++) {
                com.fields[i].enabled = (index == i);
            }
            UI.saveData(null, com, true);
        }
    },
    //...............................................................
    getComValue : function() {
        return this.arena.hmc_sorter("value");
    },
    //...............................................................
    // 绘制项目
    __draw_fld : function(fld, jUl) {
        var UI  = this;

        // 得到排序值的 key
        var orKey = fld.order == 1 ? "asc" : "desc";

        var jLi = $('<li>').attr({
            "key"    : fld.name,
            "modify" : fld.modify ? "yes" : null,
            "or-val" : fld.order,
            "or-nm"  : orKey,
            "enabled" : fld.enabled ? "yes" : null,
        });
        
        // 绘制字段标题
        $('<em>').text(fld.text).appendTo(jLi);

        // 绘制排序图标
        $('<span>').attr("or-icon", orKey).appendTo(jLi);

        // 设置固定排序项目
        if(_.isArray(fld.items) && fld.items.length > 0) {
            var orFixed = [];
            for(var i=0; i<fld.items.length; i++) {
                var it = fld.items[i];
                orFixed.push(it.name + ":" + it.order);
            }
            jLi.attr("or-fixed", orFixed.join(","));
        }


        // 加入 DOM
        jUl.append(jLi);
    },
    //...............................................................
    getBlockPropFields : function(block) {
        return [block.mode == 'inflow' ? "margin" : null,
                "padding","border","borderRadius",
                "color", "background",
                "boxShadow","overflow"];
    },
    //...............................................................
    getDefaultData : function(){
        return {
            "fields": [{
                    "text": "按发布日期",
                    "name": "lm",
                    "modify": false,
                    "order": -1
                }, {
                    "text": "按价格",
                    "name": "price",
                    "modify": true,
                    "order": 1
                }]
        };
    },
    //...............................................................
    // 返回属性菜单， null 表示没有属性
    getDataProp : function(){
        return {
            uiType : 'app/wn.hmaker2/com_prop/sorter_prop',
            uiConf : {}
        };
    }
});
//===================================================================
});
})(window.NutzUtil);