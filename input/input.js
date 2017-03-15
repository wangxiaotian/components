;(function(){
	var XXinput = {};
	//	文本输入框
	(function(){
		var Text = XXinput.Text = function(){};
		Text.prototype.configuration = {
			//	容器
			container: '',
			//	name值
			name: '',
			//	label名
			alias: '',
			//	占位值
			placeholder: '',
			//	后缀
			postfix: '',
			//	输入框长度
			length: '',
			//	label长度
			labelLength: '',
			// 可读
			readonly: false

		};
		Text.prototype.init = function(options){
			var self = this;
			$.extend(true,this,self.configuration,options);
			self.initStatus();
			self.initFrame();
		};
		Text.prototype.initStatus = function(){
			var self = this;
			self.$container = $(self.container);
			self.alias = self.$container.data('alias');
			self.name = self.$container.attr('name');
			self.placeholder = self.$container.data('placeholder');
		};
		Text.prototype.initFrame = function(){
			var self = this;
			//	水平表单带后缀
			var _htmlHorizontalWithPostfix = '<div class="form-group">\
												<label for="" class="col-xs-' + self.labelLength + ' control-label">' + self.alias + '</label>\
												<div class="col-xs-' + self.length + '">\
													<div class="input-group">\
														<input type="text" class="form-control" placeholder = "' + self.placeholder + '">\
														<span class="input-group-addon">' + self.postfix + '</span>\
													</div>\
												</div>\
											</div>';
			var _htmlHorizontal = '<div class="form-group">\
										<label for="" class="col-xs-' + self.labelLength + ' control-label">' + self.alias + '</label>\
										<div class="col-xs-' + self.length + '">\
											<input type="text" class="form-control" placeholder = "' + self.placeholder + '">\
										</div>\
									</div>';
			var _html = '';
			//	判断是否有后缀
			if(!!self.postfix){
				_html = _htmlHorizontalWithPostfix;
				
			} else {
				_html = _htmlHorizontal;
			}
			var $input = $(_html);
			self.$container.replaceWith($input);
			//	添加可读性
			if(self.readonly){
				$input.find('input').attr('readonly','readonly');
			}
		}
	})()
	//	下拉选择框
	(function(){
		var Select = XXinput.Select = function(){};
		Select.prototype.configuration = {
			//	容器
			container: '',
			//	数据源
			dataSource: {
				url: '',
				params: []
			},
			//	label长度
			labelLength: '',
			//	选择框长度
			length: '',
			//	label name
			alias: '',
			//	默认项
			defaultOption: ''
		};
		Select.prototype.init = function(options){
			var self = this;
			$.extend(true,this,self.configuration,options);

		};
		Select.prototype.initStatus = function(){
			var self = this;
			self.$container = $(self.container);
			self.alias = $container.data('alias');
		};
		Select.prototype.initFrame = function(){
			var self = this;
			var_html = '<div class = "form-group">\
                            <label class = "control-label col-xs-' + self.labelLength + '">' + self.alias + '</label>\
                            <div class = "col-xs-' + self.length + '">\
                                <select class = "form-control">\
                                <option selected>' + self.defaultOption + '</option>\
                                <option class = "more-option"></option>\
                                </select>\
                            </div>\
                        </div>';
            var _selectHtml = $(_html);
            self.container.replaceWith(_selectHtml);
            self.moreOption = _selectHtml.find('.more-option')
		};
		//	获取数据
		Select.prototype.getData = function(){
			var self = this;
			var _moreOption
			//	dataSource Array
			if(self.dataSource.params instanceof Array){
				console.log('暂不考虑数组情况');
				return;
			} else {
				var url = self.dataSource.url,
					data = '';
				Utils.getData(url,data,function(res){
					var renderData = self.dealData(res);
					Utils.requireTpl('select',function(tpl){
						Utils.render({
							data: renderData,
							tpl: tpl,
							container: ''
						})
					})
				})
			}
		};
		//	渲染
		Select.prototype.render = function(data){

		};
	})()
	window.xxinput = {
		initText: function(options){
			var text = new XXinput.Text();
			text.init(options);
			return text;
		}
	}
})()