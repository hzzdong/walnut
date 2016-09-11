({
	icon : '<i class="fa fa-trash"></i>',
	text : "i18n:delete",
	type : "button",
	handler : function($ele, a) {
		var UI = this;
		
		// 没有数据接口 
        if(!_.isFunction(UI.getChecked)){
        	alert(UI.msg("e.act.noapi_obj"));
        	return;
        }
		
		var list = UI.getChecked();
		// 没内容
		if (list.length == 0) {
			alert(UI.msg("obrowser.warn.empty"));
			return;
		}
		// 有目录
		var hasFolder = false;
		for(var o of list){
			if("DIR" == o.race){
				hasFolder = true;
				break;
			}
		}
		if (hasFolder) {
			if (!window.confirm(UI.msg("obrowser.warn.rmdir"))) {
				return;
			}
		}

		// 执行
		var cmdText = "rm -rf ";
		for(var o of list) {
			cmdText += " id:" + o.id;
		}
		Wn.exec(cmdText);

		// 刷新
		$z.invoke(UI, "refresh");
	}
})