(function($z){
// ......................... 以下是帮助函数
function _H(jHead, selector, html) {
    var jq = jHead.children(selector);
    // 确保存在
    if(html){
        if(jq.size() == 0){
            jHead.prepend($(html));
        }
    }
    // 确保删除
    else {
        jq.remove();
    } 
}
// ......................... 以上是帮助函数
$z.declare([
    'zui',
    'wn/util',
    'app/wn.hmaker2/hm__methods',
    'ui/menu/menu',
    'app/wn.hmaker2/hm_page_com_bar',
    'jquery-plugin/pmoving/pmoving',
    'jquery-plugin/moveresizing/moveresizing',
    // 预先加载
    'app/wn.hmaker2/component/columns.js',
    'app/wn.hmaker2/component/image.js',
    'app/wn.hmaker2/component/text.js',
    'app/wn.hmaker2/component/objlist.js',
    'app/wn.hmaker2/component/objshow.js',
], function(ZUI, Wn, HmMethods, MenuUI, PageComBarUI){
//==============================================
var html_empty_prop = function(){/*
<div class="ui-arena">
    empty prop
</div>
*/};
var html = `
<div class="ui-code-template">
    <div code-id="block" class="hm-block">
        <div class="hmb-con">
            <div class="hmb-area"></div>
        </div>
    </div>
    <div code-id="drag_tip" class="hm-drag-tip">
        <i class="zmdi zmdi-arrows"></i> <b>{{hmaker.drag.hover}}</b>
    </div>
</div>
<div class="ui-arena hm-page" ui-fitparent="yes"><div class="hm-W">
    <iframe class="hmpg-frame-load"></iframe>
    <div class="hmpg-stage">
        <div class="hmpg-screen"><iframe class="hmpg-frame-edit"></iframe></div>
    </div>
    <div class="hmpg-sbar"><div class="hm-W">
        <div class="hmpg-sbar-com"  ui-gasket="combar"></div>
        <div class="hmpg-sbar-page" ui-gasket="pagebar"></div>
    </div></div>
    <div class="hmpg-ibar"><div class="hm-W">
        <h4>插</h4>
        <ul>
            <li ctype="rows"
                data-balloon="{{hmaker.com.rows.name}} : {{hmaker.com.rows.tip}}" 
                data-balloon-pos="left" data-balloon-length="medium">
                <%=hmaker.com.rows.icon%>
            </li>
            <li ctype="columns"
                data-balloon="{{hmaker.com.columns.name}} : {{hmaker.com.columns.tip}}" 
                data-balloon-pos="left" data-balloon-length="medium">
                <%=hmaker.com.columns.icon%>
            </li>
            <li ctype="navmenu"
                data-balloon="{{hmaker.com.navmenu.name}} : {{hmaker.com.navmenu.tip}}" 
                data-balloon-pos="left" data-balloon-length="medium">
                <%=hmaker.com.navmenu.icon%>
            </li>
            <li ctype="text"
                data-balloon="{{hmaker.com.text.name}} : {{hmaker.com.text.tip}}" 
                data-balloon-pos="left" data-balloon-length="medium">
                <%=hmaker.com.text.icon%>
            </li>
            <li ctype="image"
                data-balloon="{{hmaker.com.image.name}} : {{hmaker.com.image.tip}}" 
                data-balloon-pos="left" data-balloon-length="medium">
                <%=hmaker.com.image.icon%>
            </li>
            <!--li ctype="imgslider"
                data-balloon="{{hmaker.com.imgslider.name}} : {{hmaker.com.imgslider.tip}}" 
                data-balloon-pos="left" data-balloon-length="medium">
                <%=hmaker.com.imgslider.icon%>
            </li-->
            <li ctype="objlist"
                data-balloon="{{hmaker.com.objlist.name}} : {{hmaker.com.objlist.tip}}" 
                data-balloon-pos="left" data-balloon-length="medium">
                <%=hmaker.com.objlist.icon%>
            </li>
            <li ctype="objshow"
                data-balloon="{{hmaker.com.objshow.name}} : {{hmaker.com.objshow.tip}}" 
                data-balloon-pos="left" data-balloon-length="medium">
                <%=hmaker.com.objshow.icon%>
            </li>
        </ul>
    </div></div>
</div></div>`;
//==============================================
return ZUI.def("app.wn.hmaker_page", {
    dom : html,
    //...............................................................
    init : function() {
        var UI = HmMethods(this);

        // 监听 Bus 的各种事件处理页面上的响应
        UI.listenBus("active:com",   UI.doActiveCom);
        UI.listenBus("active:page",  UI.doBlurActivedCom);
        UI.listenBus("change:site:skin", UI.doChangeSkin);
        
        UI.listenBus("change:block", function(mode, uiCom, block){
            if("page" == mode)
                return;
            console.log("hm_page::on_change:block:", mode,uiCom.uiName, block);
            uiCom.applyBlock(block);
        });
        UI.listenBus("change:com", function(mode, uiCom, com){
            if("page" == mode)
                return;
            console.log("hm_page::on_change:com:", mode, uiCom.uiName, com);
            
            // 移除旧皮肤
            if(uiCom.__current_skin && uiCom.__current_skin != com.skin) {
                uiCom.$el.removeClass(uiCom.__current_skin);
                uiCom.__current_skin = null;
            }
            
            // 添加新皮肤
            if(com.skin) {
                uiCom.$el.addClass(com.skin);
                uiCom.__current_skin = com.skin;
            }
            
            // 绘制控件
            uiCom.paint(com);
        });

        // 这里分配一个控件序号数组，采用 bitMap，序号从 0 开始一直排列
        UI._com_seq = [];
    },
    //...............................................................
    // 分配一个组件需要，并做记录
    assignComSequanceNumber : function(jCom) {
        if(!jCom.attr("c_seq")){
            var UI = this;
            var i  = 0;
            // 查找序号表
            for(;i<UI._com_seq.length;i++){
                if(!UI._com_seq[i]) {
                    break;
                }
            }
            // 增加一个记录
            UI._com_seq[i] = true;
            jCom.attr("c_seq", i).prop("id", "com"+i);
            // 返回这个序号
            return i;
        }
        // 返回已有序号
        return jCom.attr("c_seq") * 1;
    },
    //...............................................................
    events : {
        "click .hmpg-ibar li[ctype]" : function(e){
            // 得到组件的类型
            var ctype = $(e.currentTarget).attr("ctype");

            // 插入控件
            this.doInsertCom(ctype);
        }
    },
    //...............................................................
    getPageAttr : function(){
        return $z.getJsonFromSubScriptEle(this._C.iedit.$body, "hm-page-attr");
    },
    setPageAttr : function(attr){
        $z.setJsonToSubScriptEle(this._C.iedit.$body, "hm-page-attr", attr, true);
        this.applyPageAttr(attr);
    },
    applyPageAttr : function(attr){
        var UI = this;
        attr = attr || UI.getPageAttr() || {};
        UI._C.iedit.$body.css(attr);
    },
    //...............................................................
    bindComUI : function(jCom, callback) {
        var UI = this;
        
        // 确保控件内任意一个元素均等效
        jCom = jCom.closest(".hm-com");
        
        // 确保有组件序号
        UI.assignComSequanceNumber(jCom);

        // 看看是否之前就绑定过
        var uiId  = jCom.attr("ui-id");

        // 已经绑定了 UI，那么继续弄后面的
        if(uiId) {
            var uiCom = ZUI(uiId);
            $z.doCallback(callback, [uiCom], UI);
            return uiCom;
        }
        // 否则根据类型加载 UI 吧
        var ctype = jCom.attr("ctype");
        if(!ctype) {
            console.warn(ctype, jCom);
            throw "fail to found ctype from jCom";
        }
        
        // 执行加载
        seajs.use("app/wn.hmaker2/component/"+ctype, function(ComUI){
            new ComUI({
                parent  : UI,
                $el     : jCom,
            }).render(function(){
                $z.doCallback(callback, [this], UI);
            })
        });
    },
    //...............................................................
    doInsertCom : function(ctype) {
        var UI = this;
        
        // 创建组件的 DOM
        var jCom = $('<div class="hm-com">').attr({
            "ctype"   : ctype
        }).appendTo(UI._C.iedit.$body);
        
        // 初始化 UI
        UI.bindComUI(jCom, function(uiCom){
            // 设置初始化数据
            var com   = uiCom.setData({}, true);
            var block = uiCom.setBlock({});
            
            // 通知激活控件
            uiCom.notifyActived();
            
            // 通知改动
            uiCom.notifyBlockChange(null, block);
            uiCom.notifyDataChange(null, com);
        });
    },
    //...............................................................
    doActiveCom : function(uiCom) {
        var UI   = this;
        var jCom = uiCom.$el;
        
        // 当前已经是激活
        if(jCom.attr("hm-actived"))
            return;
        
        // 取消其他激活的控件
        UI.doBlurActivedCom();
        
        // 激活自己
        jCom.attr("hm-actived", "yes");
    },
    //...............................................................
    doBlurActivedCom : function() {
        this._C.iedit.$body.find("[hm-actived]").removeAttr("hm-actived");
    },
    //...............................................................
    doChangeSkin : function(){
        var UI = this;

        // 得到皮肤的信息
        var oHome    = UI.getHomeObj();
        var skinName = oHome.hm_site_skin;
        var skinInfo = UI.getSkinInfo() || {};

        // 更新样式
        var jHead = UI._C.iedit.$head;
        _H(jHead, 'link[skin]', !skinName ? null
            : $z.tmpl('<link skin="yes" rel="stylesheet" type="text/css" href="/o/read/home/{{d1}}/.hmaker/skin/{{skinName}}/skin.css?aph=true">')({
                d1       : oHome.d1,
                skinName : skinName,
            }));

        // 确保样式加入到 body
        UI._C.iedit.$body.attr("skin", skinInfo.name || null);
    },
    //...............................................................
    setup_page_editing : function(){
        var UI = this;

        // 建立上下文: 这个过程，会把 load 的 iframe 内容弄到 edit 里
        UI._rebuild_context();

        // 设置编辑区页面的 <head> 部分
        UI.__setup_page_head();

        // 设置编辑区的移动
        UI.__setup_page_moveresizing();

        // 监视编辑区，响应其他必要的事件处理
        UI.__setup_page_events();

        // 处理所有的块显示
        UI._C.iedit.$body.find(".hm-com").each(function(){
            // 处理块中的组件
            var jCom = $(this);

            if(jCom.size()==0) {
                console.log("no jCom", jBlock.html());
            }

            // 绑定 UI，并显示
            UI.bindComUI(jCom);
        });

        // 应用网页显示样式
        UI.applyPageAttr();

        // 通知网页被加载
        UI.fire("active:page");

        // 模拟第一个块被点击
        window.setTimeout(function(){
            UI._C.iedit.$body.find(".hm-block").first().click();
        }, 500);
    },
    //...............................................................
    __setup_page_head : function() {
        var UI = this;

        // 首先清空
        var jHead = UI._C.iedit.$head.empty();

        // 头部元数据
        _H(jHead, 'meta[charset="utf-8"]',
            '<meta charset="utf-8">');
        _H(jHead, 'meta[name="viewport"]',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">');
        _H(jHead, 'meta[http-equiv="X-UA-Compatible"]',
            '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">');
        

        // 链入固定的 CSS 
        _H(jHead, 'link[href*="normalize.css"]',
            '<link rel="stylesheet" type="text/css" href="/gu/rs/core/css/normalize.css">');
        _H(jHead, 'link[href*="font-awesome.css"]',
            '<link rel="stylesheet" type="text/css" href="/gu/rs/core/css/font-awesome-4.5.0/css/font-awesome.css">');
        _H(jHead, 'link[href*="material-design-iconic-font.css"]',
            '<link rel="stylesheet" type="text/css" href="/gu/rs/core/css/font-md/css/material-design-iconic-font.css">');
        _H(jHead, 'link[href*="hmaker_editing.css"]',
            '<link rel="stylesheet" type="text/css" href="/a/load/wn.hmaker2/hmaker_editing.css">');
        _H(jHead, 'link[href*="moveresizing.css"]',
            '<link rel="stylesheet" type="text/css" href="/theme/r/jqp/moveresizing/moveresizing.css">');

        // _H(jHead, 'script[src*="zutil.js"]',
        //     '<script src="/gu/rs/core/js/nutz/zutil.js"></script>');
        // _H(jHead, 'script[src*="seajs"]',
        //     '<script src="/gu/rs/core/js/seajs/seajs-2.3.0/sea-debug.js" id="seajsnode"></script>');
        // _H(jHead, 'script[src*="jquery-2.1.3"]',
        //     '<script src="/gu/rs/core/js/jquery/jquery-2.1.3/jquery-2.1.3.min.js"></script>');

        // 设置皮肤
        UI.doChangeSkin();
    },
    //...............................................................
    __setup_page_events : function() {
        var UI = this;

        // 首先所有元素的点击事件，全部禁止默认行为
        UI._C.iedit.$root.on("click", "*", function(e){
            e.preventDefault();
            // console.log("hm_page.js: click", this.tagName, this.className);

            var jq = $(this);

            // 如果点在了块里，激活块，然后就不要冒泡了
            if(jq.hasClass("hm-com")){
                e.stopPropagation();
                
                // 得到组件的 UI
                var uiCom = ZUI(jq);
                            
                // 通知激活控件
                uiCom.notifyActived();
                
                // 通知改动
                uiCom.notifyBlockChange("page", uiCom.getBlock());
                uiCom.notifyDataChange("page", uiCom.getData());
            }
            // 如果点到了 body，那么激活页
            else if('BODY' == this.tagName){
                UI.fire("active:page", UI._page_obj);
            }

            // 不管怎样，模拟一下父框架页面的点击
            // $(document.body).click();
        });

        // 截获所有的键事件
        UI._C.iedit.$body.on("keydown", function(e){
            // 删除
            if(8 == e.which || 46 == e.which) {
                UI.on_block_delete(e);
            }
        });
        UI._C.iedit.$body.on("keyup", function(e){
            // Shift 将表示开关移动遮罩的  no-drag
            if(16 == e.which) {
                var mvMask = UI._C.iedit.$body.children(".pmv-mask");
                if(mvMask.length > 0) {
                    $z.toggleAttr(mvMask, "no-drag", "yes");
                }
            }
        });
    },
    //...............................................................
    __setup_page_moveresizing : function() {
        var UI = this;

        
    },
    //...............................................................
    __after_iframe_loaded : function(name) {
        var UI = this;

        // 移除加载完毕的项目
        UI._need_load = _.without(UI._need_load, name);

        // 全部加载完毕了
        if(UI._need_load.length == 0){
            UI.setup_page_editing();
        }
    },
    //...............................................................
    // 得到本页所有布局控件的信息列表
    getLayoutComInfoList : function(){
        var UI = this;
        var _C = UI._C;

        // 准备返回值
        var re = [];

        // 找到所有的分栏控件
        _C.iedit.$body.find('.hm-com[ctype="rows"],.hm-com[ctype="columns"]')
            .each(function(){
                var jCom = $(this);
                re.push({
                    cid   : jCom.attr("id"),
                    ctype : jCom.attr("ctype")
                });
            });

        // 返回
        return re;
    },
    //...............................................................
    // 取得某个布局控件内部的可用区域（不包括子控件的区域）
    getLayoutComBlockDataArray : function(comId){
        var UI = this;
        var jCom  = UI.getComElementById(comId);
        var uiCom = UI.bindComUI(jCom);

        // 没有组件，返回就是空
        if(!uiCom)
            return [];

        // 返回
        return uiCom.getBlockDataArray();
    },
    //...............................................................
    redraw : function(){
        var UI  = this;
        
        // 绑定隐藏 iframe onload 事件，这个 iframe 专门用来与服务器做数据交换的
        // var jIfmLoad = UI.arena.find(".hmpg-frame-load");
        // if(!jIfmLoad.attr("onload-bind")){
        //     jIfmLoad.bind("load", function(e){
        //         //console.log("hmaker_page: iframe onload", Date.now(), e);
        //         UI._C = UI._create_context();
        //         console.log(UI._C);

        //         UI.setup_page_editing();
        //     });
        //     jIfmLoad.attr("onload-bind", "yes");
        // }
        // 创建两个 iframe 一个负责编辑，一个负责加载
        // hmpg-frame-load
        var jW = UI.arena.find(">.hm-W");
        var jScreen = jW.find(".hmpg-screen");
        // var jIfmLoad = $('<iframe class="hmpg-frame-load">').appendTo(jW);
        // var jIfmEdit = $('<iframe class="hmpg-frame-edit" src="/a/load/wn.hmaker2/page_loading.html">').appendTo(jScreen);

        // var jIfmLoad = UI.arena.find(".hmpg-frame-load");
        // var jIfmEdit = UI.arena.find(".hmpg-frame-edit");

        var jIfmLoad = $(".hmpg-frame-load");
        var jIfmEdit = $(".hmpg-frame-edit");

        // 保存记录 
        UI._need_load = ["iedit", "iload"];

        // 监听加载完毕的事件
        jIfmLoad.one("load", function(e) {
            //console.log("AAAAA")
            UI.__after_iframe_loaded("iload");
        });

        jIfmEdit.one("load", function(e) {
            //console.log("BBBBBB")
            UI.__after_iframe_loaded("iedit");
        });

        // 组件条
        new PageComBarUI({
            parent : UI,
            gasketName : "combar",
        }).render();
       
        // 菜单条
        // new MenuUI({
        //     parent : UI,
        //     gasketName : "pagebar",
        //     setup : [{
        //         text : "Test",
        //         handler : function(){
        //             UI._C.iload = UI._reset_context_vars(".hmpg-frame-load");
        //             UI._C.iedit = UI._reset_context_vars(".hmpg-frame-edit");
        //         }
        //     },{
        //         icon : '<i class="zmdi zmdi-more-vert"></i>',
        //         items : [{
        //             icon : '<i class="zmdi zmdi-settings"></i>',
        //             text : 'i18n:hmaker.page.show_prop',
        //             handler : function() {
        //                 UI.fire("active:page");
        //             }
        //         }]
        //     }]
        // }).render(); 
    },
    //...............................................................
    depose : function() {
        this.arena.find(".hmpg-frame-load").unbind();
    },
    //...............................................................
    update : function(o) {
        var UI = this;

        // 记录
        UI._page_obj = o;

        var jIfmEdit = UI.arena.find(".hmpg-frame-edit");
        jIfmEdit.prop("src", "/a/load/wn.hmaker2/page_loading.html");

        var jIfmLoad = UI.arena.find(".hmpg-frame-load");
        jIfmLoad.prop("src", "/o/read/id:"+o.id);
    },
    //...............................................................
    // 获取编辑操作时的上下文
    _rebuild_context : function() {
        var UI = this;

        // TODO 有必要是，来个 jIfmTmpl 用来加载模板文件
        var jIfmLoad = UI.arena.find(".hmpg-frame-load");
        var docLoad  = jIfmLoad[0].contentDocument;
        var rootLoad = docLoad.documentElement;

        var jIfmEdit = UI.arena.find(".hmpg-frame-edit");
        var docEdit  = jIfmEdit[0].contentDocument;
        var rootEdit = docEdit.documentElement;

        // 创建上下文对象
        var C = {
            $screen : UI.arena.find(".hmpg-screen"),
            $pginfo : UI.arena.find(".hmpg-sbar .hmpg-pginfo"),
        };

        // 设置 HTML 到编辑区
        rootEdit.innerHTML = rootLoad.innerHTML;

        // 重新索引快捷标记
        C.iload = UI._reset_context_vars(".hmpg-frame-load");
        C.iedit = UI._reset_context_vars(".hmpg-frame-edit");

        // 记录上下文
        UI._C = C;

        // 分析序号表
        UI._com_seq = [];
        C.iedit.$body.find(".hm-com").each(function(){
            var seq = $(this).attr("c_seq") * 1;
            if(_.isNumber(seq)){
                // 无效的或者已经存在的序号
                if(isNaN(seq) || UI._com_seq[seq]) {
                    $(this).removeAttr("c_seq");
                }
                // 记录序号
                else {
                    UI._com_seq[seq] = true;
                }
            }
        })
        // 为所有未分配序号的组件，分配
        .not("[c_seq]").each(function(){
            UI.assignComSequanceNumber($(this));
        });
    },
    //...............................................................
    _reset_context_vars : function(selector) {
        var UI = this;

        var ifrm = $(selector);
        var doc  = ifrm[0].contentDocument;

        var cobj = {
            doc  : doc,
            root : doc.documentElement,
            head : doc.head,
            body : doc.body,
        };
        cobj.$root = $(cobj.root);
        cobj.$head = $(cobj.head);
        cobj.$body = $(cobj.body);
        return cobj;
    },
    //...............................................................
    getCurrentEditObj : function() {
        return this._page_obj;
    },
    //...............................................................
    getCurrentTextContent : function() {
        var UI = this;
        var C  = UI._C;

        // 将 iedit 的内容复制到 iload 里面
        C.iload.root.innerHTML = C.iedit.root.innerHTML;
        C.iload = UI._reset_context_vars(".hmpg-frame-load");

        // 清空 iload 的头部
        C.iload.$head.empty();

        // 移除 body 的一些属性
        C.iload.$body
            .removeAttr("pointer-moving-enabled")
            .removeAttr("style");

        // 移除所有的辅助节点
        C.iload.$body.find(".mvrz-ass, .hm-del-save, .ui-code-template").remove();

        // 删除所有的块和控件的 CSS 渲染属性
        C.iload.$body.find(".hm-block,.hmb-con,.hmb-area,.hm-com,.ui-arena").each(function(){
            var jq = $(this).removeAttr("style");

            jq.attr({
                "mvrz-block" : null,
                "hm-actived" : null,
                "ui-id" : null,
            });

            // 所有的子
            jq.find("*").removeAttr("style");

        }).filter(".hm-com").each(function(){
            $(this).removeAttr("ui-id");
        });

        // 整理所有的空节点，让其为一个回车
        $z.eachTextNode(C.iload.$body, function(){
            var str = $.trim(this.nodeValue);
            // 处理空白节点
            if(0 == str.length) {
                // 如果之前的节点是个文本节点的话，那么自己就变成空字符串吧
                if(this.previousSibling && this.previousSibling.nodeType == 3) {
                    this.nodeValue = "";
                }
                // 否则输出个回车
                else {
                    this.nodeValue = "\n";
                }
            }
        });

        // 删除所有临时属性
        C.iload.$body.removeAttr("skin").find('[del-attrs]').each(function(){
            var jq = $(this);
            var attrNames = jq.attr("del-attrs").split(",");
            console.log(attrNames)
            var subs = jq.find("*").andSelf();
            for(var attrName of attrNames) {
                subs.removeAttr(attrName);
            }
        });

        // 返回 HTML
        return '<!DOCTYPE html>\n<html>\n' + C.iload.$root.html() + '\n</html>\n';;
    },
    //...............................................................
    getActions : function(){
        return ["@::save_text",
                "::hmaker/hm_create", 
                "::hmaker/hm_delete",
                "~",
                "::view_text",
                "~",
                "::hmaker/pub_site",
                "::hmaker/pub_current_page",
                "~",
                "::hmaker/hm_site_conf",
                "~",
                "::zui_debug",
                "::open_console"];
    }
    //...............................................................
});
//===================================================================
});
})(window.NutzUtil);