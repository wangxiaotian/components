;
(function() {
    var XXinput = {};
    //  文本输入框
    (function() {
        var Text = XXinput.Text = function() {};
        Text.prototype.configuration = {
            //  容器
            container: '',
            //  name值
            name: '',
            //  label名
            alias: '',
            //  占位值
            placeholder: '',
            //  后缀
            postfix: '',
            //  输入框长度
            length: '',
            //  label长度
            labelLength: '',
            // 可读
            readonly: false

        };
        Text.prototype.init = function(options) {
            var self = this;
            $.extend(true, this, self.configuration, options);
            self.initStatus();
            self.initFrame();
        };
        Text.prototype.initStatus = function() {
            var self = this;
            self.$container = $(self.container);
            self.alias = self.$container.data('alias');
            self.name = self.$container.attr('name');
            self.placeholder = self.$container.data('placeholder');
        };
        Text.prototype.initFrame = function() {
            var self = this;
            //  水平表单带后缀
            var _htmlHorizontalWithPostfix = '<div class="form-group">\
                                                <label for="" class="col-xs-' + self.labelLength + ' control-label">' + self.alias + '</label>\
                                                <div class="col-xs-' + self.length + '">\
                                                    <div class="input-group">\
                                                        <input type="text" name = "' + self.name + '" class="form-control" placeholder = "' + self.placeholder + '">\
                                                        <span class="input-group-addon">' + self.postfix + '</span>\
                                                    </div>\
                                                </div>\
                                            </div>';
            var _htmlHorizontal = '<div class="form-group">\
                                        <label for="" class="col-xs-' + self.labelLength + ' control-label">' + self.alias + '</label>\
                                        <div class="col-xs-' + self.length + '">\
                                            <input type="text" name = "' + self.name + '" class="form-control" placeholder = "' + self.placeholder + '">\
                                        </div>\
                                    </div>';
            var _html = '';
            //  判断是否有后缀
            if (!!self.postfix) {
                _html = _htmlHorizontalWithPostfix;

            } else {
                _html = _htmlHorizontal;
            }
            var $input = $(_html);
            self.$container.replaceWith($input);
            //  添加可读性
            if (self.readonly) {
                $input.find('input').attr('readonly', 'readonly');
            }
        }
    })();
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
        };
        Select.prototype.initFrame = function() {
            var self = this;
            var _html = '<div class = "form-group">\
                            <label class = "control-label col-xs-' + self.labelLength + '">' + self.alias + '</label>\
                            <div class = "col-xs-' + self.length + '">\
                                <select class = "form-control">\
                                <option selected>' + self.defaultOption + '</option>\
                                <option class = "more-option"></option>\
                                </select>\
                            </div>\
                        </div>';
            var _selectHtml = $(_html);
            self.$container.replaceWith(_selectHtml);
            self.moreOption = _selectHtml.find('.more-option')
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
                    self.render(data);
                })
            }
        };
        //  渲染
        Select.prototype.render = function(data) {
            var self = this;
            Utils.requireTpl('select', function(tpl) {
                Utils.render({
                    data: data,
                    tpl: tpl,
                    container: self.moreOption
                }, true)
            })
        };
    })();
    //  表单
    (function() {
        var Form = XXinput.Form = function() {};
        Form.prototype.configuration = {
            //  容器
            container: '',
            //  表单提交地址
            action: '',
            //  提交按钮
            submitBtn: ''
        };
        Form.prototype.init = function(options) {
            var self = this;
            $.extend(true, this, self.configuration, options);
            self.initStatus();
            self.submit();
        };
        Form.prototype.initStatus = function() {
            var self = this;
            self.$container = $(self.container);
            self.submitBtn = $(self.submitBtn);
        };
        Form.prototype.getVal = function() {
            var self = this;
            var paramsStr = self.$container.serialize();
            self.postData = Utils.paramsString2obj(paramsStr);
        };
        Form.prototype.submit = function() {
            var self = this;
            //  提交
            self.submitBtn.on('click', function(event) {
                //  获取文本值
                self.getVal();
                console.log(typeof self.postData)
                Utils.postData(self.action, self.postData, function(res) {
                    if (res.code == 0) {
                        xxpopup.init({
                            container: '#myModal-alert',
                            title: '提示',
                            body: '提交成功！',
                            type: 'dialog'
                        })
                    } else {
                        xxpopup.init({
                            container: '#myModal-alert',
                            title: '提示',
                            body: '提交失败！',
                            type: 'alert'
                        })
                    }
                })
            })
        }
    })()
    window.xxinput = {
        initText: function(options) {
            var text = new XXinput.Text();
            text.init(options);
            return text;
        },
        initSelect: function(options) {
            var select = new XXinput.Select();
            select.init(options);
            return select;
        },
        initForm: function(options) {
            var form = new XXinput.Form();
            form.init(options);
            return form;
        }
    }
})()
