define(function (require, exports, module) {
var methods = {
    //........................................................
    // 获取组件的 ID
    getComId : function(){
        return this.$el.attr("id");
    },
    // 获取组件的 type
    getComType : function() {
        return this.$el.attr("ctype");
    },
    // 判断组件是否是激活的
    isActived : function() {
        return this.$el.attr("hm-actived") == "yes";
    },
    //........................................................
    notifyActived : function(){
        this.fire("active:com", this);
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
    },
    //........................................................
    applyBlock : function(block) {
        var UI     = this;
        var jCom   = UI.$el;
        var jW     = jCom.children(".hm-com-W");
        var jArena = jW.children(".ui-arena");
        
        // 更新控件的模式
        jCom.attr({
            "hmc-mode"    : block.mode,
            "hmc-pos-by"  : block.posBy,
            // 判断区域是否过小
            "hmc-small-W" : block.width<100  ? "yes" : null,
            "hmc-small-H" : block.height<100 ? "yes" : null,
        });
        
        // console.log(block)
        
        // 准备 css 对象
        var cssCom, cssArena;
        
        // 对于绝对位置，绝对位置的话，应该忽略 margin
        if("abs" == block.mode) {
            cssCom = $z.pick(block, "^(top|left|right|bottom|width|height)$");
            cssCom.position = "absolute";
            
            cssArena = $z.pick(block,
                "!^(mode|posBy|top|left|right|bottom|width|height|margin)$");
        }
        // 相对位置
        else {
            cssCom   = $z.pick(block, "^(width|height|margin)$");
            cssArena = $z.pick(block,
                "!^(mode|posBy|top|left|right|bottom|width|height|margin)$");
        }
        
        // 确保内容区域如果被滚动和剪裁，是有宽高的
        if(/^(auto|hidden|scroll)/.test(cssArena.overflow)){
            cssArena.width  = "100%";
            cssArena.height = "100%";
        }
        // 否则清除这个设置
        else {
            cssArena.width  = "";
            cssArena.height = "";
        }
                
        // 位置和大小属性，记录在块上
        jCom.css(UI.formatCss(cssCom, true));
        
        // 其他记录在显示区上
        jArena.css(UI.formatCss(cssArena, true));
        
        // 调用控件特殊的设置
        $z.invoke(UI, "on_apply_block", [block]);
        
    },
    //...............................................................
    // 得到自己关于宽高位置的 css
    getMyRectCss : function() {
        var rect = $z.rect(this.$el);
        var viewport = this.getMyViewportRect();
        return $z.rect_relative(rect, viewport, true);
    },
    //...............................................................
    // 得到控件所属的视口 DOM，如果不在分栏里，那么就是 body
    getMyViewport : function(){
        var jArea = this.$el.closest(".hmb-area");
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
    // 判断一个 DOM 元素是否在一个激活的块中
    isInActivedBlock : function(jq) {
        return $(jq).closest(".hm-block").attr("hm-actived") == "yes";
    },
    // 判断控件自身是否是 Actived
    isActived : function() {
        return this.$el.closest(".hm-block").attr("hm-actived") == "yes";
    },
    // 在属性面板的扩展元素接口，绘制自定义 UI
    drawComEleInProp : function(uiDef, callback) {
        this.propUI("edit").drawComEle(uiDef, callback);
    }
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
        var re = [];
        if(block.mode == 'inflow') {
            re.push("margin");
        }
        return re.concat(["padding","border","borderRadius",/*"color",*/
            "background","boxShadow","overflow",
        ]);
    });
    
    // 控件的默认布局
    $z.setUndefined(uiCom, "getDefaultBlock", function(){
        return {
            mode : "inflow",
            posBy   : "WH",
            width   : "auto",
            height  : "auto",
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
        // inflow 的块，高度应该为 auto
        else if("inflow" == block.mode){
            _.extend(block, {
                top: "", left:"", bottom:"", right:"", height:"auto",
                posBy : "WH"
            });
        }
        // !!! 不支持
        else {
            throw "unsupport block mode: '" + block.mode + "'";
        }
    });
    
    // 重定义控件的 redraw
    uiCom.$ui.redraw = function(){
        // 弱弱的检查一下基础结构
        var jW   = this.$el.children(".hm-com-W");
        if(jW.length == 0)
            throw "com without .hm-com-W : " + uiCom.cid;
        
        // 确保有辅助节点
        var jAss = jW.children(".hm-com-assist");
        if(jAss.length == 0) {
            jAss = $(`<div class="hm-com-assist">
                <div class="hmc-ai" m="H"><i class="zmdi zmdi-layers"></i><em>`
                + uiCom.msg("hmaker.drag.com_tip")
                + `</em></div>
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
        
        // 绘制布局
        this.applyBlock(this.getBlock());
        
        // 绘制外观
        this.paint(this.getData());
    };
    
    // 扩展自身属性
    return _.extend(HmMethods(uiCom), methods, {
        // 修改 DOM 的插入点
        findDomParent : function() {
            var jW = this.$el.find(">.hm-com-W");
            if(jW.length == 0) {
                return $('<div class="hm-com-W">').appendTo(this.$el);
            }
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