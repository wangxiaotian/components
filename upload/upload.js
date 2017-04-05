/*
 * @module 文件上传
 * @author ky.
 */

(function() {
    var Upload = function() {};
    Upload.prototype.configuration = {

        container: '',
        //	是否多文件上传
        multiple: true,
        //	上传大小限制(暂以M为单位)
        maxSize: 1,
        //	上传按钮(仅上传文件，不和其他数据一起提交)
        uploadBtn: '',
        //  表单提交(包括其它的数据)
        formBtn: '',
        //	name值
        name: '',
        //	上传地址
        url: '',
        //	上传成功回调
        success: function(){

        },
        //	失败回调
        error: function(){

        }
    };
    Upload.prototype.init = function(options) {
        var self = this;
        $.extend(true, this, self.configuration, options);
        self.initStatus();
        self.initFrame();
        self.submit_upload();

    };
    Upload.prototype.initStatus = function() {
        var self = this;
        self.$container = $(self.container);
        self.$uploadBtn = $(self.uploadBtn);

    };
    Upload.prototype.initFrame = function() {
        var self = this;
        var str = '<div class="upload">\
	                    <div class="file-list">\
	                    </div>\
	                    <div class="btns">\
	                        <div class="file-picker">\
	                            <div class="pick btn btn-info">选择图片</div>\
	                            <div class="file-input">\
	                                <input type="file">\
	                            </div>\
	                        </div>\
	                        <div class="pick-upload btn btn-default">上传图片</div>\
	                    </div>\
	               </div>';
        var html = $(str);
        self.$input = html.find('input');
        self.$fileList = html.find('.file-list');
        self.$container.replaceWith(html);
        self.trigger();
    };
    Upload.prototype.trigger = function() {
        var self = this;
        self.cache = [];
        self.$input.on('change', function() {
            var _file = this.files[0];
            if (!_file) return;
            self.cache.push(_file);
            self.getFile = self.cache;
            var _name = _file.name,
                _size = _file.size;
            if (self.maxSize) {
                if (_size > parseInt(self.maxSize) * 1024 * 1024) {
                    alert('文件大小超出限制，请上传' + self.maxSize + 'M以内的文件')
                }
            }
            var _postfix = _name.split('.').pop(),
                _imgPostfix = ['png','jpg','gif','bmp','tiff','svg'],
                _type;
            if (_imgPostfix.indexOf(_postfix) > -1) {
                _type = 'img'
            } else {
                _type = 'other'
            }
            var url = self.setSrc(_file);
            self.addList(_type, _name, url);
        })
    };
    /*
     * 添加上传文件
     */
    Upload.prototype.addList = function(type, name, url) {
        var self = this;
        var _item = type === 'img' ? '<img src = "' + url + '" class = "list-item">' : '<span class = "item"></span>';
        var str = '<div class="list">\
                    	<div class="img-info">\
                    		<span class="img-name">4sd04.png</span>\
                    		<span class="img-delete hide"><i>X</i></span>\
                    		<span class="complete"></span>\
                    	</div>' + _item + '\
                    </div>';
        var _html = $(str);
        var _name = _html.find('.img-name'),
            _delete = _html.find('.img-delete');
        _name.text(name);
        self.$fileList.append(_html);
        self.handle(_html, _delete);
    };
    //	设置地址
    Upload.prototype.setSrc = function(file) {
        var self = this;
        var url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file)
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file)
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file)
        }
        return url;
    };
    //	事件处理
    Upload.prototype.handle = function(el, _delete) {
        var self = this;
        el.on('mouseover', function() {
            _delete.removeClass('hide');
        })
        el.on('mouseout', function() {
            _delete.addClass('hide');
        })
        var _deleteEl = _delete.find('i');
        _deleteEl.on('click', function() {
            var _list = $(this).parents('.list');
            self._index = _list.index();
            self.cache.splice(self._index, 1);
            _list.remove();
            self.getFile = self.cache;
        })
    };
    //	只是文件上传
    Upload.prototype.submit_upload = function() {
        var self = this;
        if (!self.$uploadBtn) return;
        self.$uploadBtn.on('click', function() {
            var _files = self.cache,
                fd = new FormData();
            fd.append(self.name,_files);
            /*var _toString = Object.prototype.toString;
            if(_toString.call(self.data) !== '[object Object]') return;
            //  将上传文件数据添加到已有表单数据
            self.data[self.name] = _files;*/
            $.ajax({
                url: self.url,
                type: 'GET',
                cache: false,
                data: fd,
                processData: false,
                contentType: false,
                success: function(res){
                	self.success.apply(this,arguments)
                },
                error: function(res){
                	self.error.apply(this,arguments)
                }
            })
        })
    }
    window.xxupload = {
        init: function(options) {
            var upload = new Upload();
            upload.init(options);
            return upload;
        }
    }
})()
