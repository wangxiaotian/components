/**
 * 表格组件
 * @example
        var table = xxtable.init({
            container: '.table1',
            url: '/table/api/table.json',
            //  配置表格操作
            operations: [
                {
                    name: '编辑',
                    todo: function(){
                        alert('heh')
                }
            ],
            //  配置每一列的信息
            cols: [{
                'name': 'name',
                'alias': '姓名',
            }, {
                'name': 'job',
                'alias': '工作'
            }, {
                'name': 'phone',
                'alias': '电话'
            }]
        })

 * @module xxtable
 * @author ky
 */

;
(function() {
    var XXtable = function() {};
    XXtable.prototype.configuration = {
        //  容器
        container: '',
        //  数据接口
        url: '',
        //  操作配置
        operations: [],
        //  每一列的数据格式
        cols: [{
            'name': 'name',
            'alias': '姓名',
        }, {
            'name': 'job',
            'alias': '工作'
        }, {
            'name': 'phone',
            'alias': '电话'
        }],
        //  筛选表单
        filterForm: '',
        //  筛选按钮
        filterBtn: '',
        //  筛选数据
        filterData: {}
    };
    XXtable.prototype.init = function(options) {
        var self = this;
        $.extend(true, this, self.configuration, options);
        self.$container = $(self.container);
        //  启动
        self.initFrame();
        //  初始化分页配置
        self.pageConfig();
        //  初始化操作配置
        self.addOperation();
        //  初始化状态
        self.initStatus();
    };
    //  初始化组件结构
    XXtable.prototype.initFrame = function() {
        var self = this;
        var str = '<div class = "XX-table">\
                        <div class = "row">\
                            <div class = "col-xs-12">\
                                <div class = "table-body"></div>\
                            </div>\
                            <div class = "col-xs-12" style = "margin-top:20px;">\
                                <div class = "table-footer">\
                                </div>\
                            </div>\
                        </div>\
                    </div>';
        console.log(self.$container);
        self.$container.append($(str));
        self.tableContainer = $('.XX-table').find('.table-body');
        self.tableFooter = $('.XX-table').find('.table-footer');
    };
    //  分页框架渲染
    XXtable.prototype.addPaginationDom = function() {
        var self = this,
            _totalPage = self.pageInfo.totalPage,
            _arrStr = '',
            _arr_str = [];
        //  render pageSize
        var _strPageSize = '<div class = "col-xs-1" style = "padding:0px;">\
                                <div class="btn-group page_size">\
                                    <button type = "button" class="btn btn-default dropdown-toggle" data-toggle = "dropdown">\
                                        <span class = "size">' + self.pageInfo.pageSize + '</span>条&nbsp;<span class = "caret"></span>\
                                    </button>\
                                    <ul class="dropdown-menu" style = "min-width:62px;" role = "menu">\
                                        <li><a href="#">10</a></li>\
                                        <li><a href="#">20</a></li>\
                                        <li><a href="#">50</a></li>\
                                    </ul>\
                                </div>\
                            </div>\
                            <div class="col-xs-3" style = "text-align:left">\
                                <div class="count">\
                                    第&nbsp;&nbsp;<span class = "currPage page">1</span>&nbsp;&nbsp;页，共&nbsp;&nbsp;<span class = "total page">' + self.pageInfo.totalPage + '</span>&nbsp;&nbsp;页\
                                </div>\
                            </div>\
                            <div class = "col-xs-1"></div>\
                            <div class = "col-xs-5 pull-right page_page" style = "padding:0px;text-align:right;">\
                                <ul class="pagination" style = "margin:0;">\
                                </ul>\
                            </div>';
        var _el_footer = $('.XX-table').find('.table-footer');
        _el_footer.html('');
        _el_footer.append($(_strPageSize));
        //  render page
        self.updatePageDom();
    };
    //  增加表格操作
    XXtable.prototype.addOperation = function() {
        var self = this;
        var $ops = [];
        $.each(self.operations, function(index, val) {
            var str = '<a href = "#" style = "min-width:50px;display:inline-block" class = "operation-' + index + '">' + val.name + '</a>';
            $ops.push(str);
            self.$container.on('click', '.operation-' + index, function() {
                var that = this;
                val.todo(that);
            })
        })
        self.opsData = $ops;
    };
    //  分页信息配置
    XXtable.prototype.pageConfig = function() {
        var self = this;
        self.pageInfo = {
            'url': self.url,
            'pageSize': 10,
            'pageNumber': 1
                // 'totalNumber': 
                // 'totalPage' :
        }
    };
    //  初始化组件渲染
    XXtable.prototype.initStatus = function() {
        var self = this;
        //  第一次渲染
        self.getData(self.pageInfo, function(data) {
            self.render(data);
            self.countPageNumber(self.pageInfo.totalNumber);
            //  渲染分页结构
            self.addPaginationDom();
            self.pagination_size();
            self.pagination_page();
            //  注册筛选
            self.getFilterData();
        });
    };
    //  获取筛选数据
    XXtable.prototype.getFilterData = function() {
        var self = this,
            $filterForm = $(self.filterForm),
            $filterBtn = $(self.filterBtn);
        if (!$filterForm || !$filterBtn) {
            return;
        }
        $filterBtn.on('click', function() {
            //  序列化表单
            self.filterData = $filterForm.serialize();
            self.dealFilter();
        })
    };
    //  筛选
    XXtable.prototype.dealFilter = function() {
        var self = this;
        self.pageInfo.filterData = self.filterData;
        self.getData(self.pageInfo, function(data) {
            self.render(data);
            //  calculate 
            self.countPageNumber(self.pageInfo.totalNumber);
            //  分页只更新，不重绘
            self.updatePage();
            self.updatePageDom();
            self.pagination_page();
        })
    };
    //  计算总页数
    XXtable.prototype.countPageNumber = function(totalNumber) {
        var self = this;
        var _totalPage = totalNumber / self.pageInfo.pageSize;
        //  calculate total page, update
        self.pageInfo.totalPage = Math.ceil(_totalPage);
    };
    //  分页结构更新
    XXtable.prototype.updatePageDom = function() {
        var self = this,
            _totalPage = self.pageInfo.totalPage,
            _arrStr = '',
            _arr_str = [];
        //  render page
        if (_totalPage <= 7) {
            for (var i = 0; i < _totalPage; i++) {
                _arr_str[i] = '<li><a href="#">' + (i + 1) + '</a></li>';
            }
        } else {
            for (var i = 0; i < 5; i++) {
                _arr_str[i] = '<li><a href="#">' + (i + 1) + '</a></li>';
            }
            _arr_str.push('<li><a href="#">...</a></li>');
            _arr_str.push('<li><a href="#">' + _totalPage + '</a></li>');
        }
        _arr_str.push('<li><a href="#">&raquo;</a></li>');
        _arr_str.unshift('<li><a href="#">&laquo;</a></li>');
        $.each(_arr_str, function(index, val) {
            _arrStr += val;
        })

        var _el = $('.page_page .pagination');
        _el.html('');
        var _arrStr = $(_arrStr);
        _arrStr.eq(0).addClass('disabled');
        _arrStr.eq(1).addClass('active');
        _el.append(_arrStr);
    };

    //  获取数据
    XXtable.prototype.getData = function(params, cb) {
        var self = this;
        var url = params.url,
            data = {
                'pageSize': params.pageSize,
                'pageNumber': params.pageNumber,
                'filterData': params.filterData
            };
        Utils.getData(url, data, function(res) {
            self.dealData(res);
            cb(self.renderData);
        })
    };
    XXtable.prototype.dealData = function(res) {
        var self = this,
            rawData = res.data.trData,
            thData = [],
            trData = [];
        self.pageInfo.totalNumber = res.totalNumber;
        //  获取表头数据
        $.each(self.cols, function(index, cols) {
                thData.push(cols.alias);
            })
            //  获取表格体数据
        $.each(rawData, function(index, raw) {
            //  每一行的数据
            var rawDataItem = [];
            $.each(self.cols, function(index, cols) {
                var value = raw[cols.name];
                rawDataItem.push(value);
            })
            trData.push(rawDataItem);
        })
        self.renderData = {
            thData: thData,
            trData: trData,
            opsData: self.opsData
        }
    };
    //  渲染
    XXtable.prototype.render = function(data) {
        var self = this;
        Utils.requireTpl('table', function(tpl) {
            Utils.render({
                tpl: tpl,
                data: data,
                container: self.tableContainer
            })
        })
    };
    //  选择页数分页
    XXtable.prototype.pagination_page = function() {
        var self = this,
            _page_ul = $('.XX-table').find('.pagination');
        _page_ul.find('li').on('click', function() {
            var _currPage = parseInt(self.pageInfo.pageNumber),
                _el = $(this).parent().find('li'),
                _index = parseInt($(this).index()),
                _text = $(this).text();
            if ($(this).hasClass('disabled')) {
                //  不可点击
                return;
            } else {
                //  点击页数
                //  点击按钮
                if (_index === 0) {
                    _currPage = _currPage - 1;
                } else {
                    if (_index === parseInt(_el.length) - 1) {
                        _currPage = _currPage + 1;
                    } else {
                        if (_index !== 0 && _index !== 8) {
                            _currPage = _text;
                        }
                    }
                }
            }
            self.pageInfo.pageNumber = _currPage;
            self.pagination_disabled(self.pageInfo.pageNumber, _el);
            self.pagination_dom_update(self.pageInfo.pageNumber, _index, _el);
            self.updatePage();
            self.getData(self.pageInfo, function(data) {
                self.render(data);
            })
        })
    };
    //  分页不可点击
    XXtable.prototype.pagination_disabled = function(currPage, el) {
        var self = this;
        var _currPage = currPage,
            _el = el,
            l = parseInt(_el.length) - 1;
        if (_currPage == 1) {
            _el.eq(0).addClass('disabled');
        }
        if (_currPage != 1) {
            _el.eq(0).removeClass('disabled');
        }
        if (_currPage >= self.pageInfo.totalPage) {
            _el.eq(l).addClass('disabled');
        }
        if (_currPage != self.pageInfo.totalPage) {
            _el.eq(l).removeClass('disabled');
        }
    };
    //  分页样式添加
    XXtable.prototype.pagination_style = function(currPage, index, el) {
        var self = this;
        //  样式只添加在当前页
        el.each(function(index, el) {
            var _text = $(this).find('a').text();
            $(this).removeClass('active');

            if (parseInt(_text) === parseInt(currPage)) {
                $(this).addClass('active');
            }
        })
    };
    //  只更新分页dom,不更新分页数据
    XXtable.prototype.pagination_dom_update = function(currPage, index, el) {
        var self = this;
        currPage = parseInt(currPage);
        var that = el;
        el.each(function(index, el) {
            if (index == 0 || index == parseInt(that.length) - 1) {
                return true;
            }
            $(this).removeClass('disabled');
        })
        if (self.pageInfo.totalPage <= 7) {
            self.pagination_style(currPage, index, el);
            return;
        };
        //  dom只更新，不重绘
        if (currPage <= 4) {
            el.eq(6).addClass('disabled');
            el.eq(6).find('a').text('...');
            el.eq(5).find('a').text(5);
            el.eq(4).find('a').text(4);
            el.eq(3).find('a').text(3);
            el.eq(2).find('a').text(2);
            self.pagination_style(currPage, index, el);
            return;
        }
        if (currPage === self.pageInfo.totalPage) {
            el.eq(6).find('a').text(currPage - 1);
            el.eq(5).find('a').text(currPage - 2);
            el.eq(4).find('a').text(currPage - 3);
            el.eq(3).addClass('disabled');
            el.eq(3).find('a').text('...');
            el.eq(2).find('a').text(2);
            self.pagination_style(currPage, index, el);
        }
        if ((currPage + 3) < self.pageInfo.totalPage) {
            el.eq(6).find('a').text('...');
            el.eq(6).addClass('disabled');
            el.eq(5).find('a').text(currPage + 1);
            el.eq(4).find('a').text(currPage);
            el.eq(3).find('a').text(currPage - 1);
            el.eq(2).find('a').text('...');
            el.eq(2).addClass('disabled');
            self.pagination_style(currPage, index, el);
        }
        if ((currPage + 3) == self.pageInfo.totalPage) {
            el.eq(6).find('a').text(currPage + 2);
            el.eq(5).find('a').text(currPage + 1);
            el.eq(4).find('a').text(currPage);
            el.eq(3).find('a').text(currPage - 1);
            el.eq(2).find('a').text('...');
            el.eq(2).addClass('disabled');
            self.pagination_style(currPage, index, el);
        }
        if ((currPage + 3) > self.pageInfo.totalPage) {
            self.pagination_style(currPage, index, el);
            el.eq(2).addClass('disabled');
        }
    };
    //  选择每页数量分页
    XXtable.prototype.pagination_size = function() {
        var self = this,
            _page_size = $('.page_size');

        _page_size.find('li').on('click', function() {
            var _num = $(this).text();
            _page_size.find('button .size').text(_num);
            //  更新
            self.pageInfo.pageSize = _num;
            self.pageInfo.pageNumber = 1;
            self.getData(self.pageInfo, function(data) {
                self.render(data);
                //  calculate 
                self.countPageNumber(self.pageInfo.totalNumber);
                //  分页只更新，不重绘
                self.updatePage();
                self.updatePageDom();
                self.pagination_page();
            })
        })
    };
    //  更新当前页及总页数
    XXtable.prototype.updatePage = function() {
        var self = this,
            _totalPageEl = $('.XX-table').find('.total'),
            _currPageEl = $('.XX-table').find('.currPage');
        //  更新总页数
        _totalPageEl.text(self.pageInfo.totalPage);
        //  更新当前页
        _currPageEl.text(self.pageInfo.pageNumber);
    };
    window.xxtable = {
        init: function(options) {
            var xxtable = new XXtable();
            xxtable.init(options);
        }
    };
})()
