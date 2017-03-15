/*
 * @module xxpopup
 * @example 
 * 			xxpopup.init({
    				container: '#myModal-alert',
    				title: '警告',
    				body: '确定要继续吗？',
    				btnCallback: function(){
    					alert('危险操作')
    				},
    				type: 'alert',
    				btnText: '我确认'
    			})

 * @author ky
*/

/*
	<div class="modal fade" id="myModal-alert" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title" id="myModalLabel">
                    模态框（Modal）标题
                </h4>
                    </div>
                    <div class="modal-body">
                        在这里添加一些文本
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">关闭
                        </button>
                        <button type="button" class="btn btn-success">
                            提交更改
                        </button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal -->
        </div>


*/


;(function(){
	var XXpopup = function(){};
	XXpopup.prototype.configuration = {
		title: '提示',
		body: 'body goes here',
		//	弹窗类型：dialog/confirm/alert
		type: 'dialog',
		//	默认确定
		btnText: '确定',		
		btnCallback: function(){
			console.log('回调处理');
		},
		//	此项无需配置
		container: '#myModal-alert'
	};
	XXpopup.prototype.init = function(options){
		var self = this;
		$.extend(true,this,self.configuration,options);
		self.initStatus();
		self.showModal();
	};
	XXpopup.prototype.initStatus = function(){
		var self = this;
		self.$container = $(self.container);
		self.$header = self.$container.find('.modal-header');
		self.$body = self.$container.find('.modal-body');
		self.$footer = self.$container.find('.modal-footer');

		self.updateText();
		self.bind(self.btnCallback);
	};
	XXpopup.prototype.updateText = function(){
		var self = this;
		//	判断类型
		var type = self.type;
		var dialog = type.toLowerCase() === 'dialog',
			confirm = type.toLowerCase() === 'confirm',
			_alert = type.toLowerCase() === 'alert';
		if(dialog){
			self.$footer.find('button').eq(0).show();
			self.$footer.find('button').eq(1).removeClass().addClass('btn btn-success').text(self.btnText);
		}
		if(confirm){
			self.$footer.find('button').eq(0).show();
			self.$footer.find('button').eq(1).removeClass().addClass('btn btn-warning').text(self.btnText);
		}
		if(_alert){
			self.$footer.find('button').eq(0).hide();
			self.$footer.find('button').eq(1).removeClass().addClass('btn btn-danger').text(self.btnText);
		}
		self.$header.find('h4').text(self.title);
		self.$body.text(self.body);
	};
	XXpopup.prototype.bind = function(cb){
		var self = this;
		var _btn = self.$footer.find('button'),
			_length = _btn.length,
			$btn;
		if(_length <= 0) return;
		if(_length == 1){
			$btn = _btn;
		}
		if(_length == 2){
			$btn = _btn.eq(1);
		}
		$btn.one('click',function(){
			console.log('触发回调');
			cb.apply(this,arguments);
			//	关闭弹窗
			self.$container.modal('hide');
		})
	};
	XXpopup.prototype.showModal = function(){
		var self = this;
		self.$container.modal('show');
	};

	window.xxpopup = {
		init: function(options){
			var xxpopup = new XXpopup();
			xxpopup.init(options);
			return xxpopup;
		}
	}
})()


