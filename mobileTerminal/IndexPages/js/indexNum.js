/**
 * Created by liyr on 2017/8/24.
 */

//@ sourceURL=indexNum
urlObj = {
    /*  //时间
     dateTime:'/date',
     //有数据的月份
     monthData:'/allMonth/xf',
     //车型、城市排行
     Ranking:'/alltop/'*/
    //有数据的月份
    monthData:'http://192.168.3.15/allMonth/xf',
    //车型、城市排行
    Ranking:'http://192.168.3.15/alltop/'
};


$(function () {

    //有数据的月份
    $.ajax({
        url:urlObj.monthData,
        type:"get",
        dataType:"jsonp",
        jsonp:"callback",
        contentType:'application/json',
        success:function (data) {
            var str = '';
            for(var i=0;i<data.length;i++){
                var times = data[i]+"";
                var year = times.substring(0,4);
                var month = parseInt(times.substring(4));
                str += '<li data-type="'+ data[i]+'">'+year+'年'+month+'月</li>';
            }
            $('.time ul').html(str);
            var chooseTime = data[data.length -1]+"";
            var chooseYear = chooseTime.substring(0,4);
            var chooseMonth = parseInt(chooseTime.substring(4));
            $(".chooseTime em").text(chooseYear+'年'+chooseMonth+'月');
            $(".chooseTime").attr('data-type',data[data.length -1]);


            $('.time li').eq($('.time li').length-1).addClass('hover');
            $(".classfy li").eq(0).click();
        },
        error:function (err) {
            console.log(err);
        }
    });

    //选择时间
    $(".chooseTime").click(function () {
        $(".time").toggle();
        $(".classfy").hide();
        $(this).addClass('hover').find('img').attr('src','../images/arrow-h.png');
    });
    //下拉列表选择时间
    $(".time").delegate('li','click',function () {
        $(this).addClass('hover').siblings().removeClass('hover');
        $('.chooseTime em').text($.trim($(this).text()));
        $('.chooseTime').attr('data-type',$(this).attr('data-type'));
        $(".time").hide();
        $(".chooseTime").removeClass('hover');
        $(".chooseTime img").attr('src','../images/arrow.png');
        //loading图
        $(".tab_loading").show();
        $(".table").hide();
        changeData();
    });
    //选择排行
    $(".level").click(function () {
        $(".time").hide();
        $(".classfy").toggle();
        $(this).addClass('hover').find('img').attr('src','../images/arrow-h.png');
    });
    //下拉排行列表
    $(".classfy li").click(function () {
        if($(this).attr('data-id') == 1){  //细分市场
            $(".nav_list").html('');
            var car = ['轿车','SUV','MPV','豪华','自主'];
            var str = '';
            for(var i = 0;i< car.length;i++){
                str += '<li><a href="javascript:;" class="choose"><span>'+car[i]+'</span><i></i></a></li>'
            }
            $(".nav_list").html(str);
            $(".nav_list li").eq(0).find('a').removeClass('choose').addClass('choose-h');

            var list = document.querySelector(".nav_list");
            css(list,"translateX",0.01);
            list.style.transition = "0.1s";
            darg();
            //同步选项卡
            // tab();
        }else if($(this).attr('data-id') == 2){  //城市排行
            $(".nav_list").html('');
            var citys = ['一级城市','二级城市','三级城市','四级城市','五级及以下城市'];
            var str = '';
            for(var i = 0;i< citys.length;i++){
                str += '<li><a href="javascript:;" class="choose"><span>'+citys[i]+'</span><i></i></a></li>'
            }
            $(".nav_list").html(str);
            $(".nav_list li").eq(0).find('a').removeClass('choose').addClass('choose-h');

            var list = document.querySelector(".nav_list");
            css(list,"translateX",0.01) ;
            list.style.transition = "0.1s";

            darg();
            //同步选项卡
            // tab();
        }
        $(".level").attr('data-id',$(this).attr('data-id'));
        $(this).addClass('hover').siblings().removeClass('hover');
        $('.level em').text($.trim($(this).text()));
        $(".classfy").hide();
        $(".level").removeClass('hover');
        $(".level img").attr('src','../images/arrow.png');
        //loading图
        $(".tab_loading").show();
        $(".table").hide();

        changeData();
    });
    //导航条点击
    $(".nav_list").delegate('li','click',function (e) {
        e.stopPropagation();
        $(this).find('a').addClass('choose-h').parent().siblings().find('a').removeClass('choose-h');
        //loading图
        $(".tab_loading").show();
        $(".table").hide();

        changeData();
    });

    /*$(document).click(function (ev) {
        ev.stopPropagation()
        $(".classfy").hide();
        $(".time").hide();
    })*/

});
//获取参数
function changeData() {
    var Type,urlType;
    var dateTime = $(".chooseTime").attr('data-type');
    var levelID = $('.level').attr('data-id');
    $(".nav_list").find('li').each(function () {
        if($(this).find('a').hasClass('choose-h')) {
            Type = $.trim($(this).find('span').text());
        }
    });
    if(levelID == 1){
        urlType = '/xf-carlevel/';
        MarketCar(dateTime,urlType,Type);
    }else if(levelID == 2){
        urlType = '/xf-citylevel/';
        MarketCar(dateTime,urlType,Type);
    }
}

//排行接口
function MarketCar(dateTime,urlType,Type) {
    $.ajax({
        url:urlObj.Ranking+dateTime+urlType+encodeURI(Type),
        type:"get",
        dataType:"jsonp",
        jsonp:"callback",
        contentType:'application/json',
        success:function (data) {
            $(".tab_loading").hide();
            $(".table").show();
            if(data.length != 0){
                var str = $("#marketCarTem").html();
                var html = ejs.render(str,{list:data});
                $("#marketCar").html(html);
                var total = parseInt(data[0].showIndex);
                $(".progressBarColor").each(function (index,item) {
                    for (var j = 0; j < data.length; j++) {
                        if(index == j){
                            $(item).css({width: (data[j].showIndex / total) * 100 + '%'});
                        }
                    }
                });
            }else{
                $("#marketCar").html('');
            }
        },
        error:function (err) {
            console.log(err);
        }

    })
}

//同步选项卡
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

    tab.addEventListener('touchstart',function (ev) {
        ev.stopPropagation();
        var touch = ev.changedTouches[0];
        list.style.transition="none";  //初始化状态
        startX = touch.clientX;
        startY = touch.clientY;
        lists.each(function (index,item) {
            if($(this).find('a').hasClass('choose-h')){
                i = index;
                currentOffset = $(item).position().left;
                // console.log(currentOffset);
            }
        });
    });
    tab.addEventListener('touchmove',function (ev) {
        ev.stopPropagation();
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
        ev.stopPropagation();
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
                        changeData();
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
                        changeData();
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
