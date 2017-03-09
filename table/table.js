
/*
 * table by tianyun
*/

;(function(){
	var XXtable = function(){};
	XXtable.prototype.configuration = {
		container: '',
		url: '',
		thRow: [{
			'name': 'name',
			'alias': '姓名',
		},{
			'name': 'job',
			'alias': '工作'
		},{
			'name': 'phone',
			'alisa': '电话'
		}]
	};
	XXtable.prototype.init = function(options){
		var self = this;
		self.$container = $(self.container);
		$.extend(true,this,self.configuration,options);
		//	启动
		self.initFrame();
		//	初次渲染数据
		self.getData();
	};
	//	初始化组件结构
	XXtable.prototype.initFrame = function(){
		var self = this;
		var str = '<div class = "XX-table">\
						<div class = "table-body"></div>\
						<div class = "table-footer"></div>\
					</div>';
		self.$container.append($(str));
		self.tableContainer = $('.XX-table').find('table-body');
		self.tableFooter = $('.XX-table').find('table-footer');
	};
	//	请求数据
	XXtable.prototype.getData = function(){
		var self = this;
		var url = self.url,
			data = '';
		self.thData = [];
		$.each(self.thRow,function(index,value){
			self.thData.push(value.alias);
		})
		Utils.getData(url,data,function(res){
			res.data.thData = self.thData;
			self.render(res.data);
		})

	};
	//	渲染
	XXtable.prototype.render = function(data){
		var self = this;
		Utils.requireTpl('table',function(tpl){
			Utils.render({
				tpl: tpl,
				data: data,
				container: self.tableContainer
			})
		})
	}
	window.xxtable = {
		init: function(options){
			var xxtable = new XXtable();
			xxtable.init(options);
		}
	}
})()