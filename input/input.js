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
    //  表单
    (function() {
        var Form = XXinput.Form = function() {};
        Form.prototype.configuration = {
            //  容器
            container: '',
            //  表单提交地址
            action: '',
            //  验证信息配置
            validate: {},
            //  提交按钮
            submitBtn: '',
            //  提交后的回调
            submitSuccess: function() {
                console.log('提交后的回调')
            }
        };
        Form.prototype.init = function(options) {
            var self = this;
            $.extend(true, this, self.configuration, options);
            self.initStatus();
            self.submit();
            self.initValidate();
            self.initPlug();
        };
        Form.prototype.initStatus = function() {
            var self = this;
            self.$container = $(self.container);
            self.submitBtn = $(self.submitBtn);
        };
        //  初始化插件
        Form.prototype.initPlug = function() {
            var self = this;
            var rules = self.validate.rules,
                messages = self.validate.messages;
            self.validateFunc = self.$container.validate({
                rules: rules,
                messages: messages,
                errorPlacement: function(error, element) {
                    error.appendTo(element.parent());
                }
            })
        };
        //  取值
        Form.prototype.getVal = function() {
            var self = this;
            var paramsStr = self.$container.serialize();
            console.log(decodeURI(paramsStr));
            self.postData = Utils.paramsString2obj(paramsStr);
        };
        //  提交
        Form.prototype.submit = function() {
            var self = this;
            //  提交
            self.submitBtn.on('click', function(event) {
                //  提交前先行验证
                self.$container.valid();
                var _aError = $('.error');
                var error = self.error(_aError);
                if (error) {
                    return;
                }
                //  获取文本值
                self.getVal();
                console.log(typeof self.postData)
                Utils.getData(self.action, self.postData, function(res) {
                    if (res.code == 0) {
                        xxpopup.init({
                                container: '#myModal-alert',
                                title: '提示',
                                body: '提交成功！',
                                type: 'dialog',
                                btnCallback: function() {
                                    self.submitSuccess();
                                }
                            })
                            //  self.submitSuccess();
                    } else {
                        xxpopup.init({
                            container: '#myModal-alert',
                            title: '提示',
                            body: '提交失败！',
                            type: 'alert'
                        })
                    }
                })
                event.preventDefault();
                return false;
            })
        }
        Form.prototype.initValidate = function() {
            var self = this;
            /*
             *  value：元素值，element，元素本身，param：参数
             */
            $.validator.addMethod('phone', function(value, element, params) {
                var reg = /[\d]/;
                return reg.test(value);
            }, '电话号码不能输入数字');
        }
        Form.prototype.error = function(errorEl) {
            var self = this,
                _error = false;
            errorEl.each(function(index, ele) {
                var _text = $(ele).text();
                if (_text) {
                    _error = true;
                    return false;
                }
            })
            return _error;
        }
    })();
    //  通用级联
    (function() {
        var CascadeSelect = XXinput.CascadeSelect = function() {};
        CascadeSelect.prototype.configuration = {
            container: '',
            parmas: [{
                //  labelName
                lableName: '',
                //  默认选项
                defaultOptions: '',
                //  name属性
                name: '',
                //  选框长度
                length: '',
                //  label长度
                labelLength: '',
                //  数据源
                dataSource: {
                    url: '',
                    data: []
                },
                //  处理数据所需参数
                params: {
                    name: 'name',
                    id: 'id'
                },
                dataCallback: function() {
                    console.log('数据处理')
                }
            }]
        };
        CascadeSelect.prototype.init = function(options) {
            var self = this;
            $.extend(true, this, self.configuration, options)
            self.initStatus();
            self.getData();
        };
        CascadeSelect.prototype.initStatus = function() {
            var self = this;
            //  初始化序列
            self.sequence = 0;
            //  初始化postData
            self.postData = {};
            //  初始化取值
            self.name = self.params[self.sequence].params.name;
            self.id = self.params[self.sequence].params.id;
            //  取dom对象
            self.$container = $(self.container);
            self.$select = self.$container.find('input');
            self.initFrame();
            self.trigger();
        };
        CascadeSelect.prototype.initFrame = function() {
            var self = this;
            self.$select.each(function(index, ele) {
                var _html = '<div class = "form-group">\
                            <label class = "control-label col-xs-' + self.params[index].labelLength + '">' + self.params[index].labelName + '</label>\
                            <div class = "col-xs-' + self.params[index].length + '">\
                                <select class = "form-control" name = "' + self.params[index].name + '">\
                                </select>\
                            </div>\
                        </div>';
                $(ele).replaceWith($(_html));
            })
            self.$unit = self.$container.find('.form-group');
        };
        //  默认渲染第一个下拉框
        CascadeSelect.prototype.getData = function() {
            var self = this,
                url = self.params[self.sequence].dataSource.url,
                data = self.postData;
            Utils.getData(url, data, function(res) {
                var data = self.params[self.sequence].dataCallback(res);
                var renderData = self.dealData(data);
                self.render(renderData);
            })
        };
        //  数据处理
        CascadeSelect.prototype.dealData = function(res) {
            //  给最后一层数据
            var self = this,
                renderData = [];
            //  取默认项
            self.$defaultItem = {
                name: self.params[self.sequence].defaultOption,
                id: 0
            };
            $.each(res, function(index, val) {
                var item = {
                    name: val[self.name],
                    id: val[self.id]
                };
                renderData.push(item);
            })
            renderData.unshift(self.$defaultItem);
            return renderData;
        };
        //  render
        CascadeSelect.prototype.render = function(data) {
            var self = this;
            self.moreOption = self.$unit.eq(self.sequence).find('.more-option');
            Utils.requireTpl('select', function(tpl) {
                Utils.render({
                    data: data,
                    tpl: tpl,
                    container: self.$unit.eq(self.sequence).find('select')
                })
            })
        };
        //  event
        CascadeSelect.prototype.trigger = function() {
            var self = this,
                _unit = self.$unit.eq(self.sequence);
            self.$unit.on('change', function() {
                //  先更新索引
                self.sequence = parseInt($(this).index()) + 1;
                var _val = $(this).find('option:selected').attr('value'),
                    _name = $(this).find('select').attr('name'),
                    _nextUnit = self.$unit.eq(self.sequence);
                if (_nextUnit) {
                    if (self.sequence < self.$unit.length) {
                        self.postData = {};
                        self.postData[_name] = _val;
                        self.getData();
                    }

                }
            })
        };
        //  renderNext
    })();
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
        },
        initCascade: function(options) {
            var cascade = new XXinput.CascadeSelect();
            cascade.init(options);
            return cascade;
        }
    }
})()
