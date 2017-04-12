/*
 * @module progress
 * created by ky
 */
(function() {
    function Progress() {};
    Progress.prototype.configuration = {
        //	容器
        container: '',
        //	宽度
        width: 300,
        //	高度
        height: 4,
        //	进度条背景色
        bg: '#ccc',
        //	拖曳块大小
        towageSize: 16,
        //	拖曳块背景色
        towageBg: '#177AD8',
        // 	限制拖曳块拖动百分比(小数)
        limit: '',
        //	设置初始百分比(小数)
        defaultValue: ''
    };
    Progress.prototype.init = function(options) {
        var self = this;
        $.extend(true, this, self.configuration, options);
        self.initState();
        self.drag();
        self.setValue();
    };
    Progress.prototype.initState = function() {
        var self = this;
        self.$container = $(self.container);
        var _str = '<div class = "xxprogress">\
						<p class="progress-line"></p>\
						<p class = "progress-line-active"></p>\
						<span class="progress-towage"></span>\
						<input class = "xx-percent" />\
					</div>';
        var _html = $(_str);
        self.$container.append(_html);
        self.$line = self.$container.find('.progress-line');
        self.$lineActive = self.$container.find('.progress-line-active');
        self.$towage = self.$container.find('.progress-towage');
        self.$percent = self.$container.find('.xx-percent');
        //	设置初始值
        var raw = self.toDecimalAndPercent(self.defaultValue);
        if(!$.isEmptyObject(raw)){
            var initialValue = raw.decimal*self.width;
            var percent = raw.percent;
        }
        initialValue = initialValue || 0;
        percent = percent || 0;
        self.$percent.val(percent);
        //	设置样式
        var towageTop = 0.5 * (self.towageSize - self.height);
        self.$container.css({ 'height': self.height });
        self.$line.css({ 'background': self.bg, 'height': self.height + 'px', 'width': self.width + 'px' });
        self.$lineActive.css({ 'background': self.towageBg, 'height': self.height ,'width': -(0.5 * self.towageSize) + initialValue + 'px'})
        self.$towage.css({ 'background': self.towageBg, 'width': self.towageSize + 'px', 'height': self.towageSize + 'px', left: -(0.5 * self.towageSize) + initialValue + 'px', 'boxShadow': '0 0 5px ' + self.towageBg, 'top': -towageTop + 'px' });
        self.$percent.css({ 'top': -(towageTop + 3) + 'px' });
    };
    Progress.prototype.drag = function() {
        var self = this;
        var _X,
            _Y,
            _record = 0;
        self.isDrag = false;
        self.$towage.on('mousedown', function(ev) {
            var event = ev || window.event;
            self.isDrag = true;
            _X = event.clientX,
                _Y = event.clientY;
            //console.log(_X,_Y,_record)
            _record = parseInt(self.$towage.css('left'));
        })
        $('body').on('mousemove', function(ev) {
            if (!self.isDrag) return;
            var event = ev || window.event;
            var _x = event.clientX,
                _y = event.clientY,
                distance = _x - _X;

            var half = 1 / 2 * self.towageSize,
                left = _record + distance;

            var _max = self.limit * self.width ? self.limit * self.width : self.width;
            var _left = left >= _max - half ? _max - half : left <= -half ? -half : left;

            self.$towage.css({ 'left': _left + 'px' });
            self.$lineActive.css({ 'width': (_left + half + 2) + 'px' });
            //	计算百分比
            var _percent = Math.round(((_left + half) / self.width) * 100);
            self.$percent.val(_percent + '%');
            self.percent = _percent;
        })
        $('body').on('mouseup', function(ev) {
            var event = ev || window.event;
            self.isDrag = false;
        })
    };
    Progress.prototype.update = function(percent, actualWidth) {
        var self = this;
        self.$towage.css({ 'left': -(0.5 * self.towageSize) + actualWidth + 'px' });
        self.$lineActive.css({'width':-(0.5 * self.towageSize) + actualWidth + 'px'})
        self.$percent.val(percent);
    };
    Progress.prototype.setValue = function() {
        var self = this;
        var reg = /%$/;
        self.$percent.on('input', function() {
            var previous = $(this).val();
            var raw = self.toDecimalAndPercent(previous);
            self.decimal = raw.decimal;
            if(self.decimal >= self.limit){
                self.decimal = self.limit;
            }
            self.percent = self.decimal*100 + '%';
            self.actualWidth = self.decimal*self.width;
        })
        self.$percent.keydown(function(event) {
            if (event.keyCode === 13) {
                self.update(self.percent, self.actualWidth)
            }
        })
    };
    Progress.prototype.toDecimalAndPercent = function(previous) {
        var self = this;
        var reg = /%$/,
        	precent;
        if (reg.test(previous)) {
            percent = previous;
            previous = previous.replace('%', '') / 100;
            if (isNaN(previous)) previous = 0;
            previous = previous > 1 ? 1 : previous < 0 ? 0 : previous;
        } else {
            if(!previous || isNaN(previous)){
                previous = 0
            }
            previous = previous > 1 ? 1 : previous < 0 ? 0 : previous;
            percent = previous * 100 + '%';
        }
        return {
        	decimal: previous,
        	percent: percent
        }
    }
    window.progress = {
        init: function(options) {
            var progress = new Progress();
            progress.init(options);
            return progress;
        }
    }
})()
