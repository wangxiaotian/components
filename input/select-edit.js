(function(){
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
                                <select class = "form-control" name = "' + self.name + '">\
                                </select>\
                            </div>\
                        </div>';
            var _selectHtml = $(_html);
            self.$container.replaceWith(_selectHtml);
            self.$select = _selectHtml.find('select');
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
                    self.render(renderData);
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
            renderData.unshift(self.defaultItem);
            return renderData;
        };
        //  渲染 
        Select.prototype.render = function(data) {
            var self = this;
            Utils.requireTpl('select', function(tpl) {
                Utils.render({
                    data: data,
                    tpl: tpl,
                    container: self.$select
                })
            })
        };
    })();
	window.xxinput = {
        initSelect: function(options) {
            var select = new XXinput.Select();
            select.init(options);
            return select;
        }
    }
})()