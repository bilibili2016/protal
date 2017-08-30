/**
 * Created by liushuai on 2017/8/24.
 */
$(function () {
    //打开/关闭选择时间弹框
    $('.selectDate').click(function (e) {
        e.stopPropagation();
        $('.allMarkRank').hide();
        $('.selectMarkType').find('img').attr('src', '../images/arrow.png');
        $('.selectMarkType').removeClass('hover');
        if ($(this).hasClass('hover')) {
            $(this).removeClass('hover');
            $('.dateList').hide();
        } else {
            $(this).addClass('hover');
            $('.dateList').show();
            $('.selectDate img').attr('src', '../images/arrow-h.png');
        }
    });
    //选择某一个时间
    $('.dateList').on('click', 'ul li', function (e) {
        e.stopPropagation();
        var date = $(this).text();
        $('.selectTime').html(date + '<i><img src="../images/arrow.png" alt=""></i>');
        $('.drop-down').hide();
        $('.selectDate').removeClass('hover');
        searchList();

    });
    //点击关闭弹框
    $(document).on('click', function (e) {
        if (e.target.className != 'drop-down' && e.target.className != 'nav-bar') {
            $('.drop-down').hide();
            $('.selectTime').find('img').attr('src','../images/arrow.png');
            $('.selectMarkType').find('img').attr('src','../images/arrow.png');
            $('.selectDate').removeClass('hover');
        }
    });

    //打开选择市场排行下拉菜单
    $('.selectMarkType').on('click', function (e) {
        $('.dateList').hide();
        $('.selectDate').removeClass('hover');
        $('.selectDate').find('img').attr('src', '../images/arrow.png');
        e.stopPropagation();
        if ($(this).hasClass('hover')) {
            $(this).removeClass('hover');
            $('.allMarkRank').hide();
        } else {
            $(this).addClass('hover');
            $('.allMarkRank').show();
            $('.selectMarkType img').attr('src', '../images/arrow-h.png')
        }
    });

    //选择每一个市场分类
    $('.allMarkRank').on('click', 'ul li', function (e) {
        var str = $(this).text();
        $('.last').html(str + '<i><img src="../images/arrow.png" alt=""></i>');
        $('.selectMarkType img').attr('src', '../images/arrow.png');
        $('.drop-down').hide();
        $('.selectMarkType').removeClass('hover');
        if (str == '整体市场排行') {
            var arr = ['厂商排行榜','品牌排行榜','车型排行榜'];
            var str = '';
            for(var i=0;i<arr.length;i++){
                str += '<li><a href="javascript:;" class="choose"><span>'+arr[i]+'</span><i></i></a></li>'
            }
            $(".nav_list").html(str);
            $(".nav_list li").eq(0).find('a').removeClass('choose').addClass('choose-h');
            searchList();
            darg();
            tab();
        } else if (str == '细分市场车型排行') {
            var arr = ['SUV','MPV','微型车','小型车','紧凑型车','中型车','中大型车','豪华车','跑车'];
            var str = '';
            for(var i=0;i<arr.length;i++){
                str += '<li><a href="javascript:;" class="choose"><span>'+arr[i]+'</span><i></i></a></li>'
            }
            $(".nav_list").html(str);
            $(".nav_list li").eq(0).find('a').removeClass('choose').addClass('choose-h');
            searchList();
            darg();
            tab();
        } else if (str == '价格段排行') {
            var arr = ['8万元以下','8-12万元','12-18万元','18-25万元','25-40万元','40-100万元','100万元以上'];
            var str = '';
            for(var i=0;i<arr.length;i++){
                str += '<li><a href="javascript:;" class="choose"><span>'+arr[i]+'</span><i></i></a></li>'
            }
            $(".nav_list").html(str);
            $(".nav_list li").eq(0).find('a').removeClass('choose').addClass('choose-h');
            searchList();
            darg();
            tab();
        }
    });
    //选择是场排行模块
    $('.nav_wrap').on('click','a',function () {
        var list = document.querySelector(".nav_list");
        css(list,"translateX",0.01);
        list.style.transition = "0.1s";
        $('.nav_wrap ul li a').each(function () {
            $(this).removeClass('choose-h');
        });
        $(this).addClass('choose-h');
        searchList();
    });
    //点击不同类型切换不同选项卡
    $('.rank').click(function () {
        $('.rank').each(function () {
            $(this).find('span').removeClass('hover');
        });
        $(this).find('span').addClass('hover');
        searchList();
    });
    //关注指数排行
    $('.gzMark').click(function () {
        initOption('gz');
        $(this).find('img').attr('src', '../images/icon-04-h.png');
        $('.ygMark').find('img').attr('src', '../images/icon-05.png');
        $('.svMark').find('img').attr('src', '../images/icon-06.png');
    });
    //预购指数
    $('.ygMark').click(function () {
        initOption('yg');
        $(this).find('img').attr('src', '../images/icon-05-h.png');
        $('.gzMark').find('img').attr('src', '../images/icon-04.png');
        $('.svMark').find('img').attr('src', '../images/icon-06.png');
    });
    //销量指数
    $('.svMark').click(function () {
        initOption('sv');
        $(this).find('img').attr('src', '../images/icon-06-h.png');
        $('.gzMark').find('img').attr('src', '../images/icon-04.png');
        $('.ygMark').find('img').attr('src', '../images/icon-05.png');
    });


    $('.dateList').on('click', 'li', function () {
        $(this).addClass('hover').siblings().removeClass('hover');
    });
    $('.allMarkRank').on('click', 'li', function () {
        $(this).addClass('hover').siblings().removeClass('hover');
    });

//初始化下拉列表选择时间
    initOption('gz');
    function initOption(selType) {
        $.ajax({
            url: urlObj.selDate + '/' + selType,
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            contentType: 'application/json',
            //  data: queryParam,
            success: function (backdata) {
                var str = '<ul>';
                var arr = backdata;
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].toString().slice(0, 4) + '年' + arr[i].toString().slice(4) + '月';
                    str += '<li date-num="arr[i]">' + arr[i] + '</li>';
                }
                str += '</ul>';
                $('.dateList').html(str);
                $('.selectTime').html(arr[0] + '<i><img src="../images/arrow.png" alt=""></i>');
                searchList();

            },
            error: function (err) {
                console.log(err);
            }
        });
    }


    function searchList() {
        var yearMonth = $('.selectTime').text().replace(/[^0-9]/g, '');
        var category = 'gz';
        var allMarkType = '';
        $('.rank').each(function () {
            if ($(this).find('span').hasClass('hover')) {
                category = $(this).find('span').attr('data-type');
            }
        });
        // 品牌 -Brand  厂商 -Mf 车型 -Serial
        if ($('.last').text() == '整体市场排行') {
            if ($('.nav_wrap .choose-h').find('span').text() == '厂商排行榜') {
                allMarkType = '-Mf'
            } else if ($('.nav_wrap .choose-h').find('span').text() == '品牌排行榜') {
                allMarkType = '-Brand'
            } else {
                allMarkType = '-Serial'
            }
            $.ajax({
                url: urlObj.searchList + '/' + yearMonth + '/' + category + allMarkType,
                type: "get",
                dataType: "jsonp",
                jsonp: "callback",
                contentType: 'application/json',
                success: function (backdata) {
                    var str = $('#searchTem').html();
                    var html = ejs.render(str, {list: backdata, carType: '整体市场排行'});
                    $('.searchTable').html(html);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        } else if ($('.last').text() == '细分市场车型排行') {
          var category1 = encodeURIComponent($('.nav_list').find('.choose-h span').text());
            $.ajax({
                url: urlObj.searchList + '/' + yearMonth + '/' + category + '-CarLevel'+'/'+category1,

                type: "get",
                dataType: "jsonp",
                jsonp: "callback",
                contentType: 'application/json',
                success: function (backdata) {
                    var str = $('#searchTem').html();
                    var html = ejs.render(str, {list: backdata, carType: '细分市场'});
                    $('.searchTable').html(html);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        } else {
           var category1 = encodeURIComponent($('.nav_list').find('.choose-h span').text());
            $.ajax({
                url: urlObj.searchList + '/' + yearMonth + '/' + category + '-Price'+'/'+category1,
                type: "get",
                dataType: "jsonp",
                jsonp: "callback",
                contentType: 'application/json',
                success: function (backdata) {
                    var str = $('#searchTem').html();
                    var html = ejs.render(str, {list: backdata, carType: '市场价格'});
                    $('.searchTable').html(html);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    }

    function tab() {
        var tab = document.querySelector(".tab_wrap");
        var list = document.querySelector(".nav_list");
        css(list,"translateZ",0.01);
        var i=0;
        var startX = 0;
        var startY = 0;
        var nowX = 0;
        var nowY = 0;
        var disX = 0;
        var disY = 0;
        var currentOffset = 0;  //当前项的偏移量
        var moveOffset = 0;  //移动的偏移量
        var lists = $(".nav_list li");
        var lastOffset = lists.eq(lists.length-3).position().left; //导航条最后一屏第一项的偏移量
        var $this;
            tab.addEventListener('touchstart',function (ev) {
                var touch = ev.changedTouches[0];
                list.style.transition="none";  //初始化状态
                startX = touch.clientX;
                startY = touch.clientY;
                lists.each(function (index,item) {
                    if($(this).find('a').hasClass('choose-h')){
                        i = index;
                        currentOffset = $(item).position().left;
                        $this = $(this);
                    }
                });
            });
            tab.addEventListener('touchmove',function (ev) {
                var touch = ev.changedTouches[0];
                nowX = touch.clientX;
                nowY = touch.clientY;
                disX = nowX - startX;
                disY = nowY - startY;
                if(Math.abs(disY)<Math.abs(disX)){  //左右滑动
                    if(disX<0){  //左滑
                        if(i != lists.length-1){
                            $(".tab_loading").show();
                            $(".table").hide();
                        }
                    }else if(disX>0){  //右滑
                        if(i!=0){
                            $(".tab_loading").show();
                            $(".table").hide();
                        }
                    }
                }
            });
            tab.addEventListener('touchend',function (ev) {
                var touch = ev.changedTouches[0];
                nowX = touch.clientX;
                nowY = touch.clientY;
                disX = nowX - startX;
                disY = nowY - startY;
                if(Math.abs(disY)>Math.abs(disX)){  //上下滑动
                }else if(Math.abs(disY)<=Math.abs(disX)){
                    //判断是左滑还是右滑
                    if(disX<0){  //左滑
                        if(i != $(".nav_list li").length){
                            if($(".nav_list li").find("a").eq(lists.length-1).hasClass('choose-h')){
                                return
                            }else{
                                // summaryType = $this.next().find('a').attr('data-type');
                                pageIndex = 1;
                                // reportAjax(summaryType);
                                searchList();
                                $('.table').show();
                                $('.tab_loading').hide();
                            }
                            $(".choose-h").removeClass('choose-h').parent().next().find("a").addClass('choose-h');
                            list.style.transition="1s";
                            moveOffset = -currentOffset;
                            if(moveOffset >= (-lastOffset)){
                                css(list,"translateX",moveOffset);
                            }
                        }
                    }else if(disX>0){  //右滑
                        if(i != 0){
                            if($(".nav_list li").eq(0).find("a").hasClass('choose-h')){
                                return
                            }else{
                                // summaryType = $this.prev().find('a').attr('data-type');
                                pageIndex = 1;
                                // reportAjax(summaryType);
                                // changeData();
                                searchList();
                                $('.table').show();
                                $('.tab_loading').hide();
                            }
                            $('.choose-h').removeClass('choose-h').parent().prev().find("a").addClass('choose-h');
                            list.style.transition="1s";
                            moveOffset = lastOffset -currentOffset;
                            if(moveOffset <= 0){
                                css(list,"translateX",moveOffset);
                            }else{
                                css(list,"translateX",0);
                            }

                        }
                    }

                }


            })
    }
});

