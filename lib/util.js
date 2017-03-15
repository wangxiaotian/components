/*
 *	@module 前端工具库
 *	@author ky
 */

;
(function() {
    window.Utils = {};
    /*
     * 通用数据请求
     */
    Utils.getData = function(url, data, callback, error) {
        var encodeUrl = encodeURI(url);
        //	传入的data是对象，序列化之并编码
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
    }

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
        }
        /*
         * 模板渲染
         */
    Utils.render = function(cfg) {
            var _data = cfg.data,
                _tplStr = cfg.tpl,
                _container = cfg.container,
                _tpl;
            _container.empty();
            _tpl = _tplStr(_data);
            Utils.appendHtml(_tpl, _container);
        }
        /*
         * 添加文档节点
         */
    Utils.appendHtml = function(str, container) {
        container.append(str);
    }
})()
