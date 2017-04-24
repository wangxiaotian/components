
/*
 *  @module 前端工具库
 *  @author ky
 */
require('babel-polyfill')

(function() {
    window.Utils = {};
    /*
     * 通用数据请求get
     */
    Utils.getData = function(url, data, callback, error) {
        var encodeUrl = encodeURI(url);
        //  传入的data是对象，序列化之并编码
        if (typeof data === 'object') {
            data = $.param(data);
        }
        data = encodeURI(data);
        $.ajax({
            type: 'GET',
            data: data,
            url: encodeUrl,
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function(rep) {
                if (!rep) {
                    console.log('空值');
                    return;
                }
                try {
                    $.isPlainObject(rep)
                } catch (e) {
                    console.log('数据解析错误');
                    if (typeof error === 'function') {
                        error.apply(this, arguments);
                    } else {
                        alert('数据解析错误')
                    }
                }
                callback.apply(this, arguments)
            },
            error: function(rep) {
                if (typeof error === 'function') {
                    error.apply(this, arguments)
                } else {
                    alert('请求失败，请稍后再试或联系管理员');
                }
            }
        })
    };
    /*
     * promise
     */
     function a (){
        return b => b+1;
     }
     var fn= (v=>console.log(v));

    Utils.promise = function(url, data, error) {
        var encodeUrl = encodeURI(url);
        //  传入的data是对象，序列化之并编码
        if (typeof data === 'object') {
            data = $.param(data);
        }
        data = encodeURI(data);
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'GET',
                data: data,
                url: encodeUrl,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                success: function(rep) {
                    if (!rep) {
                        console.log('空值');
                        return;
                    }
                    try {
                        $.isPlainObject(rep)
                    } catch (e) {
                        console.log('数据解析错误');
                        if (typeof error === 'function') {
                            error.apply(this, arguments);
                        } else {
                            alert('数据解析错误')
                        }
                    }
                    resolve(rep)
                },
                error: function(rep) {
                    if (typeof error === 'function') {
                        error.apply(this, arguments)
                    } else {
                        alert('请求失败，请稍后再试或联系管理员');
                    }

                }
            })
        })

    };
    /*
     * 通用数据请求post
     */
    Utils.postData = function(url, data, callback, error) {
        var encodeUrl = encodeURI(url);
        //  传入的data是对象，序列化之并编码
        /*            if (typeof data === 'object') {
                        data = $.param(data);
                    }
                    data = encodeURI(data);*/
        $.post({
            type: 'POST',
            data: data,
            url: encodeUrl,
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function(rep) {
                if (!rep) {
                    console.log('空值');
                    return;
                }
                try {
                    $.isPlainObject(rep)
                } catch (e) {
                    console.log('数据解析错误');
                    if (typeof error === 'function') {
                        error.apply(this, arguments);
                    } else {
                        alert('数据解析错误')
                    }
                }
                callback.apply(this, arguments)
            },
            error: function(rep) {
                if (typeof error === 'function') {
                    error.apply(this, arguments)
                } else {
                    alert('请求失败，请稍后再试或联系管理员');
                }
            }
        })
    };
    /*
     * 获取模板
     */
    Utils.requireTpl = function(tpl, cb) {
        var url = 'tpl/' + tpl + '.html';
        $.ajax({
            type: 'GET',
            url: url,
            data: '',
            dataType: 'text',
            success: function(rep) {
                console.log('已取得模板');
                return cb(doT.template(rep));
            }
        })
    };
    /*
     * 模板渲染
     */
    Utils.render = function(cfg, replace) {
            var _data = cfg.data,
                _tplStr = cfg.tpl,
                _container = cfg.container,
                _tpl;
            _container.empty();
            _tpl = _tplStr(_data);
            Utils.appendHtml(_tpl, _container, replace);
        }
        /*
         * 添加文档节点
         */
    Utils.appendHtml = function(str, container, replace) {
            if (replace) {
                container.replaceWith(str);
                return;
            }
            container.append(str);
        }
        /*
         * 获取浏览器查询参数
         */
    Utils.getQueryString = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
        /*
         * 获取input输入值
         */
    Utils.getInput = function(container, index) {
        var val = $(container).find('input').eq(index).val();
        return val;
    };
    /*
     * 数组判断
     */
    Utils.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        /*
         * 将序列化字符串转化为对象
         */
    Utils.paramsString2obj = function(serializedParams) {
        var obj = {};

        function evalThem(str) {
            var strAry = new Array();
            strAry = str.split("=");
            //使用decodeURIComponent解析uri 组件编码
            for (var i = 0; i < strAry.length; i++) {
                strAry[i] = decodeURIComponent(strAry[i]);
            }
            var attributeName = strAry[0];
            var attributeValue = strAry[1].trim();
            //如果值中包含"="符号，需要合并值
            if (strAry.length > 2) {
                for (var i = 2; i < strAry.length; i++) {
                    attributeValue += "=" + strAry[i].trim();
                }
            }
            if (!attributeValue) {
                return;
            }

            var attriNames = attributeName.split("."),
                curObj = obj;
            for (var i = 0; i < (attriNames.length - 1); i++) {
                curObj[attriNames[i]] ? "" : (curObj[attriNames[i]] = {});
                curObj = curObj[attriNames[i]];
            }

            //使用赋值方式obj[attributeName] = attributeValue.trim();替换
            //eval("obj."+attributeName+"=\""+attributeValue.trim()+"\";");
            //解决值attributeValue中包含单引号、双引号时无法处理的问题
            //这里可能存在一个种情况：多个checkbox同一个name的时候需要使用","来分割 
            /*curObj[attriNames[i]] = curObj[attriNames[i]] ?
                (curObj[attriNames[i]] + "," + attributeValue.trim()) :
                attributeValue.trim();*/

            if (curObj[attriNames[i]]) {
                if (Utils.isArray(curObj[attriNames[i]])) {
                    curObj[attriNames[i]].push(attributeValue.trim())
                } else {
                    curObj[attriNames[i]] = curObj[attriNames[i]].split(',');
                    curObj[attriNames[i]].push(attributeValue.trim());
                }
            } else {
                curObj[attriNames[i]] = attributeValue.trim();
            }
        };

        var properties = serializedParams.split("&");
        for (var i = 0; i < properties.length; i++) {
            //处理每一个键值对
            evalThem(properties[i]);
        };
        return obj;
    };
})()
