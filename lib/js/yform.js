/**
 * 
 * 表单控件
 * @module  yform
 * @author xjc
 */
jQuery(function($) {
    (function(Utils) {
        var Yform = function() {

        };
        // 此插件的核心部分还是验证
        /**
         * 用户默认选项
         * @type {Object}
         */
        Yform.prototype.defaultOptions = {
            // 指定表单元素
            container: 'form',
            // 表单提交的 url
            action: '',
            // 表单的校验
            validate: {},
            // 表单提交按钮
            submitButton: '',
            // 是否直接提交
            direct: false,
            // 表单提交成功后调用
            success: function() {},
            // 挑担提交失败的时候调用
            error: function() { Utils.alert("操作失败，请稍后再试或联系管理员"); },
            //异常
            exception: function() {},
            // 是否点击回车提交
            submitByEnter: false,
            // 提交前是否确认 ,配置确认的文案，如果确认文案为 '' 则不进行确认
            confirm: '',
            // 错误提示信息的位置 inline / horizontal
            errorPlacement: 'inline'
        };

        /**
         * 初始化控件
         * @return {[type]} [description]
         */
        Yform.prototype.init = function(options) {
            var self = this;

            $.extend(this, this.defaultOptions, options);

            self.initValidation();

            self.initPlug();
            self.initSubmitBtn();
        };
        /**
         * 初始化控件
         * @return {[type]} [description]
         */
        Yform.prototype.initPlug = function() {
            var self = this;
            // 表单验证规则
            // validate.rules是校验规则，validate.messages是提示信息
            var rules = self.validate.rules || {};
            var messages = self.validate.messages || {};
            // 表单验证提示信息
            // 这个validate方法可能是jQuery的一个插件，验证规则是通过写入input里面的
            // name属性来实现的
            self.validateHandle = $(self.container).validate({
                // 用什么标签包含错误dom，默认是label
                errorElement: 'div',
                // 指定错误提示的css类名，可以自定义错误提示的样式，默认是error
                errorClass: 'help-block',
                // 提交表单后，未通过验证的表单会获得焦点，默认为true
                focusInvalid: false,
                // ignore忽略某些元素不验证
                ignore: "",
                rules: rules,
                messages: messages,
                // 可以给未通过验证的元素加效果、闪烁等
                highlight: function(e) {
                    if($(e).closest('.form-group').hasClass('cascade')){
                        $(e).parent().removeClass('has-info').addClass('has-error');    
                        return;
                    }
                    $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
                },
                // 每个字段验证通过后的执行函数
                success: function(e) {
                    if($(e).closest('.form-group').hasClass('cascade')){
                        $(e).parent().removeClass('has-error');    
                        return;
                    }
                    $(e).closest('.form-group').removeClass('has-error'); //.addClass('has-info');
                    $(e).remove();
                },
                // 更改错误信息现实的位置，两个参数error参数表示错误信息的dom，
                // element参数是输入框的那个dom对象，一般添加在其父元素后面
                errorPlacement: function(error, element) {
                    if(self.errorPlacement === 'inline'){
                        if (element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
                            var controls = element.closest('div[class*="col-"]');
                            if (controls.find(':checkbox,:radio').length > 1) controls.append(error);
                            else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
                        } else if (element.is('.select2')) {
                            error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
                        } else if (element.is('.chosen-select')) {
                            error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
                        } else if (element.parent().parent().next().hasClass('text-center')) {
                            // 日期范围选择，前一个日期不显示错误信息
                            // do nothing
                        } else if (element.parent().hasClass('input-group')) {
                            error.insertAfter(element.parent().parent());
                        } else if (element.parent().parent().hasClass('cascade')) {
                            error.insertAfter(element);
                        } else error.insertAfter(element.parent());
                    }else{
                        if (element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
                            var controls = element.closest('div[class*="col-"]');
                            if (controls.find(':checkbox,:radio').length > 1) controls.append(error);
                            else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
                        } else if (element.is('.select2')) {
                            error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
                        } else if (element.is('.chosen-select')) {
                            error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
                        } else if (element.parent().parent().hasClass('cascade')) {
                            error.insertAfter(element);
                        } else if (element.parent().hasClass('input-group')) {
                            error.insertAfter(element.parent());
                        } else error.insertAfter(element);
                    }
                }
            });
        };

        /**
         * 重置表单
         */
        Yform.prototype.resetValidate = function() {
            var self = this;
            // resetForm方法是插件里面的方法，这里的重置是作为回调函数来调用的
            self.validateHandle.resetForm();
            $(self.container).find('.has-error').removeClass('has-error');
        };
        /**
         * 初始化事件
         * @return {[type]} [description]
         */
        // 这个才是重要的功能，之前的校验都是在运用jQuery的插件
        Yform.prototype.initSubmitBtn = function() {
            var self = this;
            var disabled = false;
            // 正在上传图片的数量
            var imgUploadingCount = 0;
            $(self.submitButton).on('click', function() {

                if (disabled || imgUploadingCount > 0) {
                    return;
                }
                // 校验
                // valid()插件方法，检查是否通过，返回值是布尔值
                var validated = $(self.container).valid();
                if (!validated) {
                    return;
                }
                if (self.confirm !== '') {
                    Utils.confirm(self.confirm, function() {
                        // 锁定提交按钮
                        $(self.submitButton).addClass('disabled');
                        disabled = true;


                        // 判断是否是直接提交，如果是直接提交则直接提交
                        // 这里配置为false
                        if (self.direct) {
                            $(self.container).submit();
                            return;
                        }
                        // 提交表单
                        // 提交表单之前进行一步处理
                        // 未找到beforeSubmit
                        if (typeof self.beforeSubmit === 'function') {
                            if (self.beforeSubmit(function() {
                                    self.submit(function() {
                                        // 解除锁定
                                        $(self.submitButton).removeClass('disabled');
                                        disabled = false;
                                    })
                                })) {
                                self.submit(function() {
                                    // 解除锁定
                                    $(self.submitButton).removeClass('disabled');
                                    disabled = false;
                                })
                            } else {
                                $(self.submitButton).removeClass('disabled');
                                disabled = false;
                            }
                        } else {
                            self.submit(function() {
                                // 解除锁定
                                $(self.submitButton).removeClass('disabled');
                                disabled = false;
                            })
                        }
                    });
                    return;
                }



                // 锁定提交按钮
                $(self.submitButton).addClass('disabled');
                disabled = true;


                // 判断是否是直接提交，如果是直接提交则直接提交
                if (self.direct) {
                    $(self.container).submit();
                    return;
                }
                // 提交表单
                // 提交表单之前进行一步处理
                if (typeof self.beforeSubmit === 'function') {
                    if (self.beforeSubmit(function() {
                            self.submit(function() {
                                // 解除锁定
                                $(self.submitButton).removeClass('disabled');
                                disabled = false;
                            })
                        })) {
                        self.submit(function() {
                            // 解除锁定
                            $(self.submitButton).removeClass('disabled');
                            disabled = false;
                        })
                    } else {
                        $(self.submitButton).removeClass('disabled');
                        disabled = false;
                    }
                } else {
                    self.submit(function() {
                        // 解除锁定
                        $(self.submitButton).removeClass('disabled');
                        disabled = false;
                    })
                }
            })

            // 点击回车提交
            // 获取表单中最后一个 input
            // var $lastInput = $(self.container).find('input').last();
            // 绑定回车事件
            if (self.submitByEnter) {
                $(self.container).on('keyup', function(event) {
                    if (event.keyCode === 13) {
                        $(self.submitButton).click();
                    }
                })
            }

            // 在图片上传的时候禁止点击提交
            $(self.container)
                .on('imageupload.start', '.form-group', function(){
                    imgUploadingCount++;
                    $(self.submitButton).addClass('disabled');
                })
                .on('imageupload.completed', '.form-group', function(){
                    imgUploadingCount--;
                    if(imgUploadingCount < 1){
                        $(self.submitButton).removeClass('disabled');
                    }
                });

        };
        /**
         * 提交表单
         */
        Yform.prototype.submit = function(cb) {
            var self = this;
            // 重置表单验证
            self.resetValidate();
            // 全部 trim  格式化
            $(self.container).find('input[type=text]').each(function() {
                $(this).val($.trim($(this).val()));
            });
            // 获取表单内容
            var formContent = $(self.container).serialize();
            // 发送异步请求
            Utils.postData(self.action, formContent, function(response) {
                // 处理异常结果，给出提示信息
                if (response.status === 0) {
                    // 处理请求结果
                    if (typeof self.success === 'function') {
                        self.success(response);
                    }
                } else {
                    self.exception(response);
                    Utils.alert(response.message);
                }
                // 提交结束的时候调用
                if (typeof cb === 'function') {
                    cb();
                }
            }, function(response) {
                // 处理错误结果
                if (typeof self.error === 'function') {
                    self.error(response);
                }
                // 提交结束的时候调用
                if (typeof cb === 'function') {
                    cb();
                }
            })
        };
        /**
         * 提交表单
         */
        // 这个和submit是一样的
        Yform.prototype.submitAndJump = function(cb) {
            var self = this;
            // 重置表单验证
            self.resetValidate();
            // 全部 trim
            $(self.container).find('input[type=text]').each(function() {
                $(this).val($.trim($(this).val()));
            });
            // 获取表单内容
            var formContent = $(self.container).serialize();
            // 发送异步请求
            Utils.postData(self.action, formContent, function(response) {
                // 处理异常结果，给出提示信息
                if (response.status === 0) {
                    // 处理请求结果
                    if (typeof self.success === 'function') {
                        self.success(response);
                    }
                } else {
                    Utils.alert(response.message);
                }
                // 提交结束的时候调用
                if (typeof cb === 'function') {
                    cb();
                }
            }, function(response) {
                // 处理错误结果
                if (typeof self.error === 'function') {
                    self.error(response);
                }
                // 提交结束的时候调用
                if (typeof cb === 'function') {
                    cb();
                }
            })
        };
        /**
         * 获取表格的数据
         *     获取的序列化数据
         * @return {String} 表格的序列化数据
         */
        // 哪里来的表格数据啊？
        Yform.prototype.getData = function() {
                var self = this;
                return $(self.container).serialize();
            }
            /**
             * 校验表单，并且返回结果
             * @return {[type]} [description]
             */
        Yform.prototype.valid = function() {
            var self = this;
            return $(self.container).valid();
        }

        /**
         * 显示错误信息
         * @param  {String} name          需要显示错误信息的域
         * @param  {String} errorMessage 需要显示的错误信息
         */
        Yform.prototype.showError = function(name, errorMessage) {
            var self = this;
            var errorOjb = {};
            errorOjb[name] = errorMessage;
            self.validateHandle.showErrors(errorOjb);
        }

        Yform.prototype.initValidation = function() {
            // 添加校验
            // 添加自定义校验，，addMethod:name,method,message
            jQuery.validator.addMethod("money", function(value, element) {
                if (value == "" || value == null) {
                    return true;
                }
                if (!/^\d*\.?\d{0,2}$/.test(value)) {
                    return false;
                }
                return true;
            }, "请填写正确的金额");
            jQuery.validator.addMethod("cellphone", function(value, element) {
                if (value == "" || value == null) {
                    return true;
                }
                if (!/^1+\d{10}$/.test(value)) {
                    return false;
                }
                return true;
            }, "请填写正确的电话号码");
            jQuery.validator.addMethod("idcode", function(value, element) {
                if (value == "" || value == null) {
                    return true;
                }
                var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (reg.test(value) === false) {
                    return false;
                }
                return true;
            }, "请填写正确的身份证号码");
            jQuery.validator.addMethod("notspecial", function(value, element) {
                    if (value == "" || value == null) {
                        return true;
                    }
                    var containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
                    return !(containSpecial.test(value));
                },
                "不允许出现特殊字符");
            jQuery.validator.addMethod("platenumber", function(value, element) {
                    if (value == "" || value == null) {
                        return true;
                    }
                    var platenumber = RegExp(/^[\u4e00-\u9fa5]{1}[A-Z]{1}[0-9a-zA-Z]{5}$/);
                    return (platenumber.test(value));
                },
                "请填写正确的车牌");
            jQuery.validator.addMethod("phone", function(value, element) {
                    if (value == "" || value == null) {
                        return true;
                    }
                    var phone = RegExp(/^([0-9]{3,4}-)?[0-9]{7,9}$/);
                    return (phone.test(value));
                },
                "请填写正确的座机号码");
            jQuery.validator.addMethod("nocn", function(value, element) {
                var nocn = RegExp(/^([0-9a-zA-Z]|-)*$/);
                return (nocn.test(value));
            }, "只能输入数字和字母");
            jQuery.validator.addMethod("phoneTelephone", function(value, element) {
                    var nocn = RegExp(/(^1+\d{10}$)|(^(\d{3,4}-)?\d{7,8})$/);
                    if (value == "" || value == null) {
                        return true;
                    }
                    if (!nocn.test(value)) {
                        return false;
                    }
                    return true;
                },
                "请输入正确的手机号码或电话号码");
            jQuery.validator.addMethod("twoSmallNumber", function(value, element) {
                    if (value == "" || value == null) {
                        return true;
                    }
                    var twoSmallNumber = RegExp(/^\d+(\.\d{2})?$/);
                    return (twoSmallNumber.test(value));
                },
                "请保留两位小数");

            jQuery.validator.addMethod("oneSmallNumber", function(value, element) {
                    if (value == "" || value == null) {
                        return true;
                    }
                    var oneSmallNumber = RegExp(/^\d+(\.\d{1})?$/);
                    return (oneSmallNumber.test(value));
                },
                "请保留一位小数");
        }

        jQuery.validator.addMethod("isIntGtZero", function(value, element) {
            if (value == "" || value == null) {
                return true;
            }
            value = parseFloat(value);
            return this.optional(element) || value > 0;
        }, "请输入>0的数");
        window.yform = {
            create: function(options) {
                var yform = new Yform();
                yform.init(options);
                return yform;
            }
        }
    })(Utils);
});