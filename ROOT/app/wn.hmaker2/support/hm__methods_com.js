define(function (require, exports, module) {
var methods = {
    //........................................................
    // 获取组件的 ID
    getComId : function(){
        return this.$el.attr("id");
    },
    //........................................................
    setComId : function(newId) {
        var ele = this.el.ownerDocument.getElementById(newId);
        // 有重名的
        if(ele && ele !== this.el){
            alert(this.msg("hmaker.com._.existsID"));
            return false;
        }
        // 设置
        this.$el.attr("id", newId);

        // 返回成功
        return true;
    },
    //........................................................
    // 获取组件的 type
    getComType : function() {
        return this.$el.attr("ctype");
    },
    //........................................................
    // 获取组件的皮肤
    getComSkin : function() {
        return this.$el.attr("skin");
    },
    // 设置组件的皮肤，这里会取消掉老的皮肤
    setComSkin : function(skin) {
        var old_skin = this.getComSkin();
        if(old_skin) {
            this.$el.removeClass(old_skin);
        }
        this.$el.attr("skin", skin||null).addClass(skin);
    },
    //........................................................
    getIconHtml : function() {
        return this.msg('hmaker.com.' + this.getComType() + '.icon');
    },
    //........................................................
    // 判断组件是否是激活的
    isActived : function() {
        return this.$el.attr("hm-actived") == "yes";
    },
    // 判断一个 DOM 元素是否在一个激活的块中
    isInActivedCom : function(jq) {
        return $(jq).closest(".hm-com[hm-actived]").length > 0;
    },
    //........................................................
    notifyActived : function(mode){
        this.fire("active:com", this);
        if(!_.isUndefined(mode)){
            this.notifyBlockChange(mode, this.getBlock());
            this.notifyDataChange(mode,  this.getData());
        }
    },
    //........................................................
    // 获取组件的属性
    getData : function() {
        var com = $z.getJsonFromSubScriptEle(this.$el, "hm-prop-com");
        if(_.isEmpty(com)) {
            return this.getDefaultData();
        }
        return com;
    },
    // 通常由 hm_page::doChangeCom 调用
    setData : function(com, shallow) {
        // 合并数据
        var com2 = shallow 
                    ? _.extend(this.getData(), com)
                    : $z.extend(this.getData(), com);
        
        // 保存属性
        $z.setJsonToSubScriptEle(this.$el, "hm-prop-com", com2, true);
        
        // 返回数据
        return com2;
    },
    // 发出属性修改通知，本函数自动合并其余未改动过的属性
    // mode 可能是:
    //  - "page"  : 页编辑区发出的，因此不要重绘显示 DOM (paint)
    //  - "panel" : 属性面板发出的，因此不要重绘属性面板了
    //  - null    : 其他地方发出的，组件和面板都要重绘
    notifyDataChange : function(mode, com) {
        this.fire("change:com", mode, this, (com||this.getData()));
    },
    // 相当于先 setData 然后再 notifyDataChange
    saveData : function(mode, com, shallow) {
        var com2 = this.setData(com, shallow);
        this.notifyDataChange(mode, com2);
        return com2;
    },
    //........................................................
    // 获取组件的属性
    getBlock : function() {
        var block = $z.getJsonFromSubScriptEle(this.$el, "hm-prop-block");
        if(_.isEmpty(block)) {
            return this.getDefaultBlock();
        }
        return block;
    },
    // 通常由 hm_page::doChangeCom 调用
    setBlock : function(block) {
        // 合并数据
        var block2 = _.extend(this.getBlock(), block);
        
        // 保存属性
        $z.setJsonToSubScriptEle(this.$el, "hm-prop-block", block2, true);

        // 返回数据
        return block2;
    },
    // 发出属性修改通知，本函数自动合并其余未改动过的属性
    // mode 可能是:
    //  - "page"  : 页编辑区发出的，因此不要重绘显示 DOM (applyBlock)
    //  - "panel" : 属性面板发出的，因此不要重绘属性面板了
    //  - null    : 其他地方发出的，组件和面板都要重绘
    notifyBlockChange : function(mode, block) {
        this.fire("change:block", mode, this, (block||this.getBlock()));
    },
    // 相当于先 setBlock 然后再 notifyBlockChange
    saveBlock : function(mode, block, base) {
        if(!base)
            base = this.getBlock();
        block = _.extend(base, block);
        this.setBlock(block);
        this.notifyBlockChange(mode, block);
        return block;
    },
    //........................................................
    applyBlock : function(block) {
        //console.log(block)
        var UI     = this;
        var jCom   = UI.$el;
        var jW     = jCom.children(".hm-com-W");

        block = block || this.getBlock();
        
        // 更新控件的模式
        jCom.attr({
            "hmc-mode"    : block.mode,
            "hmc-pos-by"  : block.posBy,
        });
        
        // console.log(block)
        
        // 准备 css 对象
        var css = {};
        
        // 对于绝对位置，绝对位置的话，应该忽略 margin
        if("abs" == block.mode) {
            _.extend(css, 
                $z.pick(block, "!^(mode|posBy)$"),{
                "position" : "absolute"
            });
        }
        // 相对位置
        else {
            _.extend(css, 
                $z.pick(block, "!^(mode|posBy|top|left|right|bottom)$"),{
                "position" : ""
            });
        }
        
        // 修正 css 的宽高
        if("unset" == css.width)
            css.width = "";
        if("unset" == css.height)
            css.height = "";
                
        // 应用这个修改
        //console.log("css:", css);
        UI.applyBlockCss(css);
        
        // 判断区域是否过小
        var comW = jCom.outerWidth();
        var comH = jCom.outerHeight();
        jCom.attr({
            "hmc-small" : (comW < 300 && comH < 80) || (comW < 80)
                          ? "yes" : null,
        });
        
        // 调用控件特殊的设置
        $z.invoke(UI, "on_apply_block", [block]);
        
    },
    //...............................................................
    appendToArea : function(eArea, quiet) {
        var block;
        // 移动到 Body
        if(!eArea) {
            var uiPage = this.pageUI();
            this.appendTo(uiPage, uiPage.$editBody());
            
            // 切换到相对定位
            // var block = {mode : "abs"};
            var block = {mode : this.$el.attr("hmc-mode")};
        }
        // 移动到分栏
        else {
            // 确定 Area 所在的分栏控件
            var jArea    = $(eArea).closest(".hm-area");
            var jAreaCon = jArea.children(".hm-area-con");
            var comArea  = ZUI(jArea);
            
            // 将自身移动到这个分栏内部
            this.appendTo(comArea, jAreaCon);
            
            // 切换到相对定位
            var block = {mode : "inflow"};
        }
        
        // 修改块属性
        this.checkBlockMode(block);

        // 保存块属性
        this.saveBlock(null, block);
        
        // 通知一下
        if(!quiet)
            this.notifyActived();
    },
    //...............................................................
    // 得到自己关于宽高位置的 css
    getMyRectCss : function() {
        var rect = $z.rect(this.$el);
        var viewport = this.getMyViewportRect();
        // console.log(rect);
        // console.log(viewport);
        return $z.rect_relative(rect, viewport, true);
    },
    //...............................................................
    // 得到控件所属的视口 DOM，如果不在分栏里，那么就是 body
    getMyViewport : function(){
        var jArea = this.$el.closest(".hm-area-con");
        if(jArea.length > 0)
            return jArea;
        return this.$el.closest("body");
    },
    getMyViewportRect : function(){
        return $z.rect(this.getMyViewport());
    },
    //...............................................................
    // 将一个 json 描述的 CSS 对象变成 CSS 文本
    // css 对象，key 作为 selector，值是 JS 对象，代表 rule
    // prefix 为 selector 增加前缀，如果有的话，后面会附加空格
    genCssText : function(css, prefix) {
        prefix = prefix ? prefix + " " : "";
        var re = "";
        for(var selector in css) {
            re += prefix + selector;
            re += this.genCssRuleText(css[selector])
            re += "\n";
        }
        return re;
    },
    genCssRuleText : function(rule) {
        var re = "{";
        for(var key in rule) {
            var val = rule[key];
            if(_.isNumber(val)){
                val = val + "px";
            }
            re += "\n" +$z.lowerWord(key) + ":" + val + ";";
        }
        re += '\n}';
        return re;
    },
}; // ~End methods
//====================================================================
// 得到 HMaker 所有 UI 对象的方法
var HmMethods = require("app/wn.hmaker2/support/hm__methods");

//====================================================================
// 输出
module.exports = function(uiCom){
    // 本函数调用的时机必须是 uiCom 实例还没有被 redraw，这时，我们统一修改
    // 控件的 DOM 结构。我们假想每个控件都为自己的 `dom` 属性设置了 .ui-arena
    // 为根元素的 HTML 结构。当然，同级的元素也可能是 code-template
    //uiCom.keepDom = true;
    
    // 控件默认的布局属性
    $z.setUndefined(uiCom, "getBlockPropFields", function(block){
        return [block.mode == 'inflow' ? "margin" : null,
                "padding","border","borderRadius",
                /*"color",*/ "background",
                "boxShadow","overflow"];
    });
    
    // 控件的默认布局
    $z.setUndefined(uiCom, "getDefaultBlock", function(){
        return {
            mode : "inflow",
            posBy   : "WH",
            width   : "unset",
            height  : "unset",
            padding : "",
            border : "" ,   // "1px solid #000",
            borderRadius : "",
            background : "",
            color : "",
            overflow : "",
            blockBackground : "",
        };
    });
    
    // 控件的默认数据
    $z.setUndefined(uiCom, "getDefaultData", function(){
        return {};
    });
    
    // 控件默认的确保块在各个模式下的正常显示
    $z.setUndefined(uiCom, "checkBlockMode", function(block){
        // 绝对定位的块，必须有宽高
        if("abs" == block.mode) {
            // 确保定位模式正确
            if(!block.posBy || "WH" == block.posBy)
                block.posBy = "TLWH";
            // 确保有必要的位置属性
            var css = this.getMyRectCss();
            // 设置
            _.extend(block, this.pickCssForMode(css, block.posBy));
        }
        // inflow 的块，高度应该为 unset
        else if("inflow" == block.mode){
            _.extend(block, {
                top: "", left:"", bottom:"", right:"", height:"unset",
                posBy : "WH"
            });
        }
        // !!! 不支持
        else {
            throw "unsupport block mode: '" + block.mode + "'";
        }
    });
    
    // 定默认控件应用布局块属性的方法
    $z.setUndefined(uiCom, "applyBlockCss", function(css){
        // 对于相对位置，最重要的是要保证 jW 与块是同样尺寸的
        // 主要是高度
        if(/^[\d.]+(px)?(%)?$/.test(css.height)){
            this.$el.attr("auto-wrap-height", "yes");
        }
        // 没设置高度，则清除
        else {
            this.$el.removeAttr("auto-wrap-height");
        }
            
        // 最后分别应用属性到对应的元素上
        var cssCom   = $z.pick(css, "^(position|top|left|right|bottom|margin|width|height)$");
        var cssArena = $z.pick(css, "!^(position|top|left|right|bottom|margin)$");
        this.$el.css(this.formatCss(cssCom, true));
        this.arena.css(this.formatCss(cssArena, true));
    });
    
    // 重定义控件的 redraw
    var com_redraw = function(){
        // 弱弱的检查一下基础结构
        var jW   = this.$el.children(".hm-com-W");
        if(jW.length == 0)
            throw "com without .hm-com-W : " + uiCom.cid;
        
        // 确保有辅助节点
        var jAss = jW.children(".hm-com-assist");
        if(jAss.length == 0) {
            jAss = $(`<div class="hm-com-assist">
                <div class="hmc-ai" m="H" data-balloon-pos="down" data-balloon="`
                + this.msg("hmaker.drag.com_tip")
                + `"><i class="zmdi zmdi-arrows"></i></div>
                <div class="hmc-ai rsz-hdl1" m="N"></div>
                <div class="hmc-ai rsz-hdl1" m="W"></div>
                <div class="hmc-ai rsz-hdl1" m="E"></div>
                <div class="hmc-ai rsz-hdl1" m="S"></div>
                <div class="hmc-ai rsz-hdl2" m="NW"></div>
                <div class="hmc-ai rsz-hdl2" m="NE"></div>
                <div class="hmc-ai rsz-hdl2" m="SW"></div>
                <div class="hmc-ai rsz-hdl2" m="SE"></div>
            </div>`).prependTo(jW);
        }
        
        // 试图调用一下组件自定义的 redraw
        $z.invoke(this, "_redraw_com", []);
        
        // 绘制布局
        this.applyBlock(this.getBlock());
        
        // 绘制外观
        this.paint(this.getData());
    };
    // 判断一下是针对 Com 实例还是 Com 的定义
    if(uiCom.$ui) {
        uiCom.$ui.redraw = com_redraw;
    } else {
        uiCom.redraw = com_redraw;
    }
    
    // 扩展自身属性
    return _.extend(HmMethods(uiCom), methods, {
        // 修改 DOM 的插入点
        findDomParent : function() {
            var jW = this.$el.find(">.hm-com-W");

            // 没有 Wrapper 则插入内容
            if(jW.length == 0) {
                return $('<div class="hm-com-W">').appendTo(this.$el);
            }

            // 不保持 DOM，则返回 wrapper， ZUI 会重置内容
            if(!this.keepDom)
                return jW;
        },
        // 改变 code-template 的查找方式
        findCodeTemplateDomNode : function(){
            return this.$el.find(">.hm-com-W>.ui-code-template");
        },
        // 改变 arena 的查找方式
        findArenaDomNode : function(){
            return this.$el.find(">.hm-com-W>.ui-arena");
        }
    });
};
//=======================================================================
});