/**
 * 表单控件
 * @module  yform
 * @author xjc
 */ 
jQuery(function($) {
    (function(utils) {
        Yinput = {

        };
 
        // text 输入框 可以设置
        (function() {
            var Text = Yinput.Text = function() {

            }

            Text.prototype.defaultOptions = {
                // 容器
                container: 'body',
                // 输入项的 name
                name: '',
                // 输入项的别名
                alias: '',
                // 占位符
                placeholder: '',
                // 文本输入框的单位
                postfix: '',
                // 文本输入框的长度
                length: 9,
                // label 的长度
                labelLength: 3,
                // input mask
                mask: '',
                // 输入框的提示信息
                tip: '',
                // 只读
                readonly: false
            };

            Text.prototype.init = function(options) {
                $.extend(this, this.defaultOptions, options);

                this.initConfig();

                this.initFrame();

                this.initMask();

            };

            Text.prototype.initConfig = function() {
                var self = this;
                // 获取容器
                var $container = $(self.container);
                // 获取 name
                var name = $container.attr('name');
                if (!!name) {
                    self.name = name;
                }
                // 获取 alias
                var alias = $container.data('alias');
                if (!!alias) {
                    self.alias = alias;
                }
                // 获取 value
                var value = $container.attr('value');
                if (!!value) {
                    self.value = value;
                }

                // 获取 value
                var tip = $container.data('tip');
                if (!!tip) {
                    self.tip = tip;
                }
                // 获取 placeholder
                var placeholder = $container.data('placeholder');
                if (!!placeholder) {
                    self.placeholder = placeholder;
                }
            }

            Text.prototype.initFrame = function() {

                    var self = this;

                    // 限制表单的最大宽度
                    if (self.length > 9) {
                        self.length = 9;
                    }
                    // 水平表单的结构 后缀
                    var htmlStrOfHorizontalWithPost = '<div class="form-group">\
                                                <label class="col-xs-' + self.labelLength + ' control-label no-padding-right" for="' + self.name + '">' + self.alias + '</label>\
                                                <div class="col-xs-' + self.length + '">\
                                                    <div class="input-group" data-rel="tooltip">\
                                                        <input placeholder="' + self.placeholder + '" class="form-control" type="text" name="' + self.name + '">\
                                                        <span class="input-group-addon">' + self.postfix + '</i></span>\
                                                    </div>\
                                                </div>\
                                            </div>';

                    // 水平表单的结构 不带后缀
                    var htmlStrOfHorizontal = '<div class="form-group">\
                                                <label class="col-xs-' + self.labelLength + ' control-label no-padding-right" for="' + self.name + '">' + self.alias + '</label>\
                                                <div class="col-xs-' + self.length + '" data-rel="tooltip">\
                                                    <input placeholder="' + self.placeholder + '" class="form-control" type="text" name="' + self.name + '" >\
                                                </div>\
                                            </div>';



                    // 行内表单的结构带后缀
                    var htmlStrOfInlineWithPost = '<div class="form-group">\
                                            <label class="control-label no-padding-right" for="' + self.name + '">' + self.alias + '</label>\
                                            &nbsp;&nbsp;\
                                            <div class="input-group" data-rel="tooltip">\
                                                <input placeholder="' + self.placeholder + '" class="form-control" type="text" name="' + self.name + '">\
                                                <span class="input-group-addon">' + self.postfix + '</i></span>\
                                            </div>\
                                        </div>';

                    // 行内表单的结构不带后缀
                    var htmlStrOfInline = '<div class="form-group" data-rel="tooltip">\
                                            <label class="control-label no-padding-right" for="' + self.name + '">' + self.alias + '</label>\
                                            &nbsp;&nbsp;\
                                                <input placeholder="' + self.placeholder + '" class="form-control" type="text" name="' + self.name + '">\
                                        </div>';


                    var htmlStr;
                    var $input;
                    // 判断表单为内联表单，或者水平表单
                    if ($(self.container).closest('form').hasClass('form-horizontal')) {
                        // postfix为后缀的意思
                        if (!!self.postfix) {
                            htmlStr = htmlStrOfHorizontalWithPost;
                        } else {
                            htmlStr = htmlStrOfHorizontal;
                        }

                        $input = $(htmlStr);

                    } else {
                        if (!!self.postfix) {
                            htmlStr = htmlStrOfInlineWithPost;
                        } else {
                            htmlStr = htmlStrOfInline;
                        }
                        $input = $(htmlStr);
                        $input.css({
                            marginBottom: '20px'
                        })
                    }
                    self.$input = $input;
                    $(self.container).replaceWith($input);
                    // 添加值
                    if (!!self.value) {
                        $input.find('input').val(self.value);
                    }

                    if (self.tip !== '') {
                        self.$input.find('[data-rel="tooltip"]').tooltip({
                            container: 'body',
                            title: self.tip,
                            trigger: 'focus',
                            placement: 'top'
                        });
                    }

                    // 添加只读属性
                    if (self.readonly) {
                        self.$input.find('input').attr('readonly', 'readonly');
                    }
                }
                /**
                 * 初始化 input 的 mask 插件
                 * @return {[type]} [description]
                 */
            Text.prototype.initMask = function() {
                var self = this;
                if (!self.mask) {
                    return;
                }

                self.$input.find('[type=text]').mask(self.mask, { placeholder: " " });
            };
            /**
             * 设置 value 值
             * @param {[type]} value [description]
             */
            Text.prototype.setValue = function(value) {
                var self = this;

                self.$input.find('[type=text]').val(value);
            }
        })();
        // text 输入框 可以设置
        (function() {
            var Textarea = Yinput.Textarea = function() {

            }

            Textarea.prototype.defaultOptions = {
                // 容器
                container: 'body',
                // 输入项的 name
                name: '',
                // 输入项的别名
                alias: '',
                // 文本输入框的长度
                length: 9,
                // label 的长度
                labelLength: 3,
                // 输入框的提示信息
                tip: '',
                // 只读
                readonly: false,
                // 最大字数
                maxlength: 1000,
                height: 200
            };

            Textarea.prototype.init = function(options) {
                $.extend(this, this.defaultOptions, options);

                this.initConfig();

                this.initFrame();

                this.initPlug();

            };

            Textarea.prototype.initConfig = function() {
                var self = this;
                // 获取容器
                var $container = $(self.container);
                // 获取 name
                var name = $container.attr('name');
                if (!!name) {
                    self.name = name;
                }
                // 获取 alias
                var alias = $container.data('alias');
                if (!!alias) {
                    self.alias = alias;
                }
                // 获取 value
                var value = $container.attr('value');
                if (!!value) {
                    self.value = value;
                }

                // 获取 value
                var tip = $container.data('tip');
                if (!!tip) {
                    self.tip = tip;
                }
            }

            Textarea.prototype.initFrame = function() {
                var self = this;

                // 限制表单的最大宽度
                if (self.length > 9) {
                    self.length = 9;
                }

                // 水平表单的结构 不带后缀
                var htmlStrOfHorizontal = '<div class="form-group">\
                                                <label class="col-xs-' + self.labelLength + ' control-label no-padding-right" for="' + self.name + '">' + self.alias + '</label>\
                                                <div class="col-xs-' + self.length + '" data-rel="tooltip">\
                                                    <textarea class="form-control" name="' + self.name + '" style="height:' + self.height + 'px"></textarea>\
                                                </div>\
                                            </div>';


                var htmlStr = htmlStrOfHorizontal;
                var $input = $(htmlStr);
                self.$input = $input;
                $(self.container).replaceWith($input);

                // 添加值
                if (!!self.value) {
                    $input.find('input').val(self.value);
                }

                if (self.tip !== '') {
                    self.$input.find('[data-rel="tooltip"]').tooltip({
                        container: 'body',
                        title: self.tip,
                        trigger: 'focus',
                        placement: 'top'
                    });
                }

                // 添加只读属性
                if (self.readonly) {
                    self.$input.find('input').attr('readonly', 'readonly');
                }
            }

            /**
             * 初始化 input 的 mask 插件
             * @return {[type]} [description]
             */
            Textarea.prototype.initPlug = function() {
                var self = this;
                var $textarea = $(self.$input).find('textarea');
                $textarea.inputlimiter({
                    remText: '还剩%n个字符',
                    limitText: '最多只能输入%n个字符',
                    limit: self.maxlength
                });
                $textarea.autosize({
                    append: "\n"
                });
                $textarea.removeAttr('maxlength');
            };

            /**
             * 设置 value 值
             * @param {[type]} value [description]
             */
            Textarea.prototype.setValue = function(value) {
                var self = this;

                self.$input.find('[type=text]').val(value);
            }
        })();
        // 地区选择下拉输入框
        (function() {
            var AreaSelector = Yinput.AreaSelector = function() {

            }

            AreaSelector.prototype.defaultOptions = {
                // 容器
                container: 'body',
                // 输入项的 name
                name: '',
                // 输入项的别名
                alias: '',
                // 输入框宽度
                length: 4,
                // label 的长度
                labelLength: 3,
                // 省的接口
                provinceUrl: '',
                // 市的接口
                cityUrl: '',
                // 地区的接口
                areaUrl: ''
            };

            AreaSelector.prototype.init = function(options) {
                $.extend(this, this.defaultOptions, options);

                this.initConfig();

                this.initFrame();

                this.initEvent();
            };

            AreaSelector.prototype.initConfig = function() {
                var self = this;
                // 获取容器
                var $container = $(self.container);
                // 获取 name
                var name = $container.attr('name');
                if (!!name) {
                    self.name = name;
                }
                // 获取 alias
                var alias = $container.data('alias');
                if (!!alias) {
                    self.alias = alias;
                }
                // 获取 value
                var value = $container.attr('value');
                if (!!value) {
                    self.value = value;
                }
                // 获取 placeholder
                var placeholder = $container.data('placeholder');
                if (!!placeholder) {
                    self.placeholder = placeholder;
                }
                // 获取省的id
                var valueProvince = $container.data('value-province');
                if (!!valueProvince) {
                    self.valueProvince = valueProvince;
                }
                // 获取市的id
                var valueCity = $container.data('value-city');
                if (!!valueCity) {
                    self.valueCity = valueCity;
                }
                // 获取区的id
                var valueArea = $container.data('value-area');
                if (!!valueArea) {
                    self.valueArea = valueArea;
                }
            }

            AreaSelector.prototype.initFrame = function() {

                var self = this;

                var point = '';
                if (!!self.name) {
                    point = '.';
                }

                // 限制表单的最大宽度
                if (self.length > 9) {
                    self.length = 9;
                }
                // 行内表单的结构 不带后缀
                var htmlStrOfInline = '<div class="form-group yinput-area-selector">\
                                            <label class="control-label">' + self.alias + '</label>\
                                            &nbsp;&nbsp;\
                                            <select class="form-control shen-selector" name="' + self.name + point + 'province">\
                                                <option value="-1" selected>选择省</option>\
                                            </select>\
                                            &nbsp;&nbsp;\
                                            <select class="form-control shi-selector"  name="' + self.name + point + 'city">\
                                                <option value="-1" selected>选择市</option>\
                                            </select>\
                                            &nbsp;&nbsp;\
                                            <select class="form-control qu-selector"  name="' + self.name + point + 'area">\
                                                <option value="-1" selected>选择区</option>\
                                            </select>\
                                        </div>';

                // 水平表单的结构不带后缀
                var htmlStrOfHorizontal = '<div class="form-group yinput-area-selector">\
                                        <label class="col-xs-' + self.labelLength + ' control-label no-padding-right">' + self.alias + '</label>\
                                        <div class="col-xs-' + self.length + '">\
                                            <div class="row">\
                                                <div class="col-xs-4">\
                                                    <select class="form-control shen-selector"  name="' + self.name + point + 'province">\
                                                        <option value="-1" selected>选择省</option>\
                                                    </select>\
                                                </div>\
                                                <div class="col-xs-4">\
                                                    <select class="form-control shi-selector"  name="' + self.name + point + 'city">\
                                                        <option value="-1" selected>选择市</option>\
                                                    </select>\
                                                </div>\
                                                <div class="col-xs-4">\
                                                    <select class="form-control qu-selector"  name="' + self.name + point + 'area">\
                                                        <option value="-1" selected>选择区</option>\
                                                    </select>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>';


                var htmlStr;
                var $input;
                // 判断表单为内联表单，或者水平表单
                if ($(self.container).closest('form').hasClass('form-horizontal')) {
                    $input = $(htmlStrOfHorizontal);
                } else {
                    $input = $(htmlStrOfInline);
                    $input.css({
                        marginBottom: '20px'
                    })
                }

                self.$input = $input;

                $(self.container).replaceWith($input);

                // 更新省下拉跨的数据
                self.updateShen(self.valueProvince);
                self.updateShi(self.valueProvince, self.valueCity);
                self.updateQu(self.valueCity, self.valueArea);

                // 控制样式 readonly
                if (self.readonly) {
                    $input.find('select').css({
                        pointerEvents: 'none',
                        background: '#f5f5f5'
                    }).parent().css({
                        cursor: 'not-allowed',
                    })
                }
            };

            AreaSelector.prototype.initEvent = function() {
                var self = this;
                // 省下拉跨选中后更新市下拉框 // 清空区下拉框
                self.$input.find('.shen-selector').on('change', function() {
                    var id = $(this).val();
                    // 更新市下拉框
                    self.updateShi(id);
                    self.$input.find('.shi-selector')
                        .val(-1);
                    // 清空区下拉框
                    self.$input.find('.qu-selector')
                        .html('<option value="-1" selected>选择区</option>')
                        .val(-1);
                });

                // 市下拉框选中后更新区下拉框
                self.$input.find('.shi-selector').on('change', function() {
                    var id = $(this).val();
                    // 更新市下拉框
                    self.updateQu(id);
                    self.$input.find('.qu-selector')
                        .val(-1);
                });
            };

            /**
             * 更新省下拉框的选项
             * @param {String} id  省的 id
             * @return {[type]} [description]
             */
            AreaSelector.prototype.updateShen = function(id) {
                var self = this;
                // 获取数据填充下拉列表
                utils.requireTmpl('widgets/yinput/selector', function(tpl) {
                    var optionData;
                    // 获取数据源信息
                    var url = self.provinceUrl;

                    if (!url) {
                        return false;
                    }
                    // 参数
                    var params = {}
                    utils.getData(url, params, function(response) {
                        if (response.status !== 0) {
                            console.log('获取选择框数据失败');
                            return;
                        }

                        // 选线数据
                        optionData = response.data;
                        // 添加默认选项
                        var defaultOption = {
                            value: '-1',
                            alias: '选择省'
                        }
                        // 默认选项，可以先不写
                        self.addDefaultOption(optionData, defaultOption);
                        // 渲染模板
                        utils.render({
                                tmpl: tpl,
                                data: optionData,
                                context: self.$input.find('.shen-selector'),
                                overwrite: true
                            })
                            // 添加值
                        if (!!id) {
                            self.$input.find('.shen-selector').val(id);
                        }
                        self.$input.find('.shen-selector').trigger('rendered');
                    });
                });
            };

            /**
             * 判断下拉框是否含有值
             * @return {Boolean} [description] 
             */
            AreaSelector.prototype.hasValue = function($select, value){
                var result = false;
                $select.find('option').each(function(){
                    if($(this).val().toString() === value.toString()){
                        result = true;
                    }
                })
                return result;
            };

            /**
             * 更新市下拉框的选项
             * @param {Number} parentId  省的id
             * @param {Number} id        市 id
             * @return {[type]} [description]
             */
            AreaSelector.prototype.updateShi = function(parentId, id) {
                if (!parentId) return;
                var self = this;
                utils.requireTmpl('widgets/yinput/selector', function(tpl) {
                    var optionData;
                    // 获取数据源信息
                    var url = self.cityUrl;

                    if (!url) {
                        return false;
                    }
                    // 参数
                    var params = {
                        id: parentId
                    }
                    utils.getData(url, params, function(response) {
                        if (response.status !== 0) {
                            console.log('获取选择框数据失败');
                            return;
                        }

                        // 选线数据
                        optionData = response.data;
                        // 添加默认选项
                        var defaultOption = {
                            value: '-1',
                            alias: '选择市'
                        }
                        self.addDefaultOption(optionData, defaultOption);
                        // 渲染模板
                        utils.render({
                                tmpl: tpl,
                                data: optionData,
                                context: self.$input.find('.shi-selector'),
                                overwrite: true
                            })
                            // 添加值
                        if (!!id) {
                            self.$input.find('.shi-selector').val(id);
                        }
                        self.$input.find('.shi-selector').trigger('rendered');
                    });
                });
            }

            /**
             * 更新区下拉框的选项
             * @param {Number} parentId  市的id
             * @param {Number} id  区的id
             * @return {[type]} [description]
             */
            AreaSelector.prototype.updateQu = function(parentId, id) {
                if (!parentId) return;

                var self = this;
                utils.requireTmpl('widgets/yinput/selector', function(tpl) {
                    var optionData;
                    // 获取数据源信息
                    var url = self.areaUrl;

                    if (!url) {
                        return false;
                    }
                    // 参数
                    var params = {
                        id: parentId
                    }
                    utils.getData(url, params, function(response) {
                        if (response.status !== 0) {
                            console.log('获取选择框数据失败');
                            return;
                        }

                        // 选线数据
                        optionData = response.data;
                        // 添加默认选项
                        var defaultOption = {
                            value: '-1',
                            alias: '选择区'
                        }
                        self.addDefaultOption(optionData, defaultOption);
                        // 渲染模板
                        utils.render({
                                tmpl: tpl,
                                data: optionData,
                                context: self.$input.find('.qu-selector'),
                                overwrite: true
                            })
                            // 添加值
                        if (!!id) {
                            self.$input.find('.qu-selector').val(id);
                        }
                        self.$input.find('.qu-selector').trigger('rendered');
                    });
                });
            }

            /**
             * 添加默认选项
             * @param {Array} options       所有选项
             * @param {Object} defaultOption  默认选项
             */
            AreaSelector.prototype.addDefaultOption = function(options, defaultOption) {
                // 是否存储在
                var isExistInOptions = false;
                // 判断默认选项是否在选项中，如果不在选项中，则添加
                $.each(options, function(index, option) {
                    if (defaultOption.value === option.value) {
                        isExistInOptions = true;
                        option.selected = 'selected';
                    } else {
                        option.selected = '';
                    }
                });
                // 如果默认选线不存在在 options 中，则添加
                if (!isExistInOptions) {
                    defaultOption.selected = 'selected';
                    options.unshift(defaultOption);
                }
            }
        })();
        // 下拉选择框 
        (function() {
            var Selector = Yinput.Selector = function() {

            }

            Selector.prototype.defaultOptions = {
                // 容器
                container: 'body',
                // 输入项的 name
                name: '',
                // 输入项的别名
                alias: '',
                // 默认值
                defaultOption: null,
                // 数据源 如果数据源为对象，则从接口获取数据，如果数据源是数组，则将数据源作为
                dataSource: {
                    url: '',
                    params: {

                    }
                },
                // 文本输入框的长度
                length: 9,
                labelLength: 3
            };

            Selector.prototype.init = function(options) {
                $.extend(this, this.defaultOptions, options);
                
                this.initConfig();

                this.initFrame();
            };
            // initConfig即是获取配置项，主要是dom结构里配置的data属性值
            Selector.prototype.initConfig = function() {
                var self = this;
                // 获取容器
                var $container = $(self.container);
                // 获取 name
                var name = $container.attr('name');
                if (!!name) {
                    self.name = name;
                }
                // 获取 alias
                var alias = $container.data('alias');
                if (!!alias) {
                    self.alias = alias;
                }
                // 获取 value
                var value = $container.attr('value');
                if (!!value) {
                    self.value = value;
                }
                // 获取 placeholder
                var placeholder = $container.data('placeholder');
                if (!!placeholder) {
                    self.placeholder = placeholder;
                }

            } 

            Selector.prototype.initFrame = function() {
                var self = this;

                // 限制表单的最大宽度
                if (self.length > 9) {
                    self.length = 9;
                }

                var htmlStrOfHorizontal = '<div class="form-group">\
                                                <label class="col-xs-' + self.labelLength + ' control-label no-padding-right" for="' + self.name + '">' + self.alias + '</label>\
                                                <div class="col-xs-' + self.length + '">\
                                                    <select class="form-control" name="' + self.name + '"></select>\
                                                </div>\
                                            </div>';
                var htmlStrOfInline = '<div class="form-group">\
                                            <label class="control-label no-padding-right" for="' + self.name + '">' + self.alias + '</label>\
                                            &nbsp;&nbsp;\
                                            <select class="form-control" name="' + self.name + '"></select>\
                                        </div>';

                var $input;

                // 判断表单为内联表单，或者水平表单
                if ($(self.container).closest('form').hasClass('form-horizontal')) {
                    $input = $(htmlStrOfHorizontal);
                } else {
                    $input = $(htmlStrOfInline);
                    $input.css({
                        marginBottom: '20px'
                    })
                }

                // 获取数据填充下拉列表
                utils.requireTmpl('widgets/yinput/selector', function(tpl) {
                    var optionData;
                    if (self.dataSource instanceof Array) {

                        // 选线数据
                        optionData = self.dataSource;
                        // 添加默认选项
                        if (!!self.defaultOption) {
                            self.addDefaultOption(optionData, self.defaultOption);
                        }

                        // 渲染模板
                        utils.render({
                            tmpl: tpl,
                            data: self.dataSource,
                            context: $input.find('select'),
                            overwrite: true
                        });
                        // 添加 value 
                        if (!!self.value) {
                            $input.find('select').val(self.value);
                            $input.find('select').trigger('input');
                        }
                        // 触发渲染完成事件
                        $input.find('select').trigger('rendered');
                    } else {
                        // 获取数据源信息
                        var url = self.dataSource.url;
                        var params = self.dataSource.params;

                        if (!url) {
                            return false;
                        }
                        if (!params) {
                            params = {};
                        }
                        utils.getData(url, params, function(response) {
                            if (response.status !== 0) {
                                console.log('获取选择框数据失败');
                                return;
                            }

                            // 选线数据
                            optionData = response.data;
                            // 添加默认选项
                            if (!!self.defaultOption) {
                                self.addDefaultOption(optionData, self.defaultOption);
                            }
                            // 渲染模板
                            utils.render({
                                tmpl: tpl,
                                data: optionData,
                                context: $input.find('select'),
                                overwrite: true
                            })
                            // 添加 value 
                            if (!!self.value) {
                                $input.find('select').val(self.value);
                                $input.find('select').trigger('input');
                            }
                            // 触发渲染完成事件
                            $input.find('select').trigger('rendered');
                        });

                    }
                });

                // 替换元素
                $(self.container).replaceWith($input);

                // 控制样式 readonly
                if (self.readonly) {
                    $input.find('select').css({
                        pointerEvents: 'none',
                        background: '#f5f5f5'
                    }).parent().css({
                        cursor: 'not-allowed',
                    })
                }
            };

            /**
             * 添加默认选项
             * @param {Array} options       所有选项
             * @param {Object} defaultOption  默认选项
             */
            Selector.prototype.addDefaultOption = function(options, defaultOption) {
                // 是否存储在
                var isExistInOptions = false;
                // 判断默认选项是否在选项中，如果不在选项中，则添加
                $.each(options, function(index, option) {
                    if (defaultOption.value === option.value) {
                        isExistInOptions = true;
                        option.selected = 'selected';
                    } else {
                        option.selected = '';
                    }
                });
                // 如果默认选线不存在在 options 中，则添加
                if (!isExistInOptions) {
                    defaultOption.selected = 'selected';
                    options.unshift(defaultOption);
                }
            }
        })();
        // 日期选择框 可以设置
        (function() {
            var DatePicker = Yinput.DatePicker = function() {

            }

            DatePicker.prototype.defaultOptions = {
                // 容器
                container: 'body',
                // 输入项的 name
                name: '',
                // 输入项的别名
                alias: '',
                // 长度
                length: 3

            };

            DatePicker.prototype.init = function(options) {
                $.extend(this, this.defaultOptions, options);

                this.initConfig();

                this.initFrame();
                this.initPlug();
            };

            DatePicker.prototype.initConfig = function() {
                var self = this;
                // 获取容器
                var $container = $(self.container);
                // 获取 name
                var name = $container.attr('name');
                if (!!name) {
                    self.name = name;
                }
                // 获取 alias
                var alias = $container.data('alias');
                if (!!alias) {
                    self.alias = alias;
                }
                // 获取 value
                var value = $container.attr('value');
                if (!!value) {
                    self.value = value;
                }
                // 获取 placeholder
                var placeholder = $container.data('placeholder');
                if (!!placeholder) {
                    self.placeholder = placeholder;
                }
            };

            DatePicker.prototype.initFrame = function() {
                var self = this;

                // 限制表单的最大宽度
                if (self.length > 9) {
                    self.length = 9;
                }
                var htmlStrOfHorizontal = '<div class="form-group">\
                                                <label class="col-xs-3 control-label no-padding-right" for="' + self.name + '">' + self.alias + '</label>\
                                                <div class="col-xs-' + self.length + '">\
                                                    <div class="input-group">\
                                                        <input class="form-control date-picker" name="' + self.name + '" type="text" data-date-format="yyyy-mm-dd" placeholder="请选择日期"/>\
                                                        <span class="input-group-addon">\
                                                            <i class="fa fa-calendar bigger-110"></i>\
                                                        </span>\
                                                    </div>\
                                                </div>\
                                            </div>';
                var htmlStrOfInline = '<div class="form-group">\
                                            <label class="control-label no-padding-right" for="' + self.name + '">' + self.alias + '</label>\
                                            &nbsp;&nbsp;\
                                            <div class="input-group">\
                                                <input class="form-control date-picker" name="' + self.name + '" type="text" data-date-format="yyyy-mm-dd" placeholder="请选择日期" />\
                                                <span class="input-group-addon">\
                                                    <i class="fa fa-calendar bigger-110"></i>\
                                                </span>\
                                            </div>\
                                        </div>';

                var $input;

                // 判断表单为内联表单，或者水平表单
                if ($(self.container).closest('form').hasClass('form-horizontal')) {
                    $input = $(htmlStrOfHorizontal);
                } else {
                    $input = $(htmlStrOfInline);
                    $input.css({
                        marginBottom: '20px'
                    })
                }

                self.$input = $input;

                // 替换元素
                $(self.container).replaceWith($input);
                self.container = $input;

                // 控制 readonly
                if (self.readonly) {
                    $input.find('input')
                        .attr('readonly', 'readonly')
                        .css({
                            pointerEvents: 'none'
                        });
                }
            };

            /**
             * 初始化插件
             */
            DatePicker.prototype.initPlug = function() {
                var self = this;
                var picker = $(self.container).find('.date-picker').datepicker({
                    autoclose: true,
                    todayHighlight: true,
                    language: 'zh-cn'
                })

                // 添加 value
                if (!!self.value) {
                    picker.datepicker('setDate', self.value);
                }

                self.picker = picker;
            };
            /**
             * 设置 value 值
             * @param {[type]} value [description]
             */
            DatePicker.prototype.setValue = function(value) {
                var self = this;
                self.picker.datepicker('setDate', value);
            };
            /**
             * 获取 value 值
             * @param {[type]} value [description]
             */
            DatePicker.prototype.getValue = function(value) {
                var self = this;
                return self.picker.datepicker('getDate');
            };

            DatePicker.prototype.on = function(eventName, handler) {
                var self = this;
                self.picker.datepicker().on(eventName, handler);
            };
            /**
             * 设置 起始日期值
             * @param {[type]} value [description]
             */
            DatePicker.prototype.setStartDate = function(value) {
                    var self = this;
                    self.picker.datepicker('setStartDate', value);
                }
                /**
                 * 设置 结束日期值
                 * @param {[type]} value [description]
                 */
            DatePicker.prototype.setEndDate = function(value) {
                var self = this;
                self.picker.datepicker('setEndDate', value);
            }
        })();
        // 日期范围选择框 可以设置
        (function() {
            var DateRange = Yinput.DateRange = function() {

            }

            DateRange.prototype.defaultOptions = {
                // 容器
                container: 'body',
                // 输入项的 name
                name: '',
                // 输入项的别名
                alias: '',
                // 长度
                length: 3,
                labelLength: 3,
                // 是否只有月份
                onlyMonth: false
            };

            DateRange.prototype.init = function(options) {
                $.extend(this, this.defaultOptions, options);

                this.initConfig();

                this.initFrame();
                this.initPlug();
            };

            DateRange.prototype.initConfig = function() {
                var self = this;
                // 获取容器
                var $container = $(self.container);
                // 获取 name
                var name = $container.attr('name');
                if (!!name) {
                    self.name = name;
                }
                // 获取 alias
                var alias = $container.data('alias');
                if (!!alias) {
                    self.alias = alias;
                }
                // 获取 value-start
                var valueStart = $container.data('value-start');
                if (!!valueStart) {
                    self.valueStart = valueStart;
                }
                // 获取 value-end
                var valueEnd = $container.data('value-end');
                if (!!valueEnd) {
                    self.valueEnd = valueEnd;
                }

                // 获取 placeholder
                var placeholder = $container.data('placeholder');
                if (!!placeholder) {
                    self.placeholder = placeholder;
                }
            }


            DateRange.prototype.initFrame = function() {
                var self = this;

                // 限制表单的最大宽度
                if (self.length > 9) {
                    self.length = 9;
                }
                // 根据name 判断是否加上点
                var point = '';
                if (!!self.name) {
                    point = '.';
                }
                var htmlStrOfHorizontal = '<div class="form-group">\
                                                <label class="col-xs-' + self.labelLength + ' control-label no-padding-right">' + self.alias + '</label>\
                                                <div class="col-xs-' + self.length + '">\
                                                    <div class="input-group">\
                                                        <input class="form-control date-picker" name="' + self.name + point + 'dateStart" type="text" placeholder="请选择开始日期"/>\
                                                        <span class="input-group-addon">\
                                                            <i class="fa fa-calendar bigger-110"></i>\
                                                        </span>\
                                                    </div>\
                                                </div>\
                                                <div class="col-xs-1 text-center"><label class="control-label">到</label></div>\
                                                <div class="col-xs-' + self.length + '">\
                                                    <div class="input-group">\
                                                        <input class="form-control date-picker" name="' + self.name + point + 'dateEnd" type="text" placeholder="请选择结束日期"/>\
                                                        <span class="input-group-addon">\
                                                            <i class="fa fa-calendar bigger-110"></i>\
                                                        </span>\
                                                    </div>\
                                                </div>\
                                            </div>';
                var htmlStrOfInline = '<div class="form-group">\
                                            <label class="control-label no-padding-right">' + self.alias + '</label>\
                                            &nbsp;&nbsp;\
                                            <div class="input-group">\
                                                <input class="form-control date-picker" name="' + self.name + point + 'dateStart" type="text" placeholder="请选择开始日期"/>\
                                                <span class="input-group-addon">\
                                                    <i class="fa fa-calendar bigger-110"></i>\
                                                </span>\
                                            </div>\
                                            &nbsp;&nbsp;到&nbsp;&nbsp;\
                                            <div class="input-group">\
                                                <input class="form-control date-picker" name="' + self.name + point + 'dateEnd" type="text" placeholder="请选择结束日期"/>\
                                                <span class="input-group-addon">\
                                                    <i class="fa fa-calendar bigger-110"></i>\
                                                </span>\
                                            </div>\
                                        </div>';

                var $input;

                // 判断表单为内联表单，或者水平表单
                if ($(self.container).closest('form').hasClass('form-horizontal')) {
                    $input = $(htmlStrOfHorizontal);
                } else {
                    $input = $(htmlStrOfInline);
                    $input.css({
                        marginBottom: '20px'
                    })
                }

                // 替换元素
                $(self.container).replaceWith($input);
                self.container = $input;


                // 控制 readonly
                if (self.readonly) {
                    $input.find('input')
                        .attr('readonly', 'readonly')
                        .css({
                            pointerEvents: 'none'
                        });
                }
            };

            /**
             * 初始化插件
             */
            DateRange.prototype.initPlug = function() {
                var format = 'yyyy-mm-dd';
                var self = this;
                if(self.onlyMonth){
                    format = 'yyyy-mm';
                }
                var pickers = $(self.container).find('.date-picker').datepicker({
                    autoclose: true,
                    todayHighlight: true,
                    language: 'zh-cn',
                    format: format
                });
                // 存贮 选择器句柄
                self.pickers = pickers;

                // 添加 value-start
                if (!!self.valueStart) {
                    // pickers.eq(0).val(self.valueStart);
                    self.setValueOfStart(self.valueStart);
                }
                // 添加 value-end
                if (!!self.valueEnd) {
                    // pickers.eq(1).val(self.valueEnd);
                    self.setValueOfEnd(self.valueEnd);
                }

                // 添加事件
                // 起始选择框的结束时间不能大于结束选择框的选择
                pickers.eq(0).datepicker().on('changeDate', function() {
                    // 获取当前选择的日期
                    var date = pickers.eq(0).datepicker('getDate');
                    // 设置结束范围选择的起始值
                    pickers.eq(1).datepicker('setStartDate', date);
                });
                // 结束选择框的起始时间不能大于起始选择框的选择
                pickers.eq(1).datepicker().on('changeDate', function() {
                    // 获取当前选择的日期
                    var date = pickers.eq(1).datepicker('getDate');
                    // 设置结束范围选择的结束值
                    pickers.eq(0).datepicker('setEndDate', date);
                });

                // 事件绑定
                if(self.onlyMonth){
                    var firstShow = true;
                    pickers.datepicker()
                        .on('show', function(){
                            var self = this;
                            if(firstShow){
                                firstShow = false;
                                $('.datepicker').find('.datepicker-switch').eq(0).trigger('click');    
                            }
                        })
                        .on('hide', function(){
                            firstShow = true;
                        }).on('changeMonth', function(){
                            $('.datepicker').find('.datepicker-days .day:not(.old)').eq(0).trigger('click');
                        });   
                }

            };

            /**
             * 设置日期范围的起始值
             * @param {[type]} value [description]
             */
            DateRange.prototype.setValueOfStart = function(value) {
                    var self = this;
                    self.pickers.eq(0).datepicker('setDate', value);
                    // 设置结束范围选择的起始值
                    self.pickers.eq(1).datepicker('setStartDate', value);
                }
                /**
                 * 设置日期范围的结束值
                 * @param {[type]} value [description]
                 */
            DateRange.prototype.setValueOfEnd = function(value) {
                    var self = this;
                    self.pickers.eq(1).datepicker('setDate', value);
                    // 设置起始范围选择的结束值
                    self.pickers.eq(0).datepicker('setEndDate', value);
                }
                /**
                 * 设置日期范围的起始值的起始范围
                 * @param {[type]} value [description]
                 */
            DateRange.prototype.setStartDate = function(value) {
                    var self = this;
                    self.pickers.eq(0).datepicker('setStartDate', value);
                    self.pickers.eq(1).datepicker('setStartDate', value);
                }
                /**
                 * 设置日期范围的结束值的结束方位
                 * @param {[type]} value [description]
                 */
            DateRange.prototype.setEndDate = function(value) {
                var self = this;
                self.pickers.eq(0).datepicker('setEndDate', value);
                self.pickers.eq(1).datepicker('setEndDate', value);
            }
        })();
        // 图片上传输入框
        (function() {
            // 配置提示框
            Dropzone.confirm = function(question, accepted, rejected) {
                Utils.confirm(question, function(){
                    return accepted();
                });
            };
            var ImageUpload = Yinput.ImageUpload = function() {

            }

            ImageUpload.prototype.defaultOptions = {
                // 容器
                container: 'body',
                // 输入项的 name
                name: '',
                // 输入项的别名
                alias: '',
                // 长度
                length: 7,
                // 最大文件的数量
                fileNumber: 1,
                // 当前文件数量
                fileNumberNow: 0,
                url: '',
                labelLength: 3,
                widthLimit: -1,
                heightLimit: -1,
                disabled: false,
                // 最大文件到小，单位:字节
                maxSize: Infinity
            };

            ImageUpload.prototype.init = function(options) {
                $.extend(this, this.defaultOptions, options);

                this.initConfig();
                this.initFrame();
                this.initPlug();
            };

            ImageUpload.prototype.initConfig = function() {
                var self = this;
                // 获取容器
                var $container = $(self.container);
                // 获取 name
                var name = $container.attr('name');
                if (!!name) {
                    self.name = name;
                }
                // 获取 alias
                var alias = $container.data('alias');
                if (!!alias) {
                    self.alias = alias;
                }
                // 获取 value
                var value = $container.attr('value');
                if (!!value) {
                    self.value = value;
                }
                // 将 value 转化为 Array
                if (self.value) {
                    self.value = value.split(';');
                } else {
                    self.value = [];
                }

                // 获取 url
                var urls = $container.data('urls');
                if (!urls) {
                    urls = self.urls;
                }
                if (!!urls) {
                    urls = urls.split(';');
                }
                self.urls = urls;
            }

            ImageUpload.prototype.initFrame = function() {
                var self = this;

                // 限制表单的最大宽度
                if (self.length > 9) {
                    self.length = 9;
                }

                var htmlStrOfHorizontal = '<div class="form-group">\
                                                <label class="col-xs-' + self.labelLength + ' control-label no-padding-right" for="' + self.name + '">' + self.alias + '</label>\
                                                <div class="col-xs-' + self.length + '">\
                                                    <input type="hidden" name="' + self.name + '"/>\
                                                    <form class="dropzone well">\
                                                        <div class="fallback">\
                                                            <input name="file" type="file" multiple="" />\
                                                        </div>\
                                                    </form>\
                                                </div>\
                                            </div>';
                var htmlStrOfInline = '<div class="form-group">\
                                            <label class="control-label no-padding-right" for="' + self.name + '">' + self.alias + '</label>\
                                            &nbsp;&nbsp;\
                                            <input type="hidden" name="' + self.name + '" />\
                                            <form class="dropzone well">\
                                                <div class="fallback">\
                                                    <input name="file" type="file" multiple="" />\
                                                </div>\
                                            </form>\
                                        </div>';

                var $input;

                // 判断表单为内联表单，或者水平表单
                if ($(self.container).closest('form').hasClass('form-horizontal')) {
                    $input = $(htmlStrOfHorizontal);
                } else {
                    $input = $(htmlStrOfInline);
                    $input.css({
                        marginBottom: '20px'
                    })
                }
                self.$input = $input;
                // 替换元素
                $(self.container).replaceWith($input);
                self.container = $input;
            };

            /**
             * 初始化插件
             */
            ImageUpload.prototype.initPlug = function() {
                var self = this;
                // 重新计算数量
                var tplText = '<div class="dz-preview dz-file-preview">\
                                        <div class="dz-error-message">\
                                            <span data-dz-errormessage=""></span>\
                                        </div>\
                                        <div class="dz-image">\
                                            <img data-dz-thumbnail="" />\
                                        </div>\
                                        <div class="dz-details">\
                                            <div class="dz-size">\
                                                <span data-dz-size=""></span>\
                                            </div>\
                                            <div class="dz-filename">\
                                                <span data-dz-name=""></span>\
                                            </div>\
                                        </div>\
                                        <div class="dz-progress">\
                                            <span class="dz-upload" data-dz-uploadprogress=""></span>\
                                        </div>\
                                        <div class="dz-success-mark">\
                                            <span class="fa-stack fa-lg bigger-300">\
                                                <i class="fa fa-circle fa-stack-2x white"></i>\
                                                <i class="fa fa-check fa-stack-1x fa-inverse green"></i>\
                                            </span>\
                                        </div>\
                                        <div class="dz-error-mark">\
                                            <span class="fa-stack fa-lg bigger-300">\
                                                <i class="fa fa-circle fa-stack-2x white"></i>\
                                                <i class="fa fa-remove fa-stack-1x fa-inverse red"></i>\
                                            </span>\
                                        </div>\
                                    </div>'
                var self = this;
                Dropzone.autoDiscover = false;
                var target = $(self.container).find('.dropzone').get(0);
                var myDropzone = new Dropzone(target, {
                    previewTemplate: tplText,
                    paramName: 'file',
                    url: self.url,
                    thumbnailHeight: 120,
                    thumbnailWidth: 120,
                    maxFilesize: 20,
                    dictCancelUploadConfirmation: "是否确定取消上传？",
                    addRemoveLinks: true,
                    acceptedFiles: 'image/*',
                    dictRemoveFile: '删除',
                    // 提示文件类型错误
                    dictInvalidFileType: '类型错误，只接受图片',
                    // 指定文件数目超出提示
                    dictMaxFilesExceeded: '文件数量超出',
                    // 指定文件大小提示
                    dictFileTooBig: '文件超出大小',
                    // 指定服务器错误的提示
                    dictResponseError: '图片上传失败',
                    // 指定取消上传提示
                    dictCancelUpload: '取消',
                    dictDefaultMessage: '<i class="upload-icon ace-icon fa fa-cloud-upload blue fa-3x"></i>',

                    thumbnail: function(file, dataUrl) {
                        if (file.previewElement) {
                            $(file.previewElement).removeClass("dz-file-preview");
                            var images = $(file.previewElement).find("[data-dz-thumbnail]").each(function() {
                                var thumbnailElement = this;
                                thumbnailElement.alt = file.name;
                                thumbnailElement.src = dataUrl;
                            });
                            setTimeout(function() {
                                $(file.previewElement).addClass("dz-image-preview");
                            }, 1);
                        }
                    }
                });

                // 将value 复制到隐藏域
                var value = self.value.join(';');
                self.$input.find('[type=hidden]').val(value);

                // 将已经存在的图片载入
                if (self.urls) {
                    $.each(self.urls, function(index, ele) {
                        var file = {
                            name: ele,
                            size: 12345,
                            accepted: true,
                            status: "success",
                            type: "image/png",
                            id: self.value[index]
                        };
                        var imageUrl = ele;

                        //  文件预览
                        myDropzone.emit("addedfile", file);
                        myDropzone.emit("thumbnail", file, imageUrl);
                        myDropzone.createThumbnailFromUrl(file, imageUrl);
                        myDropzone.emit("complete", file);

                        self.fileNumberNow++;
                        // myDropzone.options.addedfile.call(myDropzone, file);
                        // myDropzone.options.thumbnail.call(myDropzone, file, imageUrl);
                        // myDropzone.emit("complete", file);
                    });
                }
                // 事件监听


                myDropzone.on('addedfile', function(file) {
                    self.container.trigger('imageupload.start');
                    self.$input.find('.dz-default').css({
                        display: 'none'
                    });
                });
                myDropzone.on("complete", function(file) {

                    self.container.trigger('imageupload.completed');

                    console.log(file);
                    // 判断文件数量是否超过
                    if (self.fileNumberNow >= self.fileNumber) {
                        self.fileNumberNow++;
                        myDropzone.removeFile(file);
                        Utils.alert('图片上传数量已经达到上限，最多添加'+self.fileNumber+'张图片');
                        return;
                    }


                    self.fileNumberNow++;

                    setTimeout(function() {
                        if(!/image\//.test(file.type)){
                            myDropzone.removeFile(file);
                            Utils.alert('请上传正确的图片格式');
                            return;
                        }
                        if ((self.widthLimit !== -1)) {
                            if ((file.width !== self.widthLimit)) {
                                myDropzone.removeFile(file);
                                Utils.alert('请上传规定尺寸的图片');
                                return;
                            }
                        }
                        if ((self.heightLimit !== -1)) {
                            if ((file.height !== self.heightLimit)) {
                                myDropzone.removeFile(file);
                                Utils.alert('请上传规定尺寸的图片');
                                return;
                            }
                        }
                        if(file.size > 1024*1024*1){
                            myDropzone.removeFile(file);
                            Utils.alert('上传图片大小不能超过1M');
                            return;
                        }
                    }, 100);
                });
                // 删除图片
                myDropzone.on('removedfile', function(file) {
                    // 将图片从列表中删除
                    removeFile(file.id);
                    self.fileNumberNow--;
                    if (self.fileNumberNow === 0) {
                        self.$input.find('.dz-default').css({
                            display: 'block'
                        });
                    }

                });
                // 上传成功后将返回的文件名添加到
                myDropzone.on('success', function(file, response) {
                    file.id = response.data[0];
                    addFile(file.id);
                    // 移除校验效果
                    var $errorTip = $('#' + self.name + '-error');
                    $errorTip.closest('.has-error').removeClass('has-error');
                    $errorTip.remove();
                });
                // 删除文件
                function removeFile(fileid) {
                    $.each(self.value, function(index, ele) {
                        if (ele === fileid) {
                            self.value.splice(index, 1);
                        }
                    });
                    // 更新 input value
                    var value = self.value.join(';');
                    self.$input.find('[type=hidden]').val(value);
                }
                // 添加文件
                function addFile(fileid) {
                    self.value.push(fileid);
                    // 更新 input value
                    var value = self.value.join(';');
                    self.$input.find('[type=hidden]').val(value);
                }



                //simulating upload progress
                var minSteps = 6,
                    maxSteps = 60,
                    timeBetweenSteps = 100,
                    bytesPerStep = 100000;

                // 图片上传模拟
                // myDropzone.uploadFiles = function(files) {
                //     var self = this;

                //     for (var i = 0; i < files.length; i++) {
                //         var file = files[i];
                //         totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

                //         for (var step = 0; step < totalSteps; step++) {
                //             var duration = timeBetweenSteps * (step + 1);
                //             setTimeout(function(file, totalSteps, step) {
                //                 return function() {
                //                     file.upload = {
                //                         progress: 100 * (step + 1) / totalSteps,
                //                         total: file.size,
                //                         bytesSent: (step + 1) * file.size / totalSteps
                //                     };

                //                     self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
                //                     if (file.upload.progress == 100) {
                //                         file.status = Dropzone.SUCCESS;
                //                         // 模拟返回值
                //                         var response = {
                //                             status:0,
                //                             data:{
                //                                 id:1111111,
                //                                 url:'/asdf/sfd/sdf'
                //                             },
                //                             message:'jfisdjid'
                //                         };
                //                         self.emit("success", file, response, null);
                //                         self.emit("complete", file);
                //                         self.processQueue();
                //                     }
                //                 };
                //             }(file, totalSteps, step), duration);
                //         }
                //     }
                // }


                //remove dropzone instance when leaving this page in ajax mode
                // $(document).one('ajaxloadstart.page', function(e) {
                //     try {
                //         myDropzone.destroy();
                //     } catch (e) {}
                // });

                // 判断是否为只读
                if (self.disabled) {
                    $(self.container)
                        .css({
                            'pointer-events': 'none'
                        });
                    $(self.container)
                        .find('*').css({
                            'pointer-events': 'none'
                        });
                    $(self.container)
                        .find('.dz-remove').remove();
                }
            };
        })();
        // 人员级联下拉框
        (function() {
            var DepSelector = Yinput.DepSelector = function() {

            }

            DepSelector.prototype.defaultOptions = {
                // 容器
                container: 'body',
                // 输入项的 name
                name: '',
                // 输入项的别名
                alias: '',
                // 输入框宽度
                length: 4,
                // label 的长度
                labelLength: 3,
                // 省的接口
                departmentUrl: '',
                // 市的接口
                personUrl: '',
            };

            DepSelector.prototype.init = function(options) {
                $.extend(this, this.defaultOptions, options);

                this.initConfig();

                this.initFrame();

                this.initEvent();
            };

            DepSelector.prototype.initConfig = function() {
                var self = this;
                // 获取容器
                var $container = $(self.container);
                // 获取 name
                var name = $container.attr('name');
                if (!!name) {
                    self.name = name;
                }
                // 获取 alias
                var alias = $container.data('alias');
                if (!!alias) {
                    self.alias = alias;
                }
                // 获取 value
                var value = $container.attr('value');
                if (!!value) {
                    self.value = value;
                }
                // 获取 placeholder
                var placeholder = $container.data('placeholder');
                if (!!placeholder) {
                    self.placeholder = placeholder;
                }
                // 获取部门的id
                var valueProvince = $container.data('value-department');
                if (!!valueProvince) {
                    self.valueProvince = valueProvince;
                }
                // 获取人员的id
                var valueCity = $container.data('value-person');
                if (!!valueCity) {
                    self.valueCity = valueCity;
                }
            }

            DepSelector.prototype.initFrame = function() {

                var self = this;

                var point = '';
                if (!!self.name) {
                    point = '.';
                }

                // 限制表单的最大宽度
                if (self.length > 9) {
                    self.length = 9;
                }
                // 行内表单的结构 不带后缀
                var htmlStrOfInline = '<div class="form-group yinput-area-selector">\
                                            <label class="control-label">' + self.alias + '</label>\
                                            &nbsp;&nbsp;\
                                            <select class="form-control shen-selector" name="' + self.name + point + 'department">\
                                                <option value="" selected>选择部门</option>\
                                            </select>\
                                            &nbsp;&nbsp;\
                                            <select class="form-control shi-selector"  name="' + self.name + point + 'person">\
                                                <option value="" selected>选择人员</option>\
                                            </select>\
                                        </div>';

                // 水平表单的结构不带后缀
                var htmlStrOfHorizontal = '<div class="form-group yinput-area-selector">\
                                        <label class="col-xs-' + self.labelLength + ' control-label no-padding-right">' + self.alias + '</label>\
                                        <div class="col-xs-' + self.length + '">\
                                            <div class="row">\
                                                <div class="col-xs-4">\
                                                    <select class="form-control shen-selector"  name="' + self.name + point + 'department">\
                                                        <option value="" selected>选择部门</option>\
                                                    </select>\
                                                </div>\
                                                <div class="col-xs-4">\
                                                    <select class="form-control shi-selector"  name="' + self.name + point + 'person">\
                                                        <option value="" selected>选择人员</option>\
                                                    </select>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>';


                var htmlStr;
                var $input;
                // 判断表单为内联表单，或者水平表单
                if ($(self.container).closest('form').hasClass('form-horizontal')) {
                    $input = $(htmlStrOfHorizontal);
                } else {
                    $input = $(htmlStrOfInline);
                    $input.css({
                        marginBottom: '20px'
                    })
                }

                self.$input = $input;

                $(self.container).replaceWith($input);

                // 更新省下拉跨的数据
                self.updateShen(self.valueProvince);
                self.updateShi(self.valueProvince, self.valueCity);
                // self.updateQu(self.valueCity, self.valueArea);

                // 判断是否为 readonly
                if (self.readonly) {
                    $input.find('select').css({
                        pointerEvents: 'none',
                        background: '#f5f5f5'
                    }).parent().css({
                        cursor: 'not-allowed',
                    })
                }
            };

            DepSelector.prototype.initEvent = function() {
                var self = this;
                // 省下拉跨选中后更新市下拉框 // 清空区下拉框
                self.$input.find('.shen-selector').on('change', function() {
                    var id = $(this).val();
                    // 更新市下拉框
                    self.updateShi(id);
                    self.$input.find('.shi-selector')
                        .val(-1);
                    // 清空区下拉框
                    self.$input.find('.qu-selector')
                        .html('<option value="" selected>选择人员</option>')
                        .val(-1);
                });
            };

            /**
             * 更新省下拉框的选项
             * @param {String} id  省的 id
             * @return {[type]} [description]
             */
            DepSelector.prototype.updateShen = function(id) {
                var self = this;
                // 获取数据填充下拉列表
                utils.requireTmpl('widgets/yinput/selector', function(tpl) {
                    var optionData;
                    // 获取数据源信息
                    var url = self.departmentUrl;

                    if (!url) {
                        return false;
                    }
                    // 参数
                    var params = {}
                    utils.getData(url, params, function(response) {
                        if (response.status !== 0) {
                            console.log('获取选择框数据失败');
                            return;
                        }

                        // 选线数据
                        optionData = response.data;
                        // 添加默认选项
                        var defaultOption = {
                            value: '',
                            alias: '选择部门'
                        }
                        self.addDefaultOption(optionData, defaultOption);
                        // 渲染模板
                        utils.render({
                                tmpl: tpl,
                                data: optionData,
                                context: self.$input.find('.shen-selector'),
                                overwrite: true
                            })
                            // 添加值
                        if (!!id) {
                            self.$input.find('.shen-selector').val(id);
                        }

                    });
                });
            }

            /**
             * 更新市下拉框的选项
             * @param {Number} parentId  省的id
             * @param {Number} id        市 id
             * @return {[type]} [description]
             */
            DepSelector.prototype.updateShi = function(parentId, id) {
                if (!parentId) return;
                var self = this;
                utils.requireTmpl('widgets/yinput/selector', function(tpl) {
                    var optionData;
                    // 获取数据源信息
                    var url = self.personUrl;

                    if (!url) {
                        return false;
                    }
                    // 参数
                    var params = {
                        id: parentId
                    }
                    utils.getData(url, params, function(response) {
                        if (response.status !== 0) {
                            console.log('获取选择框数据失败');
                            return;
                        }

                        // 选线数据
                        optionData = response.data;
                        // 添加默认选项
                        var defaultOption = {
                            value: '',
                            alias: '选择人员'
                        }
                        self.addDefaultOption(optionData, defaultOption);
                        // 渲染模板
                        utils.render({
                                tmpl: tpl,
                                data: optionData,
                                context: self.$input.find('.shi-selector'),
                                overwrite: true
                            })
                            // 添加值
                        if (!!id) {
                            self.$input.find('.shi-selector').val(id);
                        }

                    });
                });
            }

            /**
             * 添加默认选项
             * @param {Array} options       所有选项
             * @param {Object} defaultOption  默认选项
             */
            DepSelector.prototype.addDefaultOption = function(options, defaultOption) {
                // 是否存储在
                var isExistInOptions = false;
                // 判断默认选项是否在选项中，如果不在选项中，则添加
                $.each(options, function(index, option) {
                    if (defaultOption.value === option.value) {
                        isExistInOptions = true;
                        option.selected = 'selected';
                    } else {
                        option.selected = '';
                    }
                });
                // 如果默认选线不存在在 options 中，则添加
                if (!isExistInOptions) {
                    defaultOption.selected = 'selected';
                    options.unshift(defaultOption);
                }
            }
        })();
        // 通用级联下拉框
        (function() {
            var CascadeSelector = Yinput.CascadeSelector = function() {

            }

            CascadeSelector.prototype.defaultOptions = {
                // 容器
                container: 'body',
                // 输入项的 name
                name: '',
                // 输入项的别名
                alias: '',
                // label 的长度
                labelLength: 3,
                // 每个输入框的配置
                selectors: [],
                // 每次请求都会带上的参数
                params: {}
            };

            CascadeSelector.prototype.setParams = function(params) {
                var self = this;
                $.extend(self.params, params);
            }

            CascadeSelector.prototype.init = function(options) {
                var self = this;

                $.extend(this, this.defaultOptions, options);

                this.initConfig();

                this.initFrame(function() {

                    self.initEvent();
                    self.initData();
                });
            };

            CascadeSelector.prototype.initConfig = function() {
                var self = this;
                // 获取容器
                var $container = $(self.container);
                // 获取 name
                var name = $container.attr('name');
                if (!!name) {
                    self.name = name;
                }
                // 获取 alias
                var alias = $container.data('alias');
                if (!!alias) {
                    self.alias = alias;
                }
                // 获取 value
                var value = $container.attr('value');
                if (!!value) {
                    self.value = value;
                }
                // 获取 placeholder
                var placeholder = $container.data('placeholder');
                if (!!placeholder) {
                    self.placeholder = placeholder;
                }

            }

            CascadeSelector.prototype.initFrame = function(cb) {

                var self = this;

                var point = '';
                if (!!self.name) {
                    point = '.';
                }

                // 限制表单的最大宽度
                if (self.length > 9) {
                    self.length = 9;
                }
                // 行内表单的结构 不带后缀
                var htmlStrOfInline = '<div class="form-group yinput-area-selector">\
                                            <label class="control-label">' + self.alias + '</label>\
                                            &nbsp;&nbsp;\
                                            <div class="hook"></div>\
                                        </div>';

                // 水平表单的结构不带后缀
                var htmlStrOfHorizontal = '<div class="form-group yinput-area-selector">\
                                        <label class="col-xs-' + self.labelLength + ' control-label no-padding-right">' + self.alias + '</label>\
                                        <div class="col-xs-' + (12 - self.labelLength) + '">\
                                            <div class="row">\
                                                <div class="hook"></div>\
                                            </div>\
                                        </div>\
                                    </div>';


                var htmlStr;
                var $input;
                var tplurl = '';
                // 判断表单为内联表单，或者水平表单
                if ($(self.container).closest('form').hasClass('form-horizontal')) {
                    $input = $(htmlStrOfHorizontal);
                    tplurl = 'widgets/yinput/cascade-selecor-h';
                } else {
                    $input = $(htmlStrOfInline);
                    tplurl = 'widgets/yinput/cascade-selecor-i';
                    $input.css({
                        marginBottom: '20px'
                    })
                }

                self.$input = $input;

                $(self.container).replaceWith($input);

                // 渲染 select 模板

                utils.requireTmpl(tplurl, function(tpl) {
                    var $selectors = $(tpl(self.selectors));
                    $input.find('.hook').replaceWith($selectors);
                    if (typeof cb === 'function') {
                        // 判断是否为 readonly
                        if (self.readonly) {
                            $input.find('select').css({
                                pointerEvents: 'none',
                                background: '#f5f5f5'
                            }).parent().css({
                                cursor: 'not-allowed',
                            })
                        }
                        cb();
                    }
                });

            };

            CascadeSelector.prototype.initEvent = function() {
                var self = this;
                self.$input.find('.selector').each(function(index, ele) {
                    var options;

                    if (index === 0) {
                        // 如果为第一个 select
                        var selectorOptions = self.selectors[index + 1];
                        options = {
                            url: selectorOptions.url,
                            $selector: self.$input.find('.selector').eq(index + 1),
                            defaultOption: selectorOptions.defaultOption
                        };
                        $(ele).on('change', function() {
                            options.parentId = $(this).val();
                            self.updateSelector(options);
                        });
                    } else if ((index + 1) === self.selectors.length) {
                        // 如果为最后一个 select
                        options = null;

                    } else {
                        // 其他
                        var selectorOptions = self.selectors[index + 1];
                        options = {
                            url: selectorOptions.url,
                            $selector: self.$input.find('.selector').eq(index + 1),
                            defaultOption: selectorOptions.defaultOption
                        };
                        $(ele).on('change', function() {
                            options.parentId = $(this).val();
                            self.updateSelector(options);
                        });
                    }
                    $(ele).on('change', function() {
                        // 触发选中事件
                        var onselected = self.selectors[index].onselected;
                        if (typeof onselected === 'function') {
                            onselected($(this).val());
                        }
                    });
                });
            };
            CascadeSelector.prototype.initData = function() {
                var self = this;
                self.$input.find('.selector').each(function(index, ele) {
                    var options;

                    if (index === 0) {
                        // 如果为第一个 select
                        var selectorOptions = self.selectors[index];
                        options = {
                            url: selectorOptions.url,
                            $selector: self.$input.find('.selector').eq(index),
                            defaultOption: selectorOptions.defaultOption,
                            value: selectorOptions.value
                        };
                        self.updateSelector(options);

                    } else {
                        // 其他
                        var selectorOptions = self.selectors[index];
                        options = {
                            url: selectorOptions.url,
                            $selector: self.$input.find('.selector').eq(index),
                            defaultOption: selectorOptions.defaultOption,
                            value: selectorOptions.value,
                            parentId: self.selectors[index - 1].value
                        };
                        self.updateSelector(options);
                    }
                });
            };
            /**
             * 更新下拉框
             * @param  {Object} options.url             接口 url
             * @param  {String} options.parentId        级联父级的 id
             * @param  {String} options.$selector       下拉框元素
             * @param  {String} options.defaultOption   默认选项
             * @param  {String} options.value           值
             */
            CascadeSelector.prototype.updateSelector = function(options) {
                // 完成这个方法
                var defaultOptions = {
                    url: '',
                    parentId: '',
                    $selector: null,
                    defaultOption: null,
                    value: ''
                };
                options = $.extend({}, defaultOptions, options);
                // 校验参数
                if (!options.url) {
                    console.log('请指定下拉框的 url');
                    return;
                }
                if (!options.$selector) {
                    console.log('请指定下拉框元素');
                    return;
                }
                var self = this;
                // 获取数据填充下拉列表
                utils.requireTmpl('widgets/yinput/selector', function(tpl) {
                    var optionData;
                    // 获取数据源信息
                    var url = options.url;

                    // 参数
                    var params = {}
                    if (!!options.parentId) {
                        params.id = options.parentId;
                    }
                    params = $.extend(params, self.params);
                    utils.getData(url, params, function(response) {
                        if (response.status !== 0) {
                            console.log('获取选择框数据失败');
                            return;
                        }

                        // 选线数据
                        optionData = response.data;
                        if (!!options.defaultOption) {
                            self.addDefaultOption(optionData, options.defaultOption);
                        }
                        // 渲染模板
                        utils.render({
                                tmpl: tpl,
                                data: optionData,
                                context: options.$selector,
                                overwrite: true
                            })
                            // 添加值
                        if (!!options.value) {
                            options.$selector.val(options.value);
                        }
                        options.$selector.trigger('yinputCascadeSelector.rendered', response);
                    });
                });
            }

            /**
             * 添加默认选项
             * @param {Array} options       所有选项
             * @param {Object} defaultOption  默认选项
             */
            CascadeSelector.prototype.addDefaultOption = function(options, defaultOption) {
                // 是否存储在
                var isExistInOptions = false;
                // 判断默认选项是否在选项中，如果不在选项中，则添加
                $.each(options, function(index, option) {
                    if (defaultOption.value === option.value) {
                        isExistInOptions = true;
                        option.selected = 'selected';
                    } else {
                        option.selected = '';
                    }
                });
                // 如果默认选线不存在在 options 中，则添加
                if (!isExistInOptions) {
                    defaultOption.selected = 'selected';
                    options.unshift(defaultOption);
                }
            }
        })();
        window.yinput = {
            initText: function(options) {
                var text = new Yinput.Text();
                text.init(options);
                return text;
            },
            initSelector: function(options) {
                var selector = new Yinput.Selector();
                selector.init(options);
                return selector;
            },
            initDatePicker: function(options) {
                var datePicker = new Yinput.DatePicker();
                datePicker.init(options);
                return datePicker;
            },
            initDateRange: function(options) {
                var dateRange = new Yinput.DateRange();
                dateRange.init(options);
                return dateRange;
            },
            initImageUpload: function(options) {
                var imageUpload = new Yinput.ImageUpload();
                imageUpload.init(options);
                return imageUpload;
            },
            initAreaSelector: function(options) {
                var areaSelector = new Yinput.AreaSelector();
                areaSelector.init(options);
                return areaSelector;
            },
            initDepSelector: function(options) {
                var areaSelector = new Yinput.DepSelector();
                areaSelector.init(options);
                return areaSelector;
            },
            initCascadeSelector: function(options) {
                var areaSelector = new Yinput.CascadeSelector();
                areaSelector.init(options);
                return areaSelector;
            },
            initTextarea: function(options) {
                var textarea = new Yinput.Textarea();
                textarea.init(options);
                return textarea;
            }
        }
    })(Utils);
    // 初始化表格组件 中文
    (function() {
        $.fn.datepicker.dates['zh-cn'] = {
            days: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            daysShort: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            daysMin: ["日", "一", "二", "三", "四", "五", "六"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            today: "今天",
            clear: "清除",
            format: "mm/dd/yyyy",
            titleFormat: "MM yyyy",
            /* Leverages same syntax as 'format' */
            weekStart: 0
        };
    })();
});
