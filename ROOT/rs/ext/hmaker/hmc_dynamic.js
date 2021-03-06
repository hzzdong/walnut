(function($, $z){
//...........................................................
function draw_data(jData, opt, data) {
    // 得到模板信息
    var tmplInfo = opt.tmplInfo;
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 转换数据
    //console.log("dynamic draw", data);
    var d2 = HmRT.convertDataForTmpl(data, tmplInfo.dataType);
    if(HmRT.isDataEmptyForTmpl(d2, tmplInfo.dataType)) {
         $('<div class="msg-info">').text("No Data").appendTo(jData);
        return;
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 准备绘制模板参数
    var tmplOptions = _.extend(opt.options);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 确保设置模板皮肤
    if(opt.skinSelector)
        jData.prop("className", opt.skinSelector);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 调用模板的 jQuery 插件进行绘制
    jData[tmplInfo.name](d2, tmplOptions);
}
//...........................................................
function each_pager(opt, callback){
    if("page" == opt.apiInfo.api_return) {
        //console.log(data.pager)
        // 先解析一下 API 的设置参数
        var setting = HmRT.parseSetting(opt.apiInfo.params);
        for(var i=0; i<setting.length; i++) {
            // 寻找可以选用翻页条的项目: @com || @com:pager 
            var conf = setting[i];
            if(conf.type == "com" &&
                (!conf.arg || conf.arg.indexOf("pager") >= 0)) {
                // 在 com 中找到对应的翻页条并设置数据
                var ta = $.trim((opt.params||{})[conf.key]);
                var m  = /^#<([^>]+)>$/.exec(ta);
                if(m) {
                    var jPager = $("#" + m[1] + " > .hmc-pager");
                    callback(jPager);
                }
            }
        }
    }
}
//...........................................................
function update_pager(opt, data) {
    if(data && data.pager && data.list){
        each_pager(opt, function(jPager){
            jPager.hmc_pager("value", data.pager);
        });
    }
}
//...........................................................
function jump_pager_to_head(opt) {
    each_pager(opt, function(jPager){
        jPager.hmc_pager("jumpTo", 1);
    });
}
//...........................................................
function conver_params(opt) {
    //console.log(opt.apiInfo.params);
    var setting = HmRT.parseSetting(opt.apiInfo.params || {}, true);
    var re  = HmRT.evalResult(opt.params, {
        context : opt.paramContext,
        setting : setting,
        request : window.__REQUEST,
        getComValue : function(comId) {
            var jTa  = $("#" + comId);
            var jqfn = jTa.attr("wn-rt-jq-fn");
            var selector = jTa.attr("wn-rt-jq-selector");
            if(jqfn) {
                var re;
                if(selector){
                    var jTa2 = jTa.find(selector);
                    re = jTa2[jqfn]("value");
                }else{
                    re = jTa[jqfn]("value");
                }
                return re;
            }
        }
    });
    return re.data;
}
//...........................................................
function do_reload(jData, jumpToHead){
    var opt = jData.data("@OPT") || {};

    // 需要强制调整相关分页条到顶部
    if(jumpToHead) {
        jump_pager_to_head(opt);
    }
    //console.log("dynamic do_reload")
    // 检查 api
    if(!opt.apiUrl){
        $('<div class="msg-error">').text("No Api!").appendTo(jData);
        return jData;
    }

    // 检查模板
    if(!opt.tmplInfo){
        $('<div class="msg-error">').text("No Template!").appendTo(jData);
        return jData;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 将参数处理成可向数据接口提交的形式
    var params;
    try{
        params = conver_params(opt);
    }
    // 处理参数解析的错误
    catch(errMsg){
        $('<div class="msg-error">').text(errMsg).appendTo(jData);
        throw errMsg;
    }

    // 请求
    var method = opt.apiInfo.api_method == "POST" ? "post" : "get";
    $[method](opt.apiUrl, params||{}, function(re){
        // 清除正在加载的显示
        jData.empty();

        // api 返回错误
        if(/^e[.]/.test(re)){
            $('<div class="msg-error">').text(re).appendTo(jData);
            return jData;
        }
        // 试图解析数据
        try {
            // 记录数据
            var data = $z.fromJson(re);

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // 如果数据是翻页信息，那么还需要找到翻页控件，并更新它的值
            update_pager(opt, data);

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // 绘制数据
            draw_data(jData, opt, data);

        }
        // 接口调用错误
        catch (errMsg) {
            $('<div class="msg-error">').text(errMsg).appendTo(jData);
            throw errMsg;
        }
    });

    // 返回自身以便链式赋值
    return this;
}
//...........................................................
// 命令模式
var CMD = {
    reload : function(jumpToHead){
        do_reload(this, jumpToHead);
    }
}
//...........................................................
$.fn.extend({ "hmc_dynamic" : function(opt){
    // 命令模式
    if(_.isString(opt)) {
        var args = Array.from(arguments);
        return CMD[opt].apply(this, args.slice(1));
    }

    // 记录自己
    var jData = this;

    // 得到自己的 ID
    var myId = jData.parent().attr("id");

    // 记录自己的配置项
    jData.data("@OPT", opt);

    // 首先关联所有与自己相关的控件
    var setting = HmRT.parseSetting(opt.apiInfo.params);
    for(var i=0; i<setting.length; i++) {
        // 寻找可以选用翻页条的项目: @com || @com:pager 
        var conf = setting[i];
        if(conf.type == "com") {
            // 在 com 中找到对应的翻页条并设置数据
            var ta = $.trim((opt.params||{})[conf.key]);
            var m  = /^#<([^>]+)>$/.exec(ta);
            if(m) {
                $("#" + m[1]).attr("hm-dynamic-id", myId);
            }
        }
    }

    // 因为要等待其他插件先加载，自己先延迟执行
    window.setTimeout(function(){
        do_reload(jData);
    }, 0);
}});
//...........................................................
})(window.jQuery, window.NutzUtil);

