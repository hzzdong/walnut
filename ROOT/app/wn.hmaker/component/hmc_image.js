(function($z){
$z.declare([
    'zui',
    'wn/util',
    'app/wn.hmaker/component/hmc',
    'ui/menu/menu',
    'ui/form/form'
], function(ZUI, Wn, HMC, MenuUI, FormUI){
//==============================================
return ZUI.def("app.wn.hmaker_com_image", {
    //...............................................................
    setProperty : function(key, val){
        var UI = this;

        // 得到属性信息
        var info = UI.parent.getComponentInfo(UI.$el);

        // undefined 自然表示删除
        if(_.isUndefined(val)){
            delete info[key];
        }
        // 否则当做修改
        else {
            info[key] = val;
        }

        // 保存到 DOM 节点
        info = UI.parent.setComponentInfo(UI.$el, info);

        // 将更新过的属性，重新设回到属性面板里
        UI.parent.gasket.prop.setData(info);

        // 更新自己的样式
        UI.updateStyle(info);
    },
    //...............................................................
    updateStyle : function(info){
        var UI = this;
        var ID = UI.$el.prop("id");

        // 先过滤一遍通用规则
        var styleRules = [];
        info = UI.parent.gen_rules(ID, styleRules, info);

        // 再弄一下自己的规则
        var rule = {
            selector : "#"+ID+" .hmc-main",
            items    : []
        };
        for(var key in info){
            if("ID" == key)
                continue;
            var val = info[key];
            var ru  = UI.parent.gen_rule_item(key, val);
            rule.items.push(ru);
        }
        styleRules.push(rule);

        // 应用样式规则
        UI.parent.updateComStyle(UI.$el, styleRules);
    },
    //...............................................................
    checkDom : function(){
        var UI = this;
        var jM = UI.arena.find(".hmc-main");
        var jImg = jM.children("img");
        if(jImg.size() == 0){
            jImg = $('<img>').appendTo(jM);
        }
        if(!jImg.prop("src")){
            var oBlank = Wn.fetchBy("%wn.hmaker: obj $APP_HOME/component/hmc_image_blank.jpg");
            console.log(oBlank)
            jImg.prop("src", "/o/read/id:" + encodeURIComponent(oBlank.id));
        }
    },
    //...............................................................
    redraw : function(){
        var UI  = this;
        var opt = UI.options;

        // 确保 DOM 结构合法
        UI.checkDom();

        // 标题
        opt.$title.html(opt.titleHtml);

        // 获得属性
        var info = UI.parent.getComponentInfo(UI.$el);

        new FormUI({
            $pel   : opt.$prop,
            fields : [opt.propSetup, {
                title  : 'i18n:hmaker.cprop_special',
                fields : [{
                    key    : "color",
                    title  : "i18n:hmaker.cprop.color",
                    type   : "string",
                    nullAsUndefined : true
                }, {
                    key    : "fontSize",
                    title  : "i18n:hmaker.cprop.fontSize",
                    type   : "int",
                    uiConf : {unit : "px"}
                }, {
                    key    : "lineHeight",
                    title  : "i18n:hmaker.cprop.lineHeight",
                    type   : "int",
                    uiConf : {unit : "px"}
                }, {
                    key    : "letterSpacing",
                    title  : "i18n:hmaker.cprop.letterSpacing",
                    type   : "int",
                    uiConf : {unit : "px"}
                }]
            }],
            on_change : function(key, val) {
                // console.log("detect form change: ", key, val);
                UI.setProperty(key, val);
            }
        }).render(function(){
            //console.log(this.parent.uiName);
            this.setData(info);
        });

        // 菜单
        new MenuUI({
            $pel   : opt.$menu,
            setup  : [{
    //.......................................... 置底
    icon    : '<i class="fa fa-angle-double-down"></i>',
    tip     : 'i18n:hmaker.com_mv_bottom',
    handler : function(){
        console.log(this.gasket.prop.getData())
    }
}]
        }).render(function(){
            //console.log(this.parent.uiName);
        });
    }
    //...............................................................
});
//===================================================================
});
})(window.NutzUtil);