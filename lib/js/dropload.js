/**
 * dropload
 * 西门(http://ons.me/526.html)
 * 0.9.0(160215)
 */
 
;(function($){
    'use strict';
    var win = window;
    var doc = document;
    var $win = $(win);
    var $doc = $(doc);
    $.fn.dropload = function(options){
        return new MyDropLoad(this, options);
    };
    // 定义初始构造函数(状态及属性) 次要
    var MyDropLoad = function(element, options){
        var me = this;
        me.$element = element;
        // 上方是否插入DOM
        me.upInsertDOM = false;
        // loading状态
        me.loading = false;
        // 是否锁定
        me.isLockUp = false;
        me.isLockDown = false;
        // 是否有数据
        me.isData = true;
        me._scrollTop = 0;
        me._threshold = 0;
        me.init(options);
    };

    // 初始化 
    MyDropLoad.prototype.init = function(options){
        var me = this;
        // 为什么要extend而不是直接作对象 次要(基建)
        me.opts = $.extend(true, {}, {
            // 滑动区域，及DOM元素
            scrollArea : me.$element,                                           // 滑动区域
            domUp : {                                                            // 上方DOM
                domClass   : 'dropload-up',
                domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
                domUpdate  : '<div class="dropload-update">↑释放更新</div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
            },
            domDown : {                                                          // 下方DOM
                domClass   : 'dropload-down',
                domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData  : '<div class="dropload-noData">暂无数据</div>'
            },
            // 布尔值属性控制程序运行的开关量
            autoLoad : true,                                                     // 自动加载
            distance : 50,                                                       // 拉动距离
            threshold : '',                                                      // 提前加载距离
            loadUpFn : '',                                                       // 上方function
            loadDownFn : ''                                                      // 下方function
        }, options);

        // 如果加载下方，事先在下方插入DOM   (基建)
        if(me.opts.loadDownFn != ''){
            me.$element.append('<div class="'+me.opts.domDown.domClass+'">'+me.opts.domDown.domRefresh+'</div>');
            // 获取插入DOM的元素
            me.$domDown = $('.'+me.opts.domDown.domClass);
        }

        // 计算提前加载距离     Q (不懂何用)
        if(!!me.$domDown && me.opts.threshold === ''){
            // 默认滑到加载区2/3处时加载      提前加载的距离为下方提示语的1/3高度或者为0
            me._threshold = Math.floor(me.$domDown.height()*1/3);
        }else{
            me._threshold = me.opts.threshold;
        }

        // 判断滚动区域       及window区域或者元素区域 (基建)
        if(me.opts.scrollArea == win){
            me.$scrollArea = $win;
            // 获取文档高度
            me._scrollContentHeight = $doc.height();
            // 获取win显示区高度  —— 这里有坑
            me._scrollWindowHeight = doc.documentElement.clientHeight;
        }else{
            me.$scrollArea = me.opts.scrollArea;
            me._scrollContentHeight = me.$element[0].scrollHeight;    // [0]的写法为此类型写法
            me._scrollWindowHeight = me.$element.height();
        }
        // (执行一)
        // 如果文档高度不大于窗口高度，数据较少，自动加载下方数据    (完点) ,这里实在函数里边自执行的，没有驱动
        fnAutoLoad(me);

        // 窗口调整               理解为窗口变化时实时更新显示区高度   (动态基建)
        $win.on('resize',function(){
            if(me.opts.scrollArea == win){
                // 重新获取win显示区高度
                me._scrollWindowHeight = win.innerHeight;
            }else{
                me._scrollWindowHeight = me.$element.height();
            }
        });

        // 绑定触摸         第二个函数有动作，传递坐标值                        // 此时还在init里边
        me.$element.on('touchstart',function(e){      // touchstart为原生滑动方法
            if(!me.loading){                          // loading初始化状态为false,在执行一里边改变了状态为true;
                fnTouches(e);                         // 获取手指列表，属于函数内基建
                fnTouchstart(e, me);                  // 此时还在init里边，me参数为初始化对象
            }
        });
        // move     确定了不同距离下页面应该给出的提示信息及其样式，在move里边还没有触发刷新函数
        me.$element.on('touchmove',function(e){
            if(!me.loading){
                fnTouches(e, me);
                fnTouchmove(e, me);
            }
        });
        // end      依据move里边取得的参数相应的执行动作，此为执行部分，但只有上啦刷新，没有下拉刷新
        me.$element.on('touchend',function(){
            if(!me.loading){                          // 没有用到手指列表
                fnTouchend(me);
            }
        });

        // 加载下方            (执行三)
        me.$scrollArea.on('scroll',function(){
            // 这个竟然使用scroll触发，当然有一个条件即是用滑到底部并且继续下拉时才会触发
            console.log('真的是用scroll');
            me._scrollTop = me.$scrollArea.scrollTop();
            // 滚动页面触发加载数据
            //    存在下拉函数        loading状态初始化配置false           me.$element[0].scrollHeight  下拉提示语DOM1/3的高度                   关键距离在这里，如果没有多加载，应该是相等的
            console.log(me.opts.loadDownFn != '' && !me.loading && !me.isLockDown && (me._scrollContentHeight - me._threshold) <= (me._scrollWindowHeight + me._scrollTop));
            console.log('锁定状态:' + !me.isLockDown);
            console.log('加载状态:' + !me.loading);
            if(me.opts.loadDownFn != '' && !me.loading && !me.isLockDown && (me._scrollContentHeight - me._threshold) <= (me._scrollWindowHeight + me._scrollTop)){
                console.log('here');
                loadDown(me);         //               锁定状态初始化配置false                                              me.$element.height()
            }
        });
    };

    // touches    只是获取了一个收支列表。没有实际动作，服务于fnTouchstart       (触摸基建)
    function fnTouches(e){                               //参数由触发滑动时的对象传入，此时是在init外边，单独定义函数
        if(!e.touches){
            e.touches = e.originalEvent.touches;         // touches为屏幕上所有手指的一个列表，是touches[0]的升级版
        }
    }

    // touchstart      记录坐标值。将坐标值及内容滚动的距离传给构建函数对象    (触摸基建)
    function fnTouchstart(e, me){                   
        me._startY = e.touches[0].pageY;                 // 刚触摸时的Y项坐标值
        // 记住触摸时的scrolltop值
        me.touchScrollTop = me.$scrollArea.scrollTop();  // 内容滚动的距离
    }

    // touchmove          (执行二)
    function fnTouchmove(e, me){
        me._curY = e.touches[0].pageY;                   // 当前位置的Y向坐标值
        me._moveY = me._curY - me._startY;               // 手指滑动距离

        if(me._moveY > 0){                               // 依据手指滑动距离的正负值判断向上滑动还是向下滑动，并将方向值传给对象
            me.direction = 'down';                       // 此处第一次定义方向，添加到构造函数对象
        }else if(me._moveY < 0){
            me.direction = 'up';
        }

        var _absMoveY = Math.abs(me._moveY);                   // 取滑动距离的绝对值

        // 加载上方      loadUpFn初始化配置为空，由用户端配置
        
        //   存在上啦函数            私以为0，不知何时小于0          方向            锁定状态初始化配置为false
        if(me.opts.loadUpFn != '' && me.touchScrollTop <= 0 && me.direction == 'down' && !me.isLockUp){
            e.preventDefault();
            // 加载上方提示DOM
            me.$domUp = $('.'+me.opts.domUp.domClass);        // 取得DOM
            // 如果加载区没有DOM
            if(!me.upInsertDOM){                              // upInsertDOM默认配置为false
                me.$element.prepend('<div class="'+me.opts.domUp.domClass+'"></div>');
                me.upInsertDOM = true;                        // 只让它加载一次
            }
            
            fnTransition(me.$domUp,0);                        // 样式函数(辅助)，结束了？？

            // 下拉        由拉动距离大小判断
            if(_absMoveY <= me.opts.distance){                // distance拉动距离，初始配置为50
                me._offsetY = _absMoveY;
                // todo：move时会不断清空、增加dom，有可能影响性能，下同
                me.$domUp.html(me.opts.domUp.domRefresh);     // 此处为拉动距离过小不足以触发刷新，故提示下拉刷新
            // 指定距离 < 下拉距离 , < 指定距离*2
            }else if(_absMoveY > me.opts.distance && _absMoveY <= me.opts.distance*2){
                me._offsetY = me.opts.distance+(_absMoveY-me.opts.distance)*0.5;
                me.$domUp.html(me.opts.domUp.domUpdate);      // 此时预期已经触发刷新，故提示释放更新
            // 下拉距离 > 指定距离*2
            }else{
                me._offsetY = me.opts.distance+me.opts.distance*0.5+(_absMoveY-me.opts.distance*2)*0.2;
            }

            me.$domUp.css({'height': me._offsetY});           // 一直在确定offsetY,原来是为了搞样式。结束了？？？(没看到执行刷新的函数，都在做提示信息的加载及其样式)
        }
    }

    // touchend         松开手指是触发
    function fnTouchend(me){
        var _absMoveY = Math.abs(me._moveY);                  // 手指滑动距离由move函数取得
        //   存在上啦函数            私以为0，不知何时小于0          方向            锁定状态初始化配置为false
        if(me.opts.loadUpFn != '' && me.touchScrollTop <= 0 && me.direction == 'down' && !me.isLockUp){
            fnTransition(me.$domUp,300);                      // 样式

            if(_absMoveY > me.opts.distance){
                me.$domUp.css({'height':me.$domUp.children().height()});
                me.$domUp.html(me.opts.domUp.domLoad);
                me.loading = true;     //原文为true         // loading状态默认配置为false，此时改变
                me.opts.loadUpFn(me);                        // 这里才是上啦刷新函数的执行部分，由用户定义
            }else{
                me.$domUp.css({'height':'0'}).on('webkitTransitionEnd mozTransitionEnd transitionend',function(){
                    me.upInsertDOM = false;
                    $(this).remove();                        // 没有刷新，样式复原
                });
            } 
            me._moveY = 0;                                   // _moveY是绑定到构造函数对象的属性，用完后就清零
        }
    }

    // 如果文档高度不大于窗口高度，数据较少，自动加载下方数据       完点  (执行一)
    
    /*me._scrollContentHeight = me.$element[0].scrollHeight; me._scrollWindowHeight = me.$element.height();*/    
    function fnAutoLoad(me){
        if(me.opts.autoLoad){          // autoLoad初始配置为true
            if((me._scrollContentHeight - me._threshold) <= me._scrollWindowHeight){
                console.log(me._scrollContentHeight);
                console.log(me._threshold);
                console.log(me._scrollWindowHeight);
                // 第二个动作
                loadDown(me);
            }
        }
    }

    // 重新获取文档高度          不是事件驱动。由重置函数调用
    function fnRecoverContentHeight(me){
        if(me.opts.scrollArea == win){
            me._scrollContentHeight = $doc.height();
        }else{
            me._scrollContentHeight = me.$element[0].scrollHeight;
        }
    }

    // 加载下方    第二个动作，第一执行与文档高度不大于窗口高度条件下    (执行一，到此结束执行一)
    function loadDown(me){
        me.direction = 'up';
        me.$domDown.html(me.opts.domDown.domLoad);       // domload为加载中
        me.loading = true;       // 原文为true          // 初始配置为false，这里改变了状态
        me.opts.loadDownFn(me);     // (执行一)          // 连串动作第三个loadDownFn,此函数由初始化插件时配置，只是一个执行函数，不包括触发条件
    }

    // 锁定                 不是事件驱动。由用户端执行
    MyDropLoad.prototype.lock = function(direction){     // 此处的direction是作为参数传递，不同于下方的me.direction
        var me = this;
        // 如果不指定方向
        if(direction === undefined){                     // 不指定参数
            // 如果操作方向向上
            if(me.direction == 'up'){
                me.isLockDown = false;   // 此处原来为true                 // isLockDown初始化状态为false，此处锁定
            // 如果操作方向向下
            }else if(me.direction == 'down'){
                me.isLockUp = true;                      // isLockUp初始化状态为false，此处锁定
            }else{
                me.isLockUp = true;
                me.isLockDown = true;
            }
        // 如果指定锁上方
        }else if(direction == 'up'){                     // 指定参数，就按传入的参数实现
            me.isLockUp = true;
        // 如果指定锁下方
        }else if(direction == 'down'){
            me.isLockDown = true;
            // 为了解决DEMO5中tab效果bug，因为滑动到下面，再滑上去点tab，direction=down，所以有bug
            me.direction = 'up';
        }
    };

    // 解锁               不是事件驱动，这里没有被执行，可能由用户执行
    MyDropLoad.prototype.unlock = function(){
        var me = this;
        // 简单粗暴解锁
        me.isLockUp = false;
        me.isLockDown = false;
        // 为了解决DEMO5中tab效果bug，因为滑动到下面，再滑上去点tab，direction=down，所以有bug
        me.direction = 'up';
    };

    // 无数据             不是事件驱动。这里没有被执行，可能由用户执行
    MyDropLoad.prototype.noData = function(flag){            // 此处需要参数flag，由用户端传入
        var me = this;
        if(flag === undefined || flag == true){
            me.isData = false;                               // isdata初始化配置为true
        }else if(flag == false){
            me.isData = true;
        }
    };

    // 重置              不是事件驱动。这里没有被执行，可能由用户执行
    MyDropLoad.prototype.resetload = function(){
        var me = this;
        fnRecoverContentHeight(me);
        /*if(me.direction == 'down' && me.upInsertDOM){  */      // upInsertDOM上方插入数据，初始化配置为false，插入数据后更改为true(即触发了上啦加载)
        if(me.direction == 'down'){  
            me.$domUp.css({'height':'0'}).on('webkitTransitionEnd mozTransitionEnd transitionend',function(){
                me.loading = false;                          // 当CSS 3的transition动画执行结束时，触发webkitTransitionEnd事件
                me.upInsertDOM = false;
                $(this).remove();
                fnRecoverContentHeight(me);                  // 重新获取文档高度,只是获取高度，没有动作
            });
        }else if(me.direction == 'up'){
            me.loading = false;
            // 如果有数据
            if(me.isData){
                // 加载区修改样式
                me.$domDown.html(me.opts.domDown.domRefresh);
                fnRecoverContentHeight(me);
                fnAutoLoad(me);                             // 函数里边有动作，即下拉刷新(条件为isdata = true),此处的数据为过程中的数据
            }else{
                // 如果没数据
                me.$domDown.html(me.opts.domDown.domNoData);  // 如果没有数据，即更新状态插入相应的dom：没有数据
            }
        }
    };

    // css过渡                由touchmove触发，属于(执行二)
    function fnTransition(dom,num){
        dom.css({
            '-webkit-transition':'all '+num+'ms',
            'transition':'all '+num+'ms'
        });
    }
})(window.Zepto || window.jQuery);