({
	icon : '<i class="zmdi zmdi-globe-alt"></i>',
	text : "i18n:hmaker.pub_site",
	type : "button",
	handler : function($ele, a) {
		this.pageUI().doPublish();
	}
})