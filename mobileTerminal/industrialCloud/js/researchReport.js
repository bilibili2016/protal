/**
 * Created by liyr on 2017/8/23.
 */
//@ sourceURL=researchReport
$(function () {
    //rem适配方案
    var width = $(document).width()/16;
    $('head').append('<style>html{font-size:'+width+'px!important}</style>');
    var minHeight = $(document).height() - $(".nav").height() - $(".seat").height();
    $(".content .lists").css('min-height',minHeight);

    reportAjax($.trim($(".current").attr('data-type')));
    //可拖拽的导航
    darg();
    //导航条点击
    $(".nav").delegate('#nav_list li','click',function (e) {
        $(this).find('a').addClass('current').parent().siblings().find('a').removeClass('current');
        $(".tab_loading").show();
        $(".content").hide();
        var para = $(this).find('a').attr('data-type');
        pageIndex = 1;
        reportAjax(para);
    });

    //同步选项卡
    tab();
    function tab() {
        var tab = document.querySelector(".tab_wrap");
        var list = document.querySelector("#nav_list");
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
        var lists = $("#nav_list li");
        var lastOffset = lists.eq(lists.length-3).position().left; //导航条最后一屏第一项的偏移量
        var summaryType;  //请求参数
        var $this;

        //判断用户首次上来滑动的方向
        //判断滑动的方向
        var isX = true;
        var isFirst = true;
        tab.addEventListener('touchstart',function (ev) {
            var touch = ev.changedTouches[0];
            list.style.transition="none";  //初始化状态
            startX = touch.clientX;
            startY = touch.clientY;
            lists.each(function (index,item) {
                if($(this).find('a').hasClass('current')){
                    i = index;
                    currentOffset = $(item).position().left;
                    $this = $(this);
                }
            });

            isX=true;
            isFirst=true;
        });
        tab.addEventListener('touchmove',function (ev) {
            //开关
            if(!isX){
                return;
            }
            var touch = ev.changedTouches[0];
            nowX = touch.clientX;
            nowY = touch.clientY;
            disX = nowX - startX;
            disY = nowY - startY;

            //解决抖动问题
            if(isFirst){
                isFirst=false;
                if(Math.abs(disY)>Math.abs(disX)){
                    isX=false;
                }
            }

            if(Math.abs(disY) == Math.abs(disX)){
                $(".tab_loading").hide();
                $(".content").show();
            }else if(Math.abs(disY)<Math.abs(disX)){  //左右滑动
                if(disX<0){  //左滑
                    if(i != lists.length-1){
                        $(".tab_loading").show();
                        $(".content").hide();

                    }
                }else if(disX>0){  //右滑
                    if(i!=0){
                        $(".tab_loading").show();
                        $(".content").hide();
                    }
                }

            }else if(Math.abs(disY)>Math.abs(disX)){
                $(".tab_loading").hide();
                $(".content").show();
            }
        });
        tab.addEventListener('touchend',function (ev) {
            var touch = ev.changedTouches[0];
            nowX = touch.clientX;
            nowY = touch.clientY;
            disX = nowX - startX;
            disY = nowY - startY;
            if(Math.abs(disY) == Math.abs(disX)){
                $(".tab_loading").hide();
                $(".content").show();
            }else if(Math.abs(disY) < Math.abs(disX)){
                //判断是左滑还是右滑
                if(disX<0){  //左滑
                    if(i != $("#nav_list li").length){
                        if($("#nav_list li").find("a").eq(lists.length-1).hasClass('current')){
                            return
                        }else{
                            summaryType = $this.next().find('a').attr('data-type');
                            pageIndex = 1;
                            reportAjax(summaryType);
                        }
                        $('.current').removeClass('current').parent().next().find("a").addClass('current');
                        list.style.transition="1s";
                        moveOffset = -currentOffset;
                        if(moveOffset >= (-lastOffset)){
                            css(list,"translateX",moveOffset);
                        }
                    }
                }else if(disX>0){  //右滑
                    if(i != 0){
                        if($("#nav_list li").eq(0).find("a").hasClass('current')){
                            return
                        }else{
                            summaryType = $this.prev().find('a').attr('data-type');
                            pageIndex = 1;
                            reportAjax(summaryType);
                        }
                        $('.current').removeClass('current').parent().prev().find("a").addClass('current');
                        list.style.transition="1s";
                        moveOffset = lastOffset -currentOffset;
                        if(moveOffset <= 0){
                            css(list,"translateX",moveOffset);
                        }else{
                            css(list,"translateX",0);
                        }

                    }
                }

            }else if(Math.abs(disY)>Math.abs(disX)){
                $(".tab_loading").hide();
                $(".content").show();
            }


        })
    }

});

