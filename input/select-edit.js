(function() {
    var XXinput = {};
    //  下拉选择框
    (function() {
        var Select = XXinput.Select = function() {};
        Select.prototype.configuration = {
            //  容器
            container: '',
            //  数据源
            dataSource: {
                url: '',
                params: {}
            },
            //  label长度
            labelLength: '',
            //  选择框长度
            length: '',
            //  label name
            alias: '',
            //  默认项
            defaultOption: '',
            //  默认选中项
            selected: '',
            //  所需数据参数
            params: {
                name: "name",
                id: "id"
            },
            dataCallback: function(res) {
                console.log('后台返回数据格式不能直接使用，需要自己配置数据格式并返回');
                var data = res.data;
                return data;
            }
        };
        Select.prototype.init = function(options) {
            var self = this;
            $.extend(true, this, self.configuration, options);
            self.initStatus();
            self.initFrame();
            self.getData();
        };
        Select.prototype.initStatus = function() {
            var self = this;
            self.$container = $(self.container);
            self.alias = self.$container.data('alias');
            self.name = self.$container.attr('name');
            self.defaultItem = {
                name: self.defaultOption,
                id: 0
            }
        };
        Select.prototype.initFrame = function() {
            var self = this;
            var _html = '<div class = "form-group">\
                            <label class = "control-label col-xs-' + self.labelLength + '">' + self.alias + '</label>\
                            <div class = "col-xs-' + self.length + '">\
                            	<div class="col-xs-12" style = "padding:0">\
                            		<input class = "form-control" type="text" name = "' + self.name + '" placeholder = "' + self.defaultOption + '" />\
                            	</div>\
                            	<div class="col-xs-12">\
									<ul class = "dropdown-menu">\
									</ul>\
                            	</div>\
                            </div>\
                        </div>';
            var _selectHtml = $(_html);
            self.$container.replaceWith(_selectHtml);
            self.$input = _selectHtml.find('input');
            self.$ul = _selectHtml.find('ul');
        };
        //  获取数据
        Select.prototype.getData = function() {
            var self = this;
            var _moreOption;
            //  dataSource Array
            if (self.dataSource.params instanceof Array) {
                console.log('暂不考虑数组情况');
                return;
            } else {
                var url = self.dataSource.url,
                    data = '';
                Utils.getData(url, data, function(res) {
                    var data = self.dataCallback(res);
                    var renderData = self.dealData(data);
                    self.renderData = renderData;
                    self.render(renderData);
                    self.event(renderData);
                })
            }
        };
        //  数据处理
        Select.prototype.dealData = function(res) {
            //  给最后一层数据
            var self = this,
                renderData = [];
            $.each(res, function(index, val) {
                var item = {
                    name: val[self.params.name],
                    id: val[self.params.id]
                };
                renderData.push(item);
            })
            /*renderData.unshift(self.defaultItem);*/
            return renderData;
        };
        //  渲染 
        Select.prototype.render = function(data) {
            var self = this;
            Utils.requireTpl('select', function(tpl) {
                Utils.render({
                    data: data,
                    tpl: tpl,
                    container: self.$ul
                })
            })
        };
        Select.prototype.event = function(){
        	var self = this;
        	inputQuery(self.renderData,self.$input,self.$ul,{
        		filter: function(val){
        			return val.name
        		},
        		str: function(val){
		            return '<li value = "' + val.id + '"><a href="javascript:;">' + val.name + '</a></li>';
		        }
        	})
        }
        function inputQuery(data, input, ul, oRender, interval) {
            var $input = $(input),
                $ul = $(ul),
                timer,
                interval = interval || 100,
                me = $(this);

            function getKey() {
                return $input.val();
            };

            function render() {
                var key = getKey(),
                    str = '';
                $.each(data, function(index, val) {
                    if (!(oRender.filter(val).match(key))) return true;
                    str += oRender.str(val);
                })
                $ul.empty();
                $ul.append(str);
                $ul.css({
                    'display': 'block'
                })
            }
            //  获取焦点
            $input.on('focus', function() {

                render();
            });
            //  关键字查询,过滤数据

            $input.on('input', function() {
                    if (timer) return;
                    timer = setTimeout(function() {
                        render();
                        clearTimeout(timer);
                        timer = null;
                    }, interval)
                })
                //  选中
            $ul.on('click', 'li', function() {
                    var id = $(this).attr('data-alias'),
                        text = $(this).text();
                    $input.val(text);
                    $input.attr('data-id', id);
                    $ul.css({
                        'display': 'none'
                    })
                })
                //  隐藏
            $('*').on('click', function(event) {
                var target = event.target,
                    tc = target.localName;
                if (tc == 'input' || tc == 'li') return;
                $ul.css({
                    'display': 'none'
                })
            });
        }
    })();
    window.xxinput = {
        initSelect: function(options) {
            var select = new XXinput.Select();
            select.init(options);
            return select;
        }
    }
})()
