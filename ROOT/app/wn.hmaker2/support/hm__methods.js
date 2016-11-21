define(function (require, exports, module) {
// ....................................
// 块的 CSS 属性基础对象
var CSS_BASE = {
    position:"",top:"",left:"",width:"",height:"",right:"",bottom:"",
    margin:"",padding:"",border:"",borderRadius:"",
    color:"",background:"",
    overflow:"",boxShadow:"",
};
// ....................................
// 方法表
var methods = {
    //=========================================================
    hmaker : function(){
        var UI = this;
        while(!UI.__hmaker__ && UI) {
            UI = UI.parent;
        }
        return UI;
    },
    // 得到 HmPageUI，如果不是，则抛错
    pageUI : function(quiet) {
        var UI = this;
        var uiHMaker = this.hmaker();
        var re = uiHMaker.gasket.main;
        // 严格模式
        if(!quiet){
            if(!re){
                throw 'PageUI Not Loadded!';
            }
            if(re.uiName != "app.wn.hmaker_page"){
                throw 'Not A PageUI: ' + re.uiName;
            }
        }
        if(re && re.uiName != "app.wn.hmaker_page")
            return null;
        return re;
    },
    // 获取资源列表的 UI 实例
    resourceUI : function() {
        return this.hmaker().gasket.resource;
    },
    // 获取 prop UI 下面的子 UI，如果类型未定义，则返回 prop UI 本身
    propUI : function(uiPath) {
        var uiHMaker = this.hmaker();
        var uiProp   = uiHMaker.gasket.prop;
        if(uiPath)
            return uiProp.subUI(uiPath);
        return uiProp;
    },
    //=========================================================
    // 得到站点主目录
    getHomeObj : function() {
        var homeId = this.getHomeObjId();
        return Wn.getById(homeId);
    },
    // 得到站点主目录 ID
    getHomeObjId : function() {
        return this.hmaker().__home_id;
    },
    //=========================================================
    // 得到站点的皮肤设定， null 表示没有设定皮肤
    getSkinInfo : function() {
        var UI = this;
        var oHome = UI.getHomeObj();

        var skinName = oHome.hm_site_skin;
        if(!skinName)
            return {};
        
        // 读取皮肤信息
        var oInfo = Wn.fetch("~/.hmaker/skin/" + skinName + "/skin.info.json", true);
        if(!oInfo)
            return null;

        var json = Wn.read(oInfo);
        if(json)
            return $z.fromJson(json);

        return null;
    },
    // 根据一个控件类型，获取其皮肤的可用样式表单，返回的一律是
    // {text,selector} 格式的对象
    // 返回 null 表示站点没设置皮肤
    // 返回 [] 表示皮肤中没有定义控件的类选择器列表
    getSkinListForCom : function(comType) {
        var skinInfo = this.getSkinInfo();

        if(skinInfo && skinInfo.com)
            return skinInfo.com[comType] || [];

        return null;
    },
    // 针对一个组件，根据选择器获取其样式名
    getSkinTextForCom : function(comType, selector) {
        var sList = this.getSkinListForCom(comType);
        if(_.isArray(sList))
            for(var si of sList){
                if(si.selector == selector)
                    return si.text;
            }
        return null;
    },
    // 得到一个模板对应的类选择器名称
    getSkinForTemplate : function(templateName) {
        var skinInfo = this.getSkinInfo();

        if(skinInfo && skinInfo.template)
            return skinInfo.template[templateName];

        return null;
    },
    //=========================================================
    // 得到站点 api 的前缀
    //  - path 为 api 的路径
    getHttpApiUrl : function(path) {
        var oHome = this.getHomeObj();
        return "/api/" + oHome.d1 + (path || "");
    },
    //=========================================================
    // 站点的模板
    // 让模板的JS生效，并返回模板的信息对象
    evalTemplate : function(templateName) {
        var oHome = this.getHomeObj();
        var phTmplHome = "/home/" + oHome.d1 + "/.hmaker/template/" + templateName;

        // 加载 jQuery 控件
        var jsContent = Wn.read(phTmplHome + "/jquery.fn.js");
        eval(jsContent);

        // 返回模板信息
        var jsonInfo = Wn.read(phTmplHome + "/template.info.json");
        return $z.fromJson(jsonInfo);
    },
    //=========================================================
    // 监听消息
    listenBus : function(event, handler){
        var uiHMaker = this.hmaker();
        this.listenUI(uiHMaker, event, handler);
    },
    // 发送消息
    fire : function() {
        var args = Array.from(arguments);
        var uiHMaker = this.hmaker();
        // console.log("fire", args)
        uiHMaker.trigger.apply(uiHMaker, args);
    },
    //=========================================================
    // 得到某个对象相对于 HOME 的路径
    getRelativePath : function(o) {
        var oHome = this.getHomeObj();
        return Wn.getRelativePath(oHome, o);
    },
    // 得到一个对象在 HMaker 里表示的 Icon HTML
    getObjIcon : function(o) {
        // 有了自定义
        if(o.icon)
            return o.icon;
        
        // 文件夹
        if('DIR' == o.race)
            return  '<i class="fa fa-folder-o"></i>';
        
        // 网页 / XML
        if(/^text\/(xml|html)$/.test(o.mime))
            return  '<i class="fa fa-file-code-o"></i>';

        // 文本
        if(/^text\//.test(o.mime))
            return  '<i class="fa fa-file-text"></i>';

        // 图片
        if(/^image\//.test(o.mime))
            return  '<i class="fa fa-file-image-o"></i>';

        // 视频
        if(/^video\//.test(o.mime))
            return  '<i class="fa fa-file-video-o"></i>';

        // 音频
        if(/^audio\//.test(o.mime))
            return  '<i class="fa fa-file-audio-o"></i>';

        // pdf
        if("pdf" == o.tp)
            return  '<i class="fa fa-file-pdf-o"></i>';

        // excel
        if(/^xlsx?$/.test(o.tp))
            return  '<i class="fa fa-file-excel-o"></i>';

        // word
        if(/^docx?$/.test(o.tp))
            return  '<i class="fa fa-file-word-o"></i>';

        // 其他
        return  '<i class="fa fa-file"></i>';
    },
    //=========================================================
    // 根据控件的块定位模式，从 css 集合里提取出相关的熟悉
    // 模式字符串为 "TLBRWH" 分别代表顶点和宽高，所有的模式字符串都遵守这个顺序
    //  @mode : 可能的值为:
    //            - WH   : 宽高
    //            - TLWH : 左上顶点定位
    //            - TRWH : 右上顶点定位
    //            - LBWH : 左下顶点定位
    //            - BRWH : 右下顶点定位
    //            - TLBR : 四角顶点定位
    //            - TLBW : 左边定位
    //            - TBRW : 右边定位
    //            - TLRH : 顶边定位
    //            - LBRH : 底边定位
    pickCssForMode : function(css, mode) {
        var regex;
        switch(mode) {
        case "WH" :
            regex = /^(width|height)$/;
            break;
        case "TLWH" : 
            regex = /^(top|left|width|height)$/;
            break;
        case "TRWH" : 
            regex = /^(top|right|width|height)$/;
            break;
        case "LBWH" : 
            regex = /^(left|bottom|width|height)$/;
            break;
        case "BRWH" : 
            regex = /^(bottom|right|width|height)$/;
            break;
        case "TLBR" : 
            regex = /^(top|left|bottom|right)$/;
            break;
        case "TLBW" : 
            regex = /^(top|left|bottom|width)$/;
            break;
        case "TBRW" : 
            regex = /^(top|bottom|right|width)$/;
            break;
        case "TLRH" : 
            regex = /^(top|left|right|height)$/;
            break;
        case "LBRH" : 
            regex = /^(left|bottom|right|height)$/;
            break;
        default:
            throw "unsupport mode: '" + mode + "'";
        }
        return $z.pick(css, regex);
    },
    // 将 CSS 对象与 base 合并，并将内部所有的 undefined 和 null 都变成空串
    formatCss : function(css, mergeWithBase) {
        // 传入了 base 对象
        if(_.isObject(mergeWithBase)){
            css = _.extend({}, mergeWithBase, css);
        }
        // 与默认 base 对象合并
        else if(mergeWithBase) {
            css = _.extend({}, CSS_BASE, css);   
        }

        // 将所有的 undefined 和 null 都变成空串，表示去掉
        // 如果 key 以 _ 开头，则会被删除掉
        var re = {};
        for(var key in  css) {
            if(/^_/.test(key))
                continue;
            var val = css[key];
            if(_.isUndefined(val) || _.isNull(val))
                re[key] = "";
            else
                re[key] = val;
        }

        // 返回新创建的对象 
        return re;
    },
    // 返回 base_css 的一个新实例
    getBaseCss : function() {
        return _.extend({}, CSS_BASE);
    },
    // 生成一个新的 css 集合，所有未给定的 css 会被表示空属性而删除
    // 参见 CSS_BASE
    // 本函数假定传入的 css 键值都是驼峰命名的
    normalizeCss : function(css) {
        return _.extend({}, CSS_BASE, css);
    },
    //=========================================================
    // 获取背景属性编辑控件的关于 image 编辑的配置信息
    getBackgroundImageEditConf : function(){
        return {
            imageBy : {
                editAs : "link",
                uiConf : {
                    body : {
                        setup : {
                            defaultPath : this.getHomeObj(),
                            lastObjId : "hmaker_pick_media",
                            filter    : function(o) {
                                if('DIR' == o.race)
                                    return true;
                                return /^image/.test(o.mime);
                            }
                        }
                    },
                    // 解析对象，如果是 url(/o/read/id:xxx) 那么就认为是对象
                    parseData : function(str){
                        // 看看是不是对象
                        var m = /^url\("?\/o\/read\/(id:\w+)"?\)$/i.exec(str);
                        if(m)
                            return m[1];
                        // 外部链接 
                        m = /^url\("?(https?:\/\/[^"\)]+)"?\)$/i.exec(str);
                        if(m)
                            return m[1];
                        return null;
                    },
                    // 把 link 搞出来的东西用 url() 包裹
                    formatData : function(link){
                        // 内部对象
                        if(/^id:.+/.test(link)) {
                            return 'url("/o/read/' + link + '")';
                        }
                        // 外部链接
                        if(/^https?:\/\/.+/i.test(link)) {
                            return 'url("' + link + '")';
                        }
                        // 其他
                        return null;
                    }
                }
            }
        };
    } // ~ getBackgroundImageEditConf()
    //=========================================================
}; // ~End methods
//====================================================================

//====================================================================
// 输出
module.exports = function(uiSub){
    return _.extend(uiSub, methods);
};
//=======================================================================
});
