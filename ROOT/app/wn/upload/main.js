define(function(require, exports, module) {

	var UI  = require("ui/upload/upload");
	var Mod = require("wn/walnut.client"); 
	
	function init(){
        new UI({
            $pel  : $(document.body),
            model : new Mod(window._app)
        }).render();
    }

    exports.init = init;
});