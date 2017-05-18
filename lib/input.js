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
            readonly: false,
            //  是否显示label(默认不显示-依情景在组件中更改)
            showLabel: false,
            /*
             *  input事件回调
             *  @params     curObj      {jq element}    
            */
            inputCb: function(curObj){

            }
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
            //  判断是否需要label
            var show = self.showLabel ? '' : 'hide';
            //  水平表单带后缀
            var _htmlHorizontalWithPostfix = '<div class="form-group">\
                                                <label for="" class="' + show + ' col-xs-' + self.labelLength + ' control-label">' + self.alias + '</label>\
                                                <div class="col-xs-' + self.length + '">\
                                                    <div class="input-group">\
                                                        <input type="text" name = "' + self.name + '" class="form-control" placeholder = "' + self.placeholder + '">\
                                                        <span class="input-group-addon">' + self.postfix + '</span>\
                                                    </div>\
                                                </div>\
                                            </div>';
            var _htmlHorizontal = '<div class="form-group">\
                                        <label for="" class="' + show + ' col-xs-' + self.labelLength + ' control-label">' + self.alias + '</label>\
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
            self.oInput = $input.find('input');
            self.handle();
            self.$container.replaceWith($input);
            //  添加可读性
            if (self.readonly) {
                $input.find('input').attr('readonly', 'readonly');
            }
        }
        Text.prototype.handle = function(){
            var self = this;
            self.oInput.on('input',function(){
                var me = $(this);
                self.inputCb(me);
            })
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
                data: {}
            },
            //  label长度
            labelLength: '',
            //  是否显示label
            showLabel: false,
            //  选择框长度
            length: '',
            //  label name
            alias: '',
            //  默认项
            defaultOption: '',
            //  选中项
            selected: '',
            //  渲染所需数据参数
            params: {
                name: "name",
                id: "id"
            },
            //  请求所需参数，(类级联，却又不符合通用级联)
            reqParams: {

            },
            //  等待渲染，类似级联的条件渲染
            wait: false,
            //  只读
            disabled: false,
            /*
             *  @params     res         {json}              请求源数据
             */
            dataCallback: function(res) {
                //  console.log('后台返回数据格式不能直接使用，需要自己配置数据格式并返回');
                var data = res.data;
                return data;
            },
            /*
             *  渲染后调用
             *  @params     obj         {jq element}    tagName:select
             */
            afterRender: function(obj) {

            },
            /*
             *  选中触发回调
             *  @params     curOption   {jq element}    tagName:option  
             *  @params     obj         {jq element}    tagName:select
             */
            trigger: function(curOption, obj) {

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
        };
        Select.prototype.initFrame = function() {
            var self = this;
            //  判断是否需要label
            var show = self.showLabel ? '' : 'hide',
                disabled = self.disabled ? 'disabled' : '';
            var _html = '<div class = "form-group">\
                            <label class = "' + show + ' control-label col-xs-' + self.labelLength + '">' + self.alias + '</label>\
                            <div class = "col-xs-' + self.length + '">\
                                <select ' + disabled + ' class = "form-control" name = "' + self.name + '">\
                                </select>\
                            </div>\
                        </div>';
            var _selectHtml = $(_html);
            self.$container.replaceWith(_selectHtml);
            self.$select = _selectHtml.find('select');
            self.handle();
        };
        //  获取数据 && 组件重绘
        Select.prototype.getData = function(reqParams) {
            var self = this;
            var _moreOption;
            //  dataSource Array
            var localData = self.dataSource.data;
            if (!$.isEmptyObject(localData)) {
                if (self.wait) {
                    self._render(self.dealData())
                } else {
                    var data = self.dataCallback(localData);
                    var renderData = self.dealData(data);
                    self._render(renderData);
                }
            } else {
                var url = self.dataSource.url
                data = reqParams || self.reqParams || null;
                if (self.wait) {
                    self._render(self.dealData());
                } else {
                    Utils.getData(url, data, function(res) {
                        var data = self.dataCallback(res);
                        var renderData = self.dealData(data);
                        self._render(renderData);
                    })
                }
            }
        };
        //  数据处理
        Select.prototype.dealData = function(res) {
            //  给最后一层数据
            var self = this,
                renderData = [],
                $defaultItem = {
                    name: self.defaultOption,
                    id: 0
                };
            if (res) {
                $.each(res, function(index, val) {
                    var item = {
                        name: val[self.params.name],
                        id: val[self.params.id]
                    };
                    renderData.push(item);
                })
            }
            renderData.unshift($defaultItem);
            return renderData;
        };
        //  渲染
        Select.prototype._render = function(data) {
            var self = this;
            Utils.requireTpl('select', function(tpl) {
                Utils.render({
                    data: data,
                    tpl: tpl,
                    container: self.$select
                }, false, self.afterRender)
            })
        };
        //  事件触发
        Select.prototype.handle = function() {
            var self = this;
            self.$select.on('change', function() {
                var _obj = $(this),
                    _curObj = $(this).find('option:selected');
                self.trigger && self.trigger(_curObj, _obj);
            })
        }
        //  外部渲染接口，reqParams为每次渲染所传参数
        Select.prototype.render = function(reqParams) {
            var self = this;
            self.wait = false;
            $.extend(true,reqParams,self.reqParams)
            self.getData(reqParams);
        }
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
            //  是否表单提交
            isSubmit: true,
            //  提交后的回调
            submitSuccess: function() {
                console.log('提交后的回调')
            },
            //  其它参数
            params: {}
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
                if (error) return;
                /*if (error) {
                    self.submitBtn.attr('disabled','disabled');
                } else {
                    self.submitBtn.attr('disabled','');
                }
                if(!!!self.isSubmit) return;*/
                //  获取文本值
                self.getVal();
                $.extend(self.postData, self.params);
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
                //  是否显示label
                showLabel: false,
                //  只读
                disabled: false,
                //  数据源
                dataSource: {
                    url: '',
                    data: {}
                },
                //  处理数据所需参数
                params: {
                    name: 'name',
                    id: 'id'
                },
                //  请求数据附加参数
                reqParams: {

                },
                /*
                 *  选中触发回调
                 *  @params     curOption   {jq element}    tagName:option  
                 *  @params     obj         {jq element}    tagName:select
                 */
                trigger: function(curOption, obj) {

                },
                /*
                 *  @params {JSON}  请求源数据
                 */
                dataCallback: function(res) {
                    //  console.log('后台返回数据格式不能直接使用，需要自己配置数据格式并返回');
                    var data = res.data;
                    return data;
                },
                /*
                 *  渲染后调用
                 *  @params {Object}    obj    当前组件 selectNode Jquery dom obj
                 */
                afterRender: function(obj) {

                }
            }]
        };
        CascadeSelect.prototype.init = function(options) {
            var self = this;
            $.extend(true, this, self.configuration, options)
            self.initStatus();
            self.getData();
            self._trigger();
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
        };
        CascadeSelect.prototype.initFrame = function() {
            var self = this;
            //  判断是否需要label
            self.$select.each(function(index, ele) {
                var show = self.params[index].showLabel ? '' : 'hide',
                disabled = self.params[index].disabled ? 'disabled' : '';
                var _html = '<div class = "form-group">\
                            <label class = "' + show + ' control-label col-xs-' + self.params[index].labelLength + '">' + self.params[index].labelName + '</label>\
                            <div class = "col-xs-' + self.params[index].length + '">\
                                <select ' + disabled + ' class = "form-control" name = "' + self.params[index].name + '">\
                                </select>\
                            </div>\
                        </div>';
                $(ele).replaceWith($(_html));
            })
            self.$unit = self.$container.find('>div');
            self.renderDefaultOptions();
        };
        //  默认渲染第一个下拉框
        CascadeSelect.prototype.getData = function() {
            var self = this;
            var url = self.params[self.sequence].dataSource.url,
                localData = self.params[self.sequence].dataSource.data,
                data = $.extend(self.postData,self.params[self.sequence].reqParams);

            if (localData) {
                self.render(self.dealData(localData,self.sequence),self.sequence);
            } else {
                Utils.getData(url, data, function(res) {
                    var data = self.params[self.sequence].dataCallback(res);
                    var renderData = self.dealData(data, self.sequence);
                    self.render(renderData, self.sequence);
                })
            }
        };
        //  数据处理
        CascadeSelect.prototype.dealData = function(res, _index) {
            //  给最后一层数据
            var self = this,
                renderData = [];
            //  取默认项
            self.$defaultItem = {
                name: self.params[_index].defaultOption,
                id: 0
            };
            if (res) {
                $.each(res, function(index, val) {
                    var item = {
                        name: val[self.name],
                        id: val[self.id]
                    };
                    renderData.push(item);
                })
            }

            renderData.unshift(self.$defaultItem);
            return renderData;
        };
        //  render 
        CascadeSelect.prototype.render = function(data, _index) {
            var self = this;
            self.moreOption = self.$unit.eq(_index).find('.more-option');
            Utils.requireTpl('select', function(tpl) {
                Utils.render({
                    data: data,
                    tpl: tpl,
                    container: self.$unit.eq(_index).find('select')
                }, false,self.params[_index].afterRender)
            })
        };
        //  渲染默认项
        CascadeSelect.prototype.renderDefaultOptions = function() {
            var self = this;
            var _length = self.$unit.length;
            for (var i = 0; i < _length; i++) {
                self.render(self.dealData(null, i), i)
            }
        };
        //  event
        CascadeSelect.prototype._trigger = function() {
            var self = this,
                //  当前选框select
                _unit = self.$unit.eq(self.sequence);
            //  self.params[self.sequence].beforeNextRender && self.params[self.sequence].beforeNextRender(_unit,'change');
            self.$unit.on('change', function() {
                var _obj = $(this),
                    _index = _obj.index(),
                    _curOption = _obj.find('option:selected');
                self.params[_index].trigger && self.params[_index].trigger(_curOption, _obj);
                //  先更新索引
                self.sequence = parseInt($(this).index()) + 1;
                var _val = $(this).find('option:selected').attr('value'),
                    _name = $(this).find('select').attr('name'),
                    _nextUnit = self.$unit.eq(self.sequence);
                if (self.sequence < self.$unit.length ) {
                    self.postData = {};
                    self.postData[_name] = _val;
                    self.getData();
                }
            })
        };
    })();
    //  文本框
    (function() {
        var Textarea = XXinput.Textarea = function() {}
        Textarea.prototype.configuration = {
            //  容器
            container: '',
            //  label名
            alias: '',
            //  naem值
            name: '',
            //  label长度
            labelLength: 4,
            //  表单长度
            length: 8,
            //  高度
            height: 100,
            //  字符限制
            maxLength: '',
            //  是否显示label
            showLabel: false,
            maxLengthWarn: true
        };
        Textarea.prototype.init = function(options) {
            var self = this;
            $.extend(true, this, self.configuration, options);
            self.initStatus();
        };
        Textarea.prototype.initStatus = function() {
            var self = this;
            self.$container = $(self.container);
            self.createFrame();
        };
        Textarea.prototype.createFrame = function() {
            var self = this;
            var showLabel = self.showLabel ? '' : 'hide';
            var str = '<div class = "form-group" style = "">\
                            <label style = "" class = "control-label ' + showLabel + ' col-xs-' + self.labelLength + '">' + self.alias + '</label>\
                            <div class = "col-xs-' + self.length + '">\
                                <textarea = "inp" class = "form-control" style = "height:' + self.height + 'px" name = "' + self.name + '" maxLength = "' + self.maxLength + '"></textarea>\
                                <p class = "warn">还剩<span class = "num1"></span>个字符，最多只能输入<span class = "num2">' + self.maxLength + '</span>个字符</p>\
                            </div>\
                        </div>';
            var html = $(str);
            self.$textarea = html.find('textarea');
            self.$warn = html.find('p');
            self.$warn.hide();
            self.$container.replaceWith(html);
            if (self.maxLengthWarn) {
                self.warn();
            }
        };
        Textarea.prototype.warn = function() {
            var self = this;
            self.$textarea.on('input', function() {
                var curr = $(this).val().length;
                var theRest = parseInt(self.maxLength) - parseInt(curr);
                self.$warn.find('.num1').text(theRest);
                if (curr > 0) {
                    self.$warn.show();
                } else {
                    self.$warn.hide();
                }
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
        },
        initCascade: function(options) {
            var cascade = new XXinput.CascadeSelect();
            cascade.init(options);
            return cascade;
        },
        initTextarea: function(options) {
            var textarea = new XXinput.Textarea();
            textarea.init(options);
            return textarea;
        }
    }
})()
