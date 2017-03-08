/**
 * 前端工具类
 * @module utils
 * @author xjc
 */ 
(function() {
    window.Utils = {};
    var decode = decodeURIComponent;
    /**
     * @func getData
     * @desc 异步获取数据
     * @param {string} url 异步请求的地址
     * @param {object} data 请求的参数
     * @param {function} callback 回调函数
     * @returns {boolean}
     * @example
     * Common.getData("/test",“{}”,function(data){})
     */
    Utils.getData = function(url, data, callback, error) {
        var encodeUrl = encodeURI(url);
        // 如果data 是对象 则序列化之
        if (typeof data === 'object') {
            data = $.param(data);
        }
        // 对 data 在进行一次编码
        data = encodeURI(data);
        $.ajax({
            type: "GET",
            data: data,
            url: encodeUrl,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function(rep) {
                if (!rep) {
                    return;
                }
                try {
                    // 这里的函数是检测是否是纯碎对象，返回值为布尔值
                    $.isPlainObject(rep);
                } catch (e) {
                    console.log("数据解析错误!");
                    if (typeof error === 'function') {
                        error.apply(this, arguments);
                    } else {
                        Utils.alert("数据解析错误");
                    }
                    return;
                }
                // 代理，当 status 为 2 的时候，跳转到登录页面，所有异步请求都如此
                if (rep.status === 2 || rep.status === 3) {
                    Utils.alert(rep.message, function() {
                        window.location = '/login';
                    });
                    return;
                }
                callback.apply(this, arguments);
            },
            error: function(rep) {
                if (typeof error === 'function') {
                    error.apply(this, arguments);
                } else {
                    Utils.alert("操作失败，请稍后再试或联系管理员");
                }
            }
        });
    };
    /**
     * @desc 异步获取数据
     * @param {string} url 异步请求的地址
     * @param {object} data 请求的参数
     * @param {function} callback 回调函数
     * @returns {boolean}
     * @example
     * Common.posttData("/test",“{}”,function(data){})
     */
    Utils.postData = function(url, data, callback, error) {
        /**
         * 手动调用 ajax 请求，加上 token 验证
         * 手动发送的时候必须传入 data 为对象
         */
        if ((typeof data === 'object') && !data.csrfToken) {
            data.csrfToken = $("[name=csrfToken]").val();
        }

        var encodeUrl = encodeURI(url);
        $.ajax({
            type: "POST",
            data: data,
            url: encodeUrl,
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function(rep) {
                if (!rep) {
                    return;
                }
                try {
                    $.isPlainObject(rep);
                } catch (e) {
                    console.log("数据解析错误!");
                    if (typeof error === 'function') {
                        // 这行代码不是很懂
                        error.apply(this, arguments);
                    } else {
                        Utils.alert("数据解析错误");
                    }
                    return;
                }
                // 代理，当 status 为 2 的时候，跳转到登录页面，所有异步请求都如此
                if (rep.status === 2 || rep.status === 3) {
                    Utils.alert(rep.message, function() {
                        window.location = '/login';
                    });
                    return;
                }
                callback.apply(this, arguments);
            },
            error: function(rep) {
                if (typeof error === 'function') {
                    error.apply(this, arguments);
                } else {
                    Utils.alert("操作失败，请稍后再试或联系管理员");
                }
            }
        });
    };
    /**
     * @func requireTmpl
     * @desc 获取模板
     * @param {string} tmpl 模板名称
     * @param {function} cb 回调函数
     * @example 
     *  Utils.requireTmpl('test',function(tmpl){
     *       Common.render({
     *           context:'#testtpml',
     *           data:{name:"xjc"},
     *           tmpl:tmpl
     *       }) 
     *   }) 
     */
    Utils.requireTmpl = function(tmpl, cb) {
        var url = '/templates/' + tmpl + '.html';
        $.ajax({
            type: "GET",
            url: url,
            dataType: "text",
            /*这里的rep即是请求成功时服务器端返回的数据，即是一个dot模板*/
            success: function(rep) {
                /*这里应该是写成doT.template(rep)(data)的，但是这里没有写上数据，
                可能是因为作用域的问题吧!*/
                return cb && cb(doT.template(rep));
                /*这里回调函数有参数，因为有这样的需求，所以在调用的时候要带上形参的*/
            }
        });
    }

    /**
     * @func render
     * @desc 页面渲染
     * @param {object} cfg
     * @param {object} cfg.tmpl dotjs的模板对象
     * @param {object} cfg.data 渲染模板所需要数据
     * @param {string} cfg.context 渲染的模板将被插入的容器选择器
     * @param {function} cfg.callback 渲染完成的回调方法
     * @param {boolean} [cfg.overwrite] 是否清空容器原有内容 默认不清空
     * @example
     * Common.render(cfg);
     */
    Utils.render = function(cfg) {
        var self = this,
            _data = cfg.data,  // 此处为表格渲染所需的数据
            dom = '',           
            context = cfg.context,  // 此处为DOM对象即容器，盛放table结构
            callback = cfg.callback, // 这里的callback不很理解，因为没有定义这个回调，也没有用到这个回调
            _tmpl;
        // 定义_tmpl
        if (typeof cfg.tmpl === 'function') { // 此处的cfg.tmpl是tpl,是其外层函数触发回调从后台拿的数据，本来应该是个dom模板，但是如果从调试器里查看的化，它是一个函数
            _tmpl = cfg.tmpl;
        } else {
            _tmpl = doT.template($(cfg.tmpl).html());  // 此处的代码表明cfg.tmpl是一个DOM节点，可以取其html（）的，更加疑惑
        }                                              // 此处一直在定义_tmpl。没有重新定义tmpl,即tmpl还是原来的值
        // 设置$(context)节点为空                      // 这里不知道有什么用
        if (cfg.overwrite) {
            $(context).empty();
        }
        // 设置dom                                    
        if (_tmpl) {
            /*trim函数移除字符串开始和结尾处的所有换行符，空格和制表符，返回值是经过处理的字符串*/
            dom = self.renderHtml($.trim(_tmpl(_data)), context);   // 这里的renderHtml的返回值是一个操作，
        } else {                                                    // 怎么能赋给一个变量呢？难道它真的是有返回值
            console.log("对应的模块不存在!");
        }
        // 根据情况执行callback方式
        callback && callback.call(this, {
            data: _data,
            dom: dom
        });

    };

    /**
     * 设置本地数据
     * @param {String} key    数据名
     * @param {Object} value  数据值
     */
    Utils.setLocalData = function(key, value) {
        // 将数据值序列化
        var valueSer = JSON.stringify(value);
        // 将序列化的值存入本地
        localStorage.setItem(key, valueSer);
    };
    /**
     * 获取本地数据
     * @param  {String} key  数据名
     */
    Utils.getLocalData = function(key) {
        // 获取本地的值
        var valueSer = localStorage.getItem(key);
        // 判断是否存在
        if (!valueSer) {
            return null;
        }
        // 转化为 json 对象
        return JSON.parse(valueSer);
    };

    /**
     * 设置本地数据
     * @param {String} key    数据名
     * @param {Object} value  数据值
     */
    Utils.setSessionData = function(key, value) {
        // 将数据值序列化
        var valueSer = JSON.stringify(value);
        // 将序列化的值存入本地
        sessionStorage.setItem(key, valueSer);
    };
    /**
     * 获取本地数据
     * @param  {String} key  数据名
     */
    Utils.getSessionData = function(key) {
        // 获取本地的值
        var valueSer = sessionStorage.getItem(key);
        // 判断是否存在
        if (!valueSer) {
            return null;
        }
        // 转化为 json 对象
        return JSON.parse(valueSer);
    };

    /**
     * 将表单序列化字符串转化为 json 对象
     * @param  {[type]} params [description]
     * @param  {[type]} coerce [description]
     * @return {[type]}        [description]
     */
    Utils.deparam = function(params, coerce) {
        var obj = {},
            coerce_types = { 'true': !0, 'false': !1, 'null': null };

        // Iterate over all name=value pairs.
        $.each(params.replace(/\+/g, ' ').split('&'), function(j, v) {
            var param = v.split('='),
                key = decode(param[0]),
                val,
                cur = obj,
                i = 0,

                // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
                // into its component parts.
                keys = key.split(']['),
                keys_last = keys.length - 1;

            // If the first keys part contains [ and the last ends with ], then []
            // are correctly balanced.
            if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
                // Remove the trailing ] from the last keys part.
                keys[keys_last] = keys[keys_last].replace(/\]$/, '');

                // Split first keys part into two parts on the [ and add them back onto
                // the beginning of the keys array.
                keys = keys.shift().split('[').concat(keys);

                keys_last = keys.length - 1;
            } else {
                // Basic 'foo' style key.
                keys_last = 0;
            }

            // Are we dealing with a name=value pair, or just a name?
            if (param.length === 2) {
                val = decode(param[1]);

                // Coerce values.
                if (coerce) {
                    val = val && !isNaN(val) ? +val // number
                        : val === 'undefined' ? undefined // undefined
                        : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
                        : val; // string
                }

                if (keys_last) {
                    // Complex key, build deep object structure based on a few rules:
                    // * The 'cur' pointer starts at the object top-level.
                    // * [] = array push (n is set to array length), [n] = array if n is 
                    //   numeric, otherwise object.
                    // * If at the last keys part, set the value.
                    // * For each keys part, if the current level is undefined create an
                    //   object or array based on the type of the next keys part.
                    // * Move the 'cur' pointer to the next level.
                    // * Rinse & repeat.
                    for (; i <= keys_last; i++) {
                        key = keys[i] === '' ? cur.length : keys[i];
                        cur = cur[key] = i < keys_last ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val;
                    }

                } else {
                    // Simple key, even simpler rules, since only scalars and shallow
                    // arrays are allowed.

                    if ($.isArray(obj[key])) {
                        // val is already an array, so push on the next value.
                        obj[key].push(val);

                    } else if (obj[key] !== undefined) {
                        // val isn't an array, but since a second value has been specified,
                        // convert val into an array.
                        obj[key] = [obj[key], val];

                    } else {
                        // val is a scalar.
                        obj[key] = val;
                    }
                }

            } else if (key) {
                // No value was defined, so set something meaningful.
                obj[key] = coerce ? undefined : '';
            }
        });

        return obj;
    };
    /**
     * @func renderHtml
     * @desc 将tmpl插入到context里
     * @param {string} tmpl 模板生成的html字符串
     * @param {string} context 选择器
     */
    Utils.renderHtml = function(tmpl, context) {
        var contentEl = $(context);
        return $(tmpl).appendTo(contentEl);
    };
    /**
     * 提示信息
     * @param  {String} message 提示的信息
     */
    Utils.alert = function(message, doSure) {
        var alertHtml = '<div class="modal fade js-modal-alert" role="dialog">\
                            <div class="modal-dialog modal-sm" role="document">\
                                <div class="modal-content">\
                                    <!-- 模态窗头部，如果不需要可以删除 -->\
                                    <div class="modal-header">\
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                                        <!-- 标题-->\
                                        <h4 class="modal-title">提示</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <!-- 模态窗的内容 -->\
                                    </div>\
                                    <div class="modal-footer">\
                                        <!-- 确定按钮 -->\
                                        <button type="button" class="btn btn-primary js-ensure" data-dismiss="modal">确定</button>\
                                    </div>\
                                </div>\
                                <!-- /.modal-content -->\
                            </div>\
                            <!-- /.modal-dialog -->\
                        </div>';

        // 判断弹窗元素是否存在
        if ($('.js-modal-alert').length <= 0) {
            // 如果 dom 不存在
            // 添加 dom
            $('body').append($(alertHtml));

        }
        $('.js-modal-alert').unbind('hidden.bs.modal').on('hidden.bs.modal', function() {
            // 当点击事件的时候触发接下去要做的事情
            if (typeof doSure === 'function') {
                doSure();
            }
        });
        $('.js-modal-alert').find('.js-ensure').unbind('click').on('click', function() {
            // 当点击事件的时候触发接下去要做的事情
            if (typeof doSure === 'function') {
                doSure();
            }
        });
        // 给弹窗添加内容
        $('.js-modal-alert').find('.modal-body').text(message);
        // 弹出弹窗
        $('.js-modal-alert').modal();
        if (!!$('.close')) {
            $('.close').on('click', function() {
                $('.btn-fee').addClass('disabled')
            })
        }
    };
    /**
     * 确认弹出窗口
     * @param  {String} message  弹出窗信息
     * @param  {Function} doSure 确认之后执行的操作
     */
    Utils.confirm = function(message, doSure, doCancel) {
        var sured = false;
        var alertHtml = '<div class="modal fade js-modal-confirm" role="dialog">\
                            <div class="modal-dialog modal-sm" role="document">\
                                <div class="modal-content">\
                                    <!-- 模态窗头部，如果不需要可以删除 -->\
                                    <div class="modal-header">\
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                                        <!-- 标题-->\
                                        <h4 class="modal-title">提示</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                        <!-- 模态窗的内容 -->\
                                    </div>\
                                    <div class="modal-footer">\
                                        <!-- 确认按钮 -->\
                                        <button type="button" class="btn btn-primary js-confirm-ensure" data-dismiss="modal">确定</button>\
                                        <!-- 取消按钮按钮 -->\
                                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                                    </div>\
                                </div>\
                                <!-- /.modal-content -->\
                            </div>\
                            <!-- /.modal-dialog -->\
                        </div>';
        // 判断弹窗元素是否存在
        if ($('.js-modal-confirm').length <= 0) {
            // 如果 dom 不存在
            // 添加 dom
            $('body').append($(alertHtml));
            // 添加事件
        }
        $('.js-modal-confirm').find('.js-confirm-ensure').unbind('click').on('click', function() {
            // 当点击事件的时候触发接下去要做的事情
            doSure();
            sured = true;
        });
        // unbind移除被选元素的事件处理程序
        $('.js-modal-confirm').unbind('hide.bs.modal').on('hide.bs.modal', function(){
            if(!sured){
                doCancel&&doCancel();
            }
        });
        // 给弹窗添加内容
        $('.js-modal-confirm').find('.modal-body').text(message);
        // 弹出弹窗
        $('.js-modal-confirm').modal();
    };

    /**
     * 对含有特殊字符的内容进行转码，防止跨站脚本攻击
     * @param  {String} text 有嫌疑的字符串
     * @return {[type]}         [description]
     */
    Utils.escape = function(text) {
        if (typeof text === "number") {
            return text;
        }
        text = doT.template("{{! it}}")(text);
        return text;
    }

    Utils.alertCompatibility = function() {
        var message = '您当前浏览器的版本过低，请使用IE10以上版本的 IE 浏览器，更推荐使用 chrome 浏览器。'
        Utils.alert(message);
    }

    Utils.preview = function(url, params) {
        var url = encodeURI(url);
        if (!params) {
            url = url;
            return;
        }
        params = $.param(params);
        url += '?' + params;

        /*
        var paramsArray=[];
        for(key in params){
            paramsArray.push(key+'='+params[key]);
        }
        url+='?'+paramsArray.join("&");
        */

        url = url;
        window.open(url, '', 'height=550,width=375,top=50,left=500,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
    }


    /**
     * 关闭页面之前给与提示
     */
    Utils.confirmBeforeLeave = function() {
        window.onbeforeunload = function(e) {
            var message = '确定要离开吗';
            e = e || window.event;

            if (e) {
                e.returnValue = message;
            }

            return message;
        };
    }

    Utils.formatMoney = function(value) {
        if(value === null) {
            return '0.00';
        }
        var value = value.toString();

        value = value.split('.');
        if (value[1]) {
            if (value[1].length !== 2) {
                value[1] = (value[1] + '00').substr(0, 2);
            }
        } else {
            value.push('00');
        }
        return value.join('.');
    }

    Utils.toast = function(content) {
        if ($('.js-toast').length <= 0) {
            $('body').append('<div class="modal fade js-toast">\
                  <div class="modal-dialog modal-sm">\
                    <div class="modal-content">\
                      <div class="modal-header">\
                        <h4 class="modal-title">Modal title</h4>\
                      </div>\
                    </div>\
                  </div>\
                </div>');
        }
        $('.js-toast').find('.modal-title').text(content);
        $('.js-toast').modal();
        setTimeout(function() {
            $('.js-toast').modal('hide');
        }, 1000);
    }

    Utils.selectorHasValue = function($select, value) {
        var result = false;
        $select.find('option').each(function() {
            if ($(this).val().toString() === value.toString()) {
                result = true;
            }
        })
        return result;
    };
})();
