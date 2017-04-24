require('babel-polyfill');

function a() {
    return b => b + 1;
}
var fn = (v => console.log(v));

window.promise = function(url, data, error) {
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
