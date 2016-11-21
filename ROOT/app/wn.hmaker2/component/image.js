(function($z){
$z.declare([
    'zui',
    'wn/util',
    'app/wn.hmaker2/support/hm__methods_com'
], function(ZUI, Wn, HmComMethods){
//==============================================
var html = `
<div class="ui-arena hmc-image hm-del-save">
    <img class="hmc-image-pic">
    <div class="hmc-image-txt"></div>
    <div class="hmc-image-link-tip"><i class="zmdi zmdi-link"></i></div>
</div>`;
//==============================================
return ZUI.def("app.wn.hm_com_image", {
    dom     : html,
    keepDom : false,
    //...............................................................
    init : function(){
        HmComMethods(this);
    },
    //...............................................................
    events : {
        "dragstart img" : function(e){
             e.preventDefault();
        },
        // 重置图片的原始宽度
        "dblclick img" : function(e){
            console.log("dblclick img")
            var UI   = this;
            var jImg = UI.arena.children("img");
            var oW = jImg.attr("org-width") * 1;
            var oH = jImg.attr("org-height") * 1;
            if(!isNaN(oW) && !isNaN(oH)) {
                UI.saveBlock(null, {
                    "width"   : oW,
                    "height"  : oH,
                    "padding" : "",
                });
            }
        }
    },
    //...............................................................
    depose : function() {
        this.arena.children("img").off();
    },
    //...............................................................
    // 块大小改变，也同时改变 img 的宽高
    on_apply_block : function(block) {
        var jImg = this.arena.children("img");
        jImg.css({
            "width"  : this.arena.width(),
            "height" : this.arena.height()
        });
    },
    //...............................................................
    paint : function(com) {
        var UI = this;
        var jImg = UI.arena.children("img");
                
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // 指定链接
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if(com.href) {
            UI.arena.attr("image-href", "yes");
        }
        // 清除
        else {
            UI.arena.removeAttr("image-href");
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // 更新图片的样式
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var src  = '';
        if(com.src) {
            // 指定了绝对路径
            if(/^https?:\/\//i.test(com.src)) {
                src = com.src
            }
            // 指定了文件对象
            else if(/^id:[\w\d]+/.test(com.src)) {
                src = '/o/read/' + com.src;
            }
        }
        //console.log(jImg.attr("src"), src)
        // 如果 src 发生变更，重新加载图片后，应该重新设置图片控件宽高
        if(src != jImg.attr("src")) {
            //console.log("haha")
            // 如果图片的原始宽高与设置的相等，那么就表示要自动改变宽高
            var block = UI.getBlock();
            var bW = $z.toPixel(block.width);
            var bH = $z.toPixel(block.height);
            var oW = jImg.attr("org-width") * 1;
            var oH = jImg.attr("org-height") * 1;
            var iW = jImg.width()  || bW;
            var iH = jImg.height() || bH;
            var isAutoResize = (bW == oW && bH== oH) || !src;
            // 开始加载图片
            UI.showLoading();
            jImg.css({width:"", height:"", visibility:"hidden"}).one("load", function(){
                //console.log("reset img w/h")
                UI.hideLoading();
                // 得到原始宽高
                var w = this.width;
                var h = this.height;
                // 记录原始宽高
                jImg.attr({
                    "org-width"  : w,
                    "org-height" : h                    
                });
                // 自动改变改变块的宽高
                if(isAutoResize) {
                    UI.saveBlock(null, {
                        width  : w,
                        height : h
                    });
                    jImg.css("visibility", "");
                }
                // 否则维持原来的图片大小
                else {
                    jImg.css({
                        "visibility" : "",
                        "width"  : iW,
                        "height" : iH
                    });
                }
            });
            // 触发图片的内容改动
            jImg.attr("src", src || '/a/load/wn.hmaker2/img_blank.jpg');
        }

        // 图片拉伸方式
        var fit = "";
        if(com.objectFit && "fill" != com.objectFit) {
            fit = com.objectFit;
        }
        jImg.css("objectFit", fit);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // 准备更新文本样式
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var txt = com.text || {};
        if(txt.content) {
            //console.log(txt)
            // 计算文本的 CSS
            css = {};

            // 文本位置极其宽高，根据顶底左右不同，选择 txt.size 表示的是宽还是高
            switch(txt.pos) {
                // N: North 顶
                case "N":
                    css.top    = 0;
                    css.left   = 0;
                    css.right  = 0;
                    css.bottom = "";
                    css.width  = "";
                    css.height = txt.size || "";
                    break;
                // E: Weat 左
                case "W":
                    css.top    = 0;
                    css.left   = 0;
                    css.right  = "";
                    css.bottom = 0;
                    css.width  = txt.size || "";
                    css.height = "";
                    break;
                // E: East 右
                case "E":
                    css.top    = 0;
                    css.left   = "";
                    css.right  = 0;
                    css.bottom = 0;
                    css.width  = txt.size || "";
                    css.height = "";
                    break;
                // 默认 S: South 底
                default:
                    css.top    = "";
                    css.left   = 0;
                    css.right  = 0;
                    css.bottom = 0;
                    css.width  = "";
                    css.height = txt.size || "";
            }

            // 边距等其他属性
            css.padding    = txt.padding    || "";
            css.color      = txt.color      || "";
            css.background = txt.background || "";
            css.textAlign  = txt.textAlign  || "";
            css.lineHeight = txt.lineHeight  || "";
            css.letterSpacing  = txt.letterSpacing  || "";
            css.fontSize   = txt.fontSize   || "";
            css.textShadow = txt.textShadow || "";

            // 设置文本显示
            UI.arena.children(".hmc-image-txt")
                .text(txt.content)
                .css(css);

            // 标记显示文本
            UI.arena.attr("show-txt", "yes");
        }
        // 标记不显示文本
        else {
            UI.arena.removeAttr("show-txt");
        }

    },
    //...............................................................
    checkBlockMode : function(block) {
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
                top: "", left:"", bottom:"", right:"", 
                posBy : "WH"
            });
        }
        // !!! 不支持
        else {
            throw "unsupport block mode: '" + block.mode + "'";
        }
    },
    //...............................................................
    IMG_FIELDS : function(){
        var oHome = this.getHomeObj();
        return [{
            key    : "src",
            title  : "i18n:hmaker.prop.img_src",
            type   : "string",
            dft    : null,
            uiType : "ui/picker/opicker",
            uiConf : {
                base : oHome,
                setup : {
                    lastObjId : "hmaker_pick_media",
                    filter    : function(o) {
                        if('DIR' == o.race)
                            return true;
                        return /^image/.test(o.mime);
                    }
                },
                parseData : function(str){
                    var m = /id:(\w+)/.exec(str);
                    return m ? Wn.getById(m[1]) : null;
                },
                formatData : function(o){
                    return o ? "id:"+o.id : null;
                }
            }
        }, {
            key    : "href",
            title  : "i18n:hmaker.prop.href",
            type   : "string",
            uiWidth : "all",
            // editAs : "link",
            // uiConf : {
            //     body : {
            //         setup : {
            //             defaultPath : oHome
            //         }
            //     }
            // }
        }, {
            key    : "objectFit",
            title  : "i18n:hmaker.prop.objectFit",
            type   : "string",
            editAs : "link",
            editAs : "switch", 
            uiConf : {
                items : [{
                    text : 'i18n:hmaker.prop.objectFit_fill',
                    val  : 'fill',
                }, {
                    text : 'i18n:hmaker.prop.objectFit_contain',
                    val  : 'contain',
                }, {
                    text : 'i18n:hmaker.prop.objectFit_cover',
                    val  : 'cover',
                }]
            }
        }];
    },
    //...............................................................
    TXT_FIELDS : function(){
        return [{
            key    : "text.content",
            title  : "i18n:hmaker.com.image.text",
            type   : "string",
            dft    : null,
            emptyAsNull : true,
            editAs : "text",
        }, {
            key    : "text.pos",
            title  : "i18n:hmaker.com.image.text_pos",
            type   : "string",
            editAs : "switch",
            uiConf : {
                items : [{
                    text  : "i18n:hmaker.com.image.text_pos_N",
                    value : "N"
                }, {
                    text  : "i18n:hmaker.com.image.text_pos_S",
                    value : "S"
                }, {
                    text  : "i18n:hmaker.com.image.text_pos_W",
                    value : "W"
                }, {
                    text  : "i18n:hmaker.com.image.text_pos_E",
                    value : "E"
                }]
            }
        }, {
            key   : "text.textAlign",
            title : 'i18n:hmaker.com.text.textAlign',
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
            key    : "text.size",
            title  : "i18n:hmaker.com.image.text_size",
            type   : "string",
            uiWidth : 80, 
            editAs : "input",
        }, {
            key    : "text.padding",
            title  : "i18n:hmaker.com.image.text_padding",
            type   : "string",
            uiWidth : 80, 
            editAs : "input",
        }, {
            key    : "text.color",
            title  : "i18n:hmaker.com.image.text_color",
            type   : "string",
            editAs : "color",
        }, {
            key    : "text.background",
            title  : "i18n:hmaker.com.image.text_background",
            type   : "string",
            nullAsUndefined : true,
            editAs : "background",
            uiConf : this.getBackgroundImageEditConf()
        }, {
            key   : "text.lineHeight",
            title : 'i18n:hmaker.com.text.lineHeight',
            type  : "string",
            editAs : "input",
        }, {
            key   : "text.letterSpacing",
            title : 'i18n:hmaker.com.text.letterSpacing',
            type  : "string",
            editAs : "input",
        }, {
            key   : "text.fontSize",
            title : 'i18n:hmaker.com.text.fontSize',
            type  : "string",
            editAs : "input",
        }, {
            key   : "text.textShadow",
            title : 'i18n:hmaker.com.text.textShadow',
            type  : "string",
            editAs : "input",
        }];
    },
    //...............................................................
    getBlockPropFields : function(block) {
        var re = [];
        if(block.mode == 'inflow') {
            re.push("margin");
        }
        return re.concat(["padding","border","borderRadius","background","boxShadow","overflow"]);
    },
    //...............................................................
    // 返回属性菜单， null 表示没有属性
    getDataProp : function(){
        var UI = this;
        return {
            uiType : 'ui/form/form',
            uiConf : {
                uiWidth: "all",
                autoLineHeight : true,
                fields : [{
                    title  : "i18n:hmaker.com.image.tt_image",
                    fields : UI.IMG_FIELDS()
                }, {
                    title  : "i18n:hmaker.com.image.tt_text",
                    fields : UI.TXT_FIELDS()
                }]
            }
        };
    },
    //...............................................................
    getDefaultData : function(){
        return {};
    },
    //...............................................................
    getDefaultBlock : function(){
        return {
            mode : "abs",
            posBy   : "TLWH",
            //posBy   : "top,left,width,height",
            //posVal  : "10px,10px,200px,200px",
            top     : "10px",
            left    : "10px",
            width   : "200px",
            height  : "200px",
            padding : "",
            border : "" ,   // "1px solid #000",
            borderRadius : "",
            overflow : "",
            blockBackground : "",
        };
    },
    //...............................................................
});
//===================================================================
});
})(window.NutzUtil);