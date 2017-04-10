
/*
 * @module progress
 * created by ky
*/
(function(){
	function Progress(){};
	Progress.prototype.configuration = {
		//	容器
		container: '',
		//	宽度
		width:300,
		//	高度
		height:4,
		//	进度条背景色
		bg: '#ccc',
		//	拖曳块大小
		towageSize: 16,
		//	拖曳块背景色
		towageBg: '#177AD8',
		// 	限制拖曳块拖动百分比(小数)
		limit: 0.95
	};
	Progress.prototype.init = function(options){
		var self = this;
		$.extend(true,this,self.configuration,options);
		self.initState();
		self.drag();
	};
	Progress.prototype.initState = function(){
		var self = this;
		self.$_container = $(self.container);
		var _str = '<div class = "xxprogress">\
						<p class="progress-line"></p>\
						<p class = "progress-line-active"></p>\
						<span class="progress-towage"></span>\
						<span class = "xx-percent">0%</span>\
					</div>';
		var _html = $(_str);
		self.$_container.replaceWith(_html);
		self.$container = _html;
		self.$line = self.$container.find('.progress-line');
		self.$lineActive = self.$container.find('.progress-line-active');
		self.$towage = self.$container.find('.progress-towage');
		self.$percent = self.$container.find('.xx-percent');
		//	设置样式
		var towageTop = 0.5*(self.towageSize - self.height);
		self.$container.css({'height':self.height});
		self.$line.css({'background':self.bg,'height':self.height + 'px','width':self.width + 'px'});
		self.$lineActive.css({'background':self.towageBg,'height':self.height})
		self.$towage.css({'background':self.towageBg,'width':self.towageSize + 'px','height': self.towageSize + 'px',left:-(0.5*self.towageSize) + 'px','boxShadow':'0 0 5px ' + self.towageBg,'top':-towageTop + 'px'});
		self.$percent.css({'top':-(towageTop+3) + 'px'});
	};
	Progress.prototype.drag = function(){
		var self = this;
		var _X,
			_Y,
			_record = 0;
			isDrag = false;
		self.$towage.on('mousedown',function(ev){
			var event = ev || window.event;
			isDrag = true;
			_X = event.clientX,
			_Y = event.clientY;
			//console.log(_X,_Y,_record)
		})
		$('body').on('mousemove',function(ev){
			if(!isDrag) return;
			var event = ev || window.event;
			var _x = event.clientX,
				_y = event.clientY,
				distance = _x - _X;

			var half = 1/2 * self.towageSize,
				left = _record + distance;
			var _max = self.limit*self.width ? self.limit*self.width : self.width;
			var _left = left >= _max - half ? _max - half : left <= -half ? -half : left;

			self.$towage.css({'left':_left + 'px'});
			self.$lineActive.css({'width':(_left + half + 2) + 'px'});
			//	计算百分比
			var _percent = Math.round(((_left + half) / self.width)*100);
			self.$percent.text(_percent + '%');
			self.percent = _percent;
		})
		$('body').on('mouseup',function(ev){
			var event = ev || window.event;
			isDrag = false;
			_record = parseInt(self.$towage.css('left'));
		})
	};
	window.progress = {
		init: function(options){
			var progress = new Progress();
			progress.init(options);
			return progress;
		}
	}
})()