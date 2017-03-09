
/*
 * @module xxtable
 * @author ky
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
		$.extend(true,this,self.configuration,options);
		self.$container = $(self.container);
		//	启动
		self.initFrame();
		//	初始化状态
		self.initStatus();
		//	注册分页大小事件
		self.pagination_size();
	};
	//	初始化组件结构
	XXtable.prototype.initFrame = function(){
		var self = this;
		var str = '<div class = "XX-table">\
						<div class = "row">\
							<div class = "col-xs-12">\
								<div class = "table-body"></div>\
							</div>\
							<div class = "col-xs-12" style = "margin-top:20px;">\
								<div class = "table-footer">\
									<div class = "col-xs-1" style = "padding:0px;">\
										<div class="btn-group page_size">\
					                        <button type = "button" class="btn btn-default dropdown-toggle" data-toggle = "dropdown">\
					                            <span class = "size">10</span>条&nbsp;<span class = "caret"></span>\
					                        </button>\
					                        <ul class="dropdown-menu" style = "min-width:62px;" role = "menu">\
					                            <li><a href="#">10</a></li>\
					                            <li><a href="#">20</a></li>\
					                            <li><a href="#">50</a></li>\
					                        </ul>\
					                    </div>\
									</div>\
									<div class="col-xs-3" style = "text-align:left">\
					                    <div class="count">\
					                        第&nbsp;&nbsp;<span class = "currPage page">1</span>&nbsp;&nbsp;页，共&nbsp;&nbsp;<span class = "total page">3</span>&nbsp;&nbsp;页\
					                    </div>\
					                </div>\
					                <div class = "col-xs-1"></div>\
									<div class = "col-xs-5 pull-right page_page" style = "padding:0px;text-align:right;">\
					                    <ul class="pagination" style = "margin:0;">\
					                        <li><a href="#">&laquo;</a></li>\
					                        <li><a href="#">1</a></li>\
					                        <li><a href="#">2</a></li>\
					                        <li><a href="#">3</a></li>\
					                        <li><a href="#">4</a></li>\
					                        <li><a href="#">5</a></li>\
					                        <li><a href="#">&raquo;</a></li>\
					                    </ul>\
                					</div>\
								</div>\
							</div>\
						</div>\
					</div>';
		console.log(self.$container);
		self.$container.append($(str));
		self.tableContainer = $('.XX-table').find('.table-body');
		self.tableFooter = $('.XX-table').find('.table-footer');
	};
	//	初始化组件渲染
	XXtable.prototype.initStatus = function(){
		var self = this;
		//	取表头数据
		self.thData = []; 
		$.each(self.thRow,function(index,value){
			self.thData.push(value.alias);
		})
		//	第一次渲染
		var _params = {
			'url': self.url,
			'data': {
				'pageSize': 10,
				'pageNumber': 1
			}
		}
		self.update(_params,function(res){
			res.data.thData = self.thData;
			self.render(res.data);
		});
	}
	//	更新数据
	XXtable.prototype.update = function(params,cb){
		var self = this;
		var url = params.url,
			data = params.data;
		Utils.getData(url,data,function(res){
			cb(res);
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
	//	选择页数分页
	XXtable.prototype.pagination_page = function(){
		var self = this;

	}
	//	选择每页数量分页
	XXtable.prototype.pagination_size = function(){
		var self = this,
			_page_size = $('.page_size');

		_page_size.find('li').click(function(){
			var _num = $(this).text();
			_page_size.find('button .size').text(_num);
		})
	}
	window.xxtable = {
		init: function(options){
			var xxtable = new XXtable();
			xxtable.init(options);
		}
	}
})()