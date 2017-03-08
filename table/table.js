
/*
 * table by tianyun
*/

;(function(){
	var XXtable = function(){};
	XXtable.prototype.configuration = {
		container: '',
		url: ''
	};
	XXtable.prototype.init = function(options){
		var self = this;
		self.$container = $(self.container);
		$.extend(true,this,self.configuration,options);
		//	启动
		self.initFrame();
	};
	//	初始化组件结构
	XXtable.prototype.initFrame = function(){
		var self = this;
		var str = '<div class = "XX-table">\
						<div class = "table-body"></div>\
						<div class = "table-footer"></div>\
					</div>';
		self.$container.append($(str));
	};
	window.xxtable = {
		init: function(options){
			var xxtable = new XXtable(options);
			return xxtable;
		}
	}
})()