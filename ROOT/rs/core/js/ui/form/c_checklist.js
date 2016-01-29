(function($z){
$z.declare([
    'zui'
], function(ZUI){
//==============================================
var html = function(){/*
<div class="ui-arena com-checklist com-butlist">
    <ul></ul>
</div>
*/};
//===================================================================
return ZUI.def("ui.form_com_checklist", {
    //...............................................................
    dom  : $z.getFuncBodyAsStr(html.toString()),
    //...............................................................
    init : function(options){
        $z.setUndefined(options, "icon", function(o){
            if(_.isObject(o)) 
                return o.icon;
        });
        $z.setUndefined(options, "text", function(o){
            if(_.isString(o))
                return o;
            return o.text;
        });
        $z.setUndefined(options, "value", function(o, index){
            if(_.isString(o))
                return index;
            return _.isUndefined(o.val) ? index : o.val;
        });
    },
    //...............................................................
    events : {
        "click li" : function(e){
            var UI = this;
            var jq = $(e.currentTarget);
            // 有限多选的话 ...
            if(UI.options.multi > 1){
                if(jq.hasClass("checked")){
                    jq.removeClass("checked");
                }
                // 没超过了限制，才能再选
                else if(UI.arena.find("li.checked").size() < UI.options.multi){
                    jq.addClass("checked");
                }
                // 否则警告
                else{
                    alert(UI.msg("com.multilimit", {n:UI.options.multi}));
                }
            }
            // 随便多选的话 ...
            else{
                jq.toggleClass("checked");
            }
        }
    },
    //...............................................................
    redraw : function(){
        var UI  = this;
        var re = ["loading"];
        $z.evalData(UI.options.items, null, function(items){
            UI._draw_items(items);
            re.pop();
            UI.defer_report(0, "loading");
        });
        return re;
    },
    //...............................................................
    _draw_items : function(items){
        var UI  = this;
        var opt = UI.options;
        var jUl = UI.arena.find("ul");
        var context = opt.context || UI;

        var hasIcon = false;
        for(var i=0; i<items.length; i++){
            var item = items[i];
            var val  = opt.value.call(context, item, i); 

            var jLi = $('<li>').appendTo(jUl)
                .attr("index", i)
                .data("@VAL", val);

            // 选择框
            $('<span it="but"><i class="fa fa-square-o"></i><i class="fa fa-check-square"></i></span>')
                .appendTo(jLi);

            // 图标
            var icon = opt.icon.call(context, item, i);
            jIcon = $('<span it="icon">').appendTo(jLi);
            if(_.isString(icon)){
                jIcon.html(icon);
                hasIcon = true;
            }

            // 文字
            var text = opt.text.call(context, item, i);
            $('<b it="text">').text(UI.text(text)).appendTo(jLi);
        }

        // 没有 Icon 就全部移除
        if(!hasIcon){
            UI.arena.find("span[it='icon']").remove();
        }
    },
    //...............................................................
    getData : function(){
        var re = [];
        this.arena.find("li.checked").each(function(){
            re.push($(this).data("@VAL"));
        });
        return re;
    },
    //...............................................................
    setData : function(val){
        var UI = this;

        // 确保值是一个数组
        if(!_.isArray(val)){
            val = [val];
        }
        // 查找吧少年
        UI.arena.find("li").each(function(){
            var jLi = $(this);
            var v0  = jLi.data("@VAL");
            if(val.indexOf(v0)>=0){
                jLi.addClass("checked");
            }
        });
        
    }
    //...............................................................
});
//===================================================================
});
})(window.NutzUtil);