var pageIndex = 1;
function darg(){
    var wrap = document.querySelector("#nav_wrap");
    var list = document.querySelector("#nav_list");
    css(list,"translateZ",0.01);
    var minX = wrap.clientWidth - list.offsetWidth;
    var startX = 0;
    var elementX = 0;
    //橡皮筋系数
    var ratio = 1;


//				上一次的位置
    var lastPoint =0;
//				上一次的时间
    var lastTime = 0;
//				时间差   不能为0 一旦为0 第一次点击的时候，会出bug
    var timeV = 1;
//				位置差
    var pointV =0;
//				速度

    wrap.addEventListener("touchstart",function(ev){
//					解决速度的残留
        pointV =0;
        timeV = 1;
        list.style.transition="none";

        var touch = ev.changedTouches[0];
        startX = touch.clientX;
        elementX = css(list,"translateX");

        lastPoint = startX;
        lastTime = new Date().getTime();

    })

    wrap.addEventListener("touchmove",function(ev){
        var touch = ev.changedTouches[0];
        var nowX = touch.clientX;
        var dis = nowX - startX;
        var translateX=elementX+dis;
        //只有超出的时候，才存在橡皮筋效果
//					if(translateX>0){
//						//随着ul移动距离越来越大，整个ul移动距离的增幅越来越小
//						ratio = 0.6-translateX/(document.documentElement.clientWidth*3);
//						translateX=translateX*ratio;
//					}else if(translateX<minX){
//						//右边的留白（正值）
//						var over = minX - translateX;
//						ratio = 0.6-over/(document.documentElement.clientWidth*3);
//						translateX=minX-(over*ratio);
//					}
        if(translateX>0){
            //随着ul移动距离越来越大，整个ul移动距离的增幅越来越小
            ratio = document.documentElement.clientWidth/((document.documentElement.clientWidth+translateX)*1.8);
            translateX=translateX*ratio;
        }else if(translateX<minX){
            //右边的留白（正值）
            var over = minX - translateX;
            ratio = document.documentElement.clientWidth/((document.documentElement.clientWidth+over)*1.8);
            translateX=minX-(over*ratio);
        }

        var nowTime = new Date().getTime();
        var nowPoint = nowX;
        pointV = nowPoint - lastPoint;
        timeV = nowTime - lastTime;
        lastPoint = nowPoint;
        lastTime = nowTime;

        css(list,"translateX",translateX);
    })

    wrap.addEventListener("touchend",function(){
        var speed = pointV/timeV;
        var addX = speed*200;
        var target= css(list,"translateX")+addX;
        var bessel ="";
        var time =0;
        time = Math.abs(speed)*0.3;
        time =time<0.3?0.3:time;

        if(target>0){
            target=0;
            bessel="cubic-bezier(.65,1.49,.63,1.54)";
        }else if(target<minX){
            target = minX;
            bessel="cubic-bezier(.65,1.49,.63,1.54)";
        }


        list.style.transition=time+"s "+bessel;
        css(list,"translateX",target);
    })
}

//研究报告列表
function reportAjax(summaryType) {
    //研究报告
    $.ajax({
        type:'get',
        url:'/AjaxServers/CallWebApiNoAuth.ashx?'+Math.random(),
        data:{
            WebAPIUrl: urlObj.report,//具体WebAPI接口URL地址
            Data: 'v=1.4&pageIndex=1&pageSize=10&summarytype='+summaryType
        },
        dataType:'json',
        success:function (data) {
            $(".dropload-down").remove();
            $(".lists").html('');
            $(".tab_loading").hide();
            $(".content").show();
            var result = data.Data;
            //模板渲染
            var str = $("#articleTem").html();
            var html = ejs.render(str,{result:result});
            $(".lists").html(html);
            dropload(summaryType);   //下拉刷新
        },
        error:function () {

        },
        complete:function () {

        }
    })
}

//下拉加载
function dropload(summaryType) {
    var counter = 0;   //记录进行几次下拉刷新
    var num = 4;   // 每页展示数量
    var pageStart = 0,pageEnd = 0;  //每页开始的位置和结束的位置
    pageIndex ++;
    // dropload
    $('.content').dropload({
        scrollArea : window,
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">已经到底了</div>'
        },
        loadDownFn : function(me){
            $.ajax({
                type:'get',
                // url:'js/more.json',
                 url:'/AjaxServers/CallWebApiNoAuth.ashx',
                 data:{
                 WebAPIUrl: urlObj.report,//具体WebAPI接口URL地址
                 Data: 'v=1.0&pageIndex='+pageIndex+'&pageSize=10&summarytype='+summaryType
                 },
                dataType:'json',
                success: function(data){
                     if(data.Data.length == 0){
                         me.lock(); // 锁定
                         me.noData();  // 无数据
                     }else {
                         var result = '';
                         counter++;
                         pageEnd = num * counter;
                         pageStart = pageEnd - num;
                         for(var i = pageStart; i < pageEnd; i++){
                             result += '<article><a class="item opacity" href="'+data.Data[i].AttachmentUrl+'"><div class="article-img-pane">'
                                 +'<img src="'+data.Data[i].ImageUrl+'" alt=""></div>'
                                 +'<h2>'+data.Data[i].Title+'</h2></a>'
                                 +' <div class="a-meta">'+data.Data[i].PublishTime+'</div> </article>';
                             if((i + 1) >= data.Data.length){
                                 // 锁定
                                 me.lock();
                                 // 无数据
                                 me.noData();
                                 break;
                             }
                         }
                         $('.lists').append(result);
                     }
                    // 每次数据加载完，必须重置
                    me.resetload();
                },
                error: function(xhr, type){
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        },
        threshold : 50
    });

}

