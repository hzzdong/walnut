(function($z){
$z.declare([
    'zui',
    'wn/util',
    'ui/shelf/shelf',
    'ui/obrowser/obrowser_sky',
    'ui/obrowser/obrowser_main'
], function(ZUI, Wn, ShelfUI){
//==============================================
var html = function(){/*
<div class="ui-arena obrowser ui-oicon-16" 
     ui-fitparent="true"
     ui-gasket="shelf">
</div>
*/};
//==============================================
return ZUI.def("ui.obrowser", {
    dom  : $z.getFuncBodyAsStr(html.toString()),
    css  : ["theme/ui/obrowser/obrowser.css","theme/ui/support/oicons.css"],
    i18n : "ui/obrowser/i18n/{{lang}}.js",
    //..............................................
    init : function(options){
        var UI = this;

        $z.setUndefined(options, "checkable", true);
        $z.setUndefined(options, "editable", false);
        $z.setUndefined(options, "canOpen", function(o){
            return ('DIR' == o) && (!o.tp || 'folder' == o.tp);
        });
        $z.setUndefined(options, "appSetup", {
            actions : ["@::viewmode"]
        });
        
        // 绑定 UI 间的监听关系
        UI.on("browser:change", function(o){
            UI.changeCurrentObj(o);
        });
        UI.on("change:viewmode", function(){
            var o = UI.getCurrentObj();
            UI.subUI("shelf/main").update(UI, o);
        });
        UI.on("menu:viewmode", function(vm){
            this.setViewMode(vm);
        });
        UI.on("change:hidden-obj-visibility", function(){
            var o = UI.getCurrentObj();
            UI.subUI("shelf/main").update(UI, o);
        });
        UI.on("menu:showhide", function(isShow){
            this.setHiddenObjVisibility(isShow ? "show" : "hidden");
        });
    },
    //..............................................
    changeCurrentObj : function(o){
        var UI = this;

        // 是否可以打开，不能打开的话，打开父目录即可
        if(!UI.options.canOpen(o)){
            var oP = UI.getById(o.pid);
            UI.changeCurrentObj(oP);
            return;
        }

        // 动态读取对象对应
        if("auto" == UI.options.appSetup){
            Wn.loadAppSetup(o, {context:UI}, function(o, asetup){
                UI.__call_subUI_update(o, asetup);
            });    
        }
        // 采用默认的策略，只有普通文件夹才能打开
        // 否则相当于打开对象的父目录，同时菜单项只有有限的几个
        else{
            var asetup;
            if(_.isFunction(UI.options.appSetup)){
                asetup = UI.options.appSetup.call(UI, o);
            }
            else if(_.isObject(UI.options.appSetup)){
                asetup = $z.clone(UI.options.appSetup);
            }
            else{
                throw "Unsupport appSetup: " + UI.options.appSetup;
            }
            Wn.extendAppSetup(asetup);
            // 调用个个子 UI 的更新
            UI.__call_subUI_update(o, asetup);
        }
        
    },
    //..............................................
    __call_subUI_update : function(o, asetup){
        var UI = this;
        try{
            UI.subUI("shelf/chute").update(UI, o, asetup);
            UI.subUI("shelf/main").update(UI, o, asetup);
            UI.subUI("shelf/sky").update(UI, o, asetup);
            // 持久记录最后一次位置
            if(UI.options.lastObjId){
                UI.local(UI.options.lastObjId, o.id);
            }
        }
        catch(eKey){
            alert(UI.msg(eKey));
        }
    },
    //..............................................
    extend_actions : function(actions, forceTop, isInEditor){
        return Wn.extendActions(actions, forceTop, isInEditor);
    },
    //..............................................
    redraw : function(){
        var UI = this;

        // 初始化显示隐藏开关 
        UI.arena.attr("hidden-obj-visibility", UI.getHiddenObjVisibility());

        // 初始化界面
        (new ShelfUI({
            parent : this,
            gasketName : "shelf",
            display : {
                sky : 40,
                chute: 180,
                footer : 32
            },
            sky : {
                uiType : "ui/obrowser/obrowser_sky",
                uiConf : {
                    className : "obrowser-block",
                    fitparent : true
                }
            },
            chute : {
                uiType : "ui/obrowser/obrowser_chute",
                uiConf : {
                    className : "obrowser-block",
                    fitparent : true
                }
            },
            main : {
                uiType : "ui/obrowser/obrowser_main",
                uiConf : {
                    className : "obrowser-block",
                    fitparent : true
                }
            },
            footer : {
                uiType : "ui/support/dom",
                uiConf : {
                    className : "obrowser-block obrowser-footer",
                    fitparent : true,
                    dom : "<b>...</b>"
                }
            },

        })).render(function(){
            // 回报延迟加载
            UI.defer_report(0, "browser-shelf");
        });

        // 返回延迟加载
        return ["browser-shelf"];
    },
    //..............................................
    setData : function(obj){
        var UI = this;
        // 没值
        if(!obj){
            // 如果是记录最后一次
            if(UI.options.lastObjId){
                var lastId = UI.local(UI.options.lastObjId);
                if(lastId){
                    UI.setData("id:"+lastId);
                    return;
                }
            }
            // 看看有没有当前对象
            var c_oid = UI.getCurrentObjId();
            if(c_oid){
                UI.setData("id:"+c_oid);
            }
            // 默认采用主目录
            else{
                UI.setData("~");
            }
            return;
        }

        // 字符串
        if(_.isString(obj)){
            var o;
            if(/^id:\w{6.}$/.test(obj)){
                var oid = obj.substring(0,3);
                o = UI.getById(oid);
            }else{
                o = UI.fetch(obj);
            }
            UI.setData(o ? o : "~");
            return;
        }

        // 保存到缓冲
        UI.saveToCache(obj);

        // 临时记录当前的对象
        UI.setCurrentObjId(obj.id);

        // 调整尺寸
        //UI.resize();

        // 触发事件
        UI.trigger("browser:change", obj);
        $z.invoke(UI.options, "on_change", [obj], UI);
        
    },
    //..............................................
    refresh : function(){
        var oid = this.getCurrentObjId();
        this.cleanCache("oid:"+oid);
        this.setData("id:"+oid);
    },
    //..............................................
    showUploader: function(options){
        var ta =  this.getCurrentObj();
        Wn.uploadPanel(_.extend({
            target : ta
        }, options));
    },
    //..............................................
    getViewMode : function(){
        return this.local("viewmode") || "thumbnail";
    },
    setViewMode : function(mode){
        if(_.isString(mode)
           && /^(table|thumbnail|slider|scroller|icons|columns)$/.test(mode)
           && mode != this.getViewMode()){
            this.local("viewmode", mode);
            this.trigger("change:viewmode", mode);
        }
    },
    //..............................................
    getHiddenObjVisibility : function(){
        return this.local("hidden-obj-visibility") || "hidden";
    },
    setHiddenObjVisibility : function(vho){
        if(_.isString(vho)
           && /^(show|hidden)$/.test(vho)){
            this.local("hidden-obj-visibility", vho);
            this.trigger("change:hidden-obj-visibility", vho);
            this.arena.attr("hidden-obj-visibility", vho);
        }
    },
    //..............................................
    getCurrentTextContent : function(){
        var theUI = this.subUI("shelf/main/view")
        if(!theUI)
            return undefined;
        return $z.invoke(theUI, "getCurrentTextContent");
    },
    //..............................................
    getCurrentObjId : function(){
        return this.$el.attr("current-oid");
    },
    setCurrentObjId : function(oid){
        if(!oid)
            this.$el.removeAttr("current-oid");
        else
            this.$el.attr("current-oid", oid);
    },
    getCurrentObj : function(){
        var oid = this.getCurrentObjId();
        return this.getById(oid);
    },
    getPath : function(){
        return this.subUI("shelf.sky").getPath();
    },
    getPathObj : function(){
        return this.subUI("shelf.sky").getData();
    },
    //..............................................
    getActived : function(){
        return this.subUI("shelf.main").getActived();
    },
    getChecked : function(){
        return this.subUI("shelf.main").getChecked();
    },
    //.............................................. 
    getChildren : function(o, filter){
        return Wn.getChildren(o, filter);
    },
    //..............................................
    getAncestors : function(o, includeSelf){
        return Wn.getAncestors(o, includeSelf);
    },
    //..............................................
    getAncestorPath : function(o, includeSelf){
        return Wn.getAncestorPath(o, includeSelf);
    },
    //..............................................
    batchRead : function(objList, callback){
        return Wn.batchRead(objList, callback, this);
    },
    //..............................................
    read : function(o, callback){
        return Wn.read(o, callback, this);
    },
    //..............................................
    write : function(o, content, callback, context){
        return Wn.write(o, content, callback, context);
    },
    //..............................................
    get : function(o, quiet){
        if(_.isUndefined(o) || $z.isjQuery(o) || _.isElement(o)){
            return this.subUI("shelf.main").getData(o);
        }
        return Wn.get(o, quiet);
    },
    //..............................................
    getById : function(oid, quiet) {
        return Wn.getById(oid, quiet);
    },
    //..............................................
    fetch : function(ph, quiet){
        return Wn.fetch(ph, quiet);
    },
    //..............................................
    saveToCache : function(o){
        Wn.saveToCache(o);
    },
    //..............................................
    cleanCache : function(key){
        Wn.cleanCache(key);
    }
    //..............................................
});
//==================================================
});
})(window.NutzUtil);