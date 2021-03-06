(function($z){
$z.declare([
    'zui',
    'wn/util',
    'app/wn.hmaker2/support/hm__methods_panel',
    'ui/form/form',
    'ui/form/c_droplist',
    '/gu/rs/ext/hmaker/hm_runtime.js'
], function(ZUI, Wn, HmMethods, FormUI, DroplistUI){
//==============================================
var html = `
<div class="ui-arena hmc-dynamic-prop" ui-fitparent="yes">
    <h4>{{hmaker.com.dynamic.api}}</h4>
    <header  class="api" ui-gasket="api"></header>
    <aside class="api-info">
        <span>{{hmaker.com.dynamic.params}}</span>
        <b></b>
    </aside>
    <section class="api-params" ui-gasket="params"></section>
    <h4>{{hmaker.com.dynamic.template}}</h4>
    <header  class="tmpl" ui-gasket="template"></header>
    <section class="tmpl-options" ui-gasket="options"></section>
</div>`;
//==============================================
return ZUI.def("app.wn.hm_com_dynamic_prop", {
    dom  : html,
    //...............................................................
    init : function(){
        HmMethods(this);
    },
    //...............................................................
    events : {
        "click .hmc-dynamic-prop > h4" : function(e){
            var jH4 = $(e.currentTarget);
            var jPart = jH4.nextUntil("h4");
            $z.toggleAttr(jH4, "hide-part", "yes");
            jPart.attr("hide-me", jH4.attr("hide-part") || null);
        }
    },
    //...............................................................
    redraw : function() {
        var UI = this;

        // 得到 API 的主目录
        var oApiHome = Wn.fetch("~/.regapi/api");

        // 数据接口列表
        new DroplistUI({
            parent : UI,
            gasketName : "api",
            emptyItem : {},
            items : "obj -mine -match \"api_return:'^(obj|list|page)$'\" -json -l -sort 'pid:1,nm:1'",
            icon  : '<i class="fa fa-plug"></i>',
            text  : null,
            value : function(o){
                return "/" + Wn.getRelativePath(oApiHome, o);
            },
            on_change : function(v){
                UI.uiCom.saveData(null, {api:v, params:{}}, true);
            }
        }).render(function(){
            UI.defer_report("api");
        });

        // 模板列表
        new DroplistUI({
            parent : UI,
            gasketName : "template",
            emptyItem : {},
            items : [],
            icon  : '<i class="fa fa-html5"></i>',
            text  : function(o){
                return o.title || o.value;
            },
            on_change : function(v) {
                UI.uiCom.saveData(null, {template:v, options:{}}, true);
            }
        }).render(function(){
            UI.defer_report("template");
        });
        
        // 返回延迟加载
        return ["api", "template"];
    },
    //...............................................................
    isAsyncUpdate : function(){
        return true;
    },
    //...............................................................
    update : function(com, callback) {
        var UI = this;
        var jApiInfo = UI.arena.find(">.api-info");
        var jParams  = UI.arena.find(">.api-params");
        var jOptions = UI.arena.find(">.tmpl-options");

        // 如果发现属性有不正确的，会标记这个变量，以便通知组件重绘
        var raw_com_json = $z.toJson(com);
        
        // 首先试图寻找 API 对应的信息
        // 得到 api 对象
        var oApi = com.api ? Wn.fetch("~/.regapi/api" + com.api)
                           : null;

        // 根据 API 里面的设定设置 params
        if(oApi) {
            oApi.params = oApi.params || {};
        }
        // 如果没找到，将 api 值空
        else {
            com.api = "";
            com.template = "";
        }

        // 更新 api
        UI.gasket.api.setData(com.api);

        // 显示 API
        var jB = jApiInfo.children("b");
        if(oApi) {
            // 更新 api info 部分
            jApiInfo.show();
            jB.empty();
            $('<u>').text(oApi.api_method  || "GET").appendTo(jB);
            $('<em>').text(oApi.api_return || "obj").appendTo(jB);

            // 更新 params 的 form
            // 并设置 data
            jParams.show();
            var fields = UI.__eval_form_fields_by(oApi.params);
            UI.__draw_form({
                cacheKey : "_finger_api_form",
                finger   : $z.toJson(oApi.params),
                gasketName : "params",
                $pel   : jParams,
                fields : fields
            }, com.params);

            // 更新可用模板列表
            var tmplList = UI.getTemplateList(oApi.api_return);
            UI.gasket.template.setItems(tmplList);

        }
        // 没有参数，清空显示
        else {
            jApiInfo.hide();
            jParams.hide();
        }

        // 更新 template
        UI.gasket.template.setData(com.template);

        // 重新读取一下模板，这样，不在列表里的模板设置将会被设置成空值
        com.template = UI.gasket.template.getData();

        // 试图寻找 template 对应的信息
        var tmplInfo = com.template ? UI.evalTemplate(com.template, true)
                                    : null;

        // 如果没有将 template 置空
        if(!tmplInfo || !HmRT.isMatchDataType(oApi.api_return, tmplInfo.dataType)) {
            com.template = "";
            jOptions.hide();
        }
        // 更新 options 的 form
        // 并设置 data
        else {
            jOptions.show();
            var fields = UI.__eval_form_fields_by(tmplInfo.options);
            UI.__draw_form({
                cacheKey : "_finger_tmpl_options",
                finger   : $z.toJson(tmplInfo.options),
                gasketName : "options",
                $pel   : jOptions,
                fields : fields
            }, com.options);
        }

        // 看看是否需要通知控件重绘
        if(raw_com_json != $z.toJson(com)) {
            UI.uiCom.saveData("panel", com, true);
        }

        // 最后调用回调
        $z.doCallback(callback, []);
    },
    /*...............................................................
    setting : {  // 表单配置信息
        cacheKey : "_finger_api_form",
        finger   : JSON String 
        $pel     : 插入点的 DOM (jQuery),
        fields   : [..]
    }
    data : 要绘制的表单数据
    */
    __draw_form : function(setting, data) {
        var UI = this;

        // 得到之前 form 的 ID
        var uiid   = setting.$pel.children().attr("ui-id");
        var uiForm = uiid ? ZUI(uiid) : null;

        // 如果没有字段，显示空
        if(setting.fields.length == 0) {
            // 销毁表单控件
            if(uiForm)
                uiForm.destroy();

            // 清空缓存指纹
            UI[setting.cacheKey] = null;

            // 显示无参数
            setting.$pel.attr("no-setting","yes")
                .html(UI.msg("hmaker.com._.no_setting"));
            return;
        }

        // 无需创建 form
        if(uiForm && UI[setting.cacheKey] == setting.finger) {
            uiForm.setData(data);
        }
        // 创建表单并赋值
        else {
            if(!uiForm)
                setting.$pel.removeAttr("no-setting").empty();
            new FormUI({
                //parent     : UI,
                //gasketName : setting.gasketName,
                $pel       : setting.$pel,
                mergeData  : false,
                fitparent  : false,
                uiWidth    : "all",
                fields     : setting.fields,
                on_update  : function(){
                    var data = this.getData();
                    UI.uiCom.saveData("panel", $z.obj(setting.gasketName, data), true);
                }
            }).render(function(){
                this.setData(data);
            });
            // 更新缓存指纹
            UI[setting.cacheKey] = setting.finger;
        }
        
    },
    //...............................................................
    // 根据一个 JSON 对象，来生成一个 form 控件的字段配置信息
    // 具体支持什么格式的参数，文档上有描述 hmc_dynamic.md
    __eval_form_fields_by : function(setting) {
        var UI = this;
        var re = [];

        // 解析参数
        var flds = HmRT.parseSetting(setting || {});

        // 循环输出表单字段配置信息
        for(var i=0; i<flds.length; i++) {
            var F = flds[i];
            // 准备字段
            var fld = {
                key      : F.key,
                title    : F.title || F.key,
                tip      : F.tip,
                dft      : F.dft,
                required : F.required,
                key_tip  : F.key == F.title ? null : F.key,
            };

            // 字段: thingset
            if("thingset" == F.type) {
                fld.editAs = "droplist";
                fld.uiConf = {
                    emptyItem : {},
                    items : "obj -mine -match \"tp:'thing_set'\" -json -l -sort 'nm:1' -e '^(id|nm|title)'",
                    icon  : '<i class="fa fa-cubes"></i>',
                    text  : function(o){
                        return o.title || o.nm;
                    },
                    value : function(o){
                        return o.id;
                    }
                };
            }
            // 字段: sites
            else if("site" == F.type) {
                fld.editAs = "droplist";
                fld.valueKey = F.arg,
                fld.uiConf = {
                    emptyItem : {
                        icon  : '<i class="zmdi zmdi-flash"></i>',
                        text  : "i18n:auto",
                        value : "id" == F.arg ? "${siteId}" : "${siteName}",
                    },
                    items : "obj -mine -match \"tp:'hmaker_site', race:'DIR'\" -json -l -sort 'nm:1'",
                    icon  : '<i class="fa fa-sitemap"></i>',
                    text  : function(o){
                        return o.title || o.nm;
                    },
                    value : function(o){
                        return o[this.valueKey || "nm"];
                    }
                };
            }
            // 字段: com
            else if("com" == F.type) {
                fld.editAs = "droplist";
                fld.uiConf = {
                    emptyItem : {
                        text : "i18n:hmaker.com.dynamic.com_none",
                    },
                    itemArgs  : F.arg,
                    items : function(ctype, callback){
                        callback(UI.pageUI().getComList(ctype));
                    },
                    icon  : function(uiCom){
                        if(uiCom)
                            return uiCom.getIconHtml();
                    },
                    text  : function(uiCom){
                        if(uiCom)
                            return uiCom.getComDisplayText();
                    },
                    value : function(uiCom){
                        if(uiCom)
                            return "#<" + uiCom.getComId() + ">";
                    }
                };
            }
            // 字段: link
            else if("link" == F.type) {
                fld.uiType = "app/wn.hmaker2/support/c_edit_link";
            }
            // 字段: 映射表
            else if("mapping" == F.type) {
                fld.type = "object";
                fld.editAs = "pair";
                fld.uiConf = {
                    mergeWith   : true,
                    objTemplate : F.mapping || {}
                };
            }
            // 字段: input 作为默认选项
            else {
                fld.editAs = "input";
            }

            // 计入结果
            re.push(fld);
        }

        // 返回
        return re;
    }
    //...............................................................
});
//===================================================================
});
})(window.NutzUtil);