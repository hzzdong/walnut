(function($z){
$z.declare(['zui', 'wn/util'], function(ZUI, Wn){
//==============================================
var html = function(){/*
<div class="ui-arena obrowser-vmd-thumbnail wn-thumbnail" ui-fitparent="yes">I am thumbnail</div>
*/};
//==============================================
return ZUI.def("ui.obrowser_vmd_thumbnail", {
    dom  : $z.getFuncBodyAsStr(html.toString()),
    //..............................................
    init : function(){
        var UI = this;
        UI.on("ui:display", function(){
            UI.arena.find(".wnobj-nm-con").each(function(){
                // 溢出了，处理一下
                if(this.scrollHeight > this.offsetHeight){
                    $(this).addClass("wnobj-nm-overflow")
                }
            });
        });
    },
    //..............................................
    events : {
        "dblclick .wnobj-thumbnail" : function(e){
            var UI = this;
            // 如果支持单击就打开就啥也不做了，因为单击会打开
            if(UI.options.singleClickOpen){
                return;
            }
            var o = this.getData(e.currentTarget);
            UI.browser.setData("id:"+o.id);
        },
        "click .wnobj-thumbnail" : function(e){
            var UI = this;
            var jq = $(e.currentTarget);
            // 如果支持单击就打开 ...
            if(UI.options.singleClickOpen){
                var o = this.getData(e.currentTarget);
                if(UI.browser.canOpen(o)){
                    UI.browser.setData("id:"+o.id);
                    return;
                }
            }
            // 否则表示选中
            UI.active(jq, e.shiftKey, $z.os.mac?e.metaKey:$z.os.ctrlKey);
        },
        "click .wnobj-nm" : function(e){
            var UI = this;
            var jq = $(e.currentTarget);
            var ctrlIsOn = $z.os.mac?e.metaKey:$z.os.ctrlKey;
            // 如果是选中的，那么就改名
            if(UI.isActived(jq) && !ctrlIsOn){
                console.log("will rename...");
            }
            // 否则表示选中
            else{
                UI.active(jq, e.shiftKey, ctrlIsOn);
            }
        },
        // 取消全部选择
        "click .ui-arena" : function(e){
            if($(e.target).hasClass("ui-arena")){
                this.arena.find(".wnobj")
                    .removeClass("wnobj-actived")
                    .removeClass("wnobj-checked");
            }
        }
    },
    //..............................................
    active : function(ele, shiftIsOn, ctrlIsOn) {
        var UI   = this;
        var jObj = $(ele).closest(".wnobj");

        // 得到原来的激活项
        var jA   = UI.arena.find(".wnobj-actived").not(jObj);

        // 单个多选
        if(ctrlIsOn && UI.browser.options.multi){
            console.log("haha",jObj.size())
            jA.removeClass("wnobj-actived");
            jObj.toggleClass("wnobj-actived")
                .toggleClass("wnobj-checked");
        }
        // 如果是多选
        else if(shiftIsOn && UI.browser.options.multi){
            // 没的激活，激活自己
            if(jA.size() == 0){
                jA = UI.arena.find(".wnobj:first-child");
                jObj.addClass("wnobj-actived wnobj-checked");
            }

            // 寻找开始结束
            var pos_a = jA.index();
            var pos_o = jObj.index();
            var jq
            
            // 如果相等就高亮一个
            if(pos_a == pos_o){
                jq = jA;
            }
            // jObj 在前面
            else if(pos_a > pos_o){
                jq = jObj.nextUntil(jA).addBack().add(jA);
            }
            // jObj 在后面
            else {
                jq = jObj.prevUntil(jA).addBack().add(jA);
            }
            jq.addClass("wnobj-checked");
        }
        // 改变激活项目
        else{
            jA.removeClass("wnobj-actived");
            UI.arena.find(".wnobj-checked").removeClass("wnobj-checked");
            jObj.addClass("wnobj-actived wnobj-checked");
        }
    },
    //..............................................
    update : function(o, UIBrowser){
        var UI = this;

        // 显示正在加载
        UI.showLoading();

        // 得到当前所有的子节点
        UIBrowser.getChildren(o, null, function(objs){
            // 清空
            UI.arena.empty();

            // 循环在选区内绘制图标
            objs.forEach(function(obj){
                Wn.gen_wnobj_thumbnail(UI, obj, 
                    'span',
                    UIBrowser.options.thumbnail
                ).appendTo(UI.arena);
            });
        });
    },
    //..............................................
    getData : function(arg){
        return this.browser.getById($(arg).closest(".wnobj").attr("oid"));
    },
    //..............................................
    isActived : function(ele){
        return $(ele).closest(".wnobj").hasClass("wnobj-actived");
    },
    //..............................................
    getActived : function(){
        var UI = this;
        var jq = UI.arena.find(".wnobj-actived");
        if(jq.size()==0)
            return null;
        return UI.browser.getById(jq.attr("oid"));
    },
    //..............................................
    getChecked : function(){
        var UI = this;
        var re = [];
        this.arena.find(".wnobj-checked, .wnobj-actived").each(function(){
            re.push(UI.browser.getById($(this).attr("oid")));
        });
        return re;
    }
    //..............................................
});
//==================================================
});
})(window.NutzUtil);