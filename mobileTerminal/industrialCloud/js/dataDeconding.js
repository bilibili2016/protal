/**
 * Created by liyr on 2017/8/23.
 */

$(function () {
    var width = $(document).width()/16;
    $('head').append('<style>html{font-size:'+width+'px!important}</style>');
    $(".content .lists").css('min-height',$(document).height());
    //数据解读
    $.ajax({
        type:'get',
        url:'/AjaxServers/CallWebApiNoAuth.ashx?'+Math.random(),
        data:{
            WebAPIUrl: urlObj.analysis,//具体WebAPI接口URL地址
            Data: 'v=1.0&pageIndex=1&pageSize=10'
        },
        dataType:'json',
        success:function (data) {
            // console.log(data);
            var result = data.Data;
            //模板渲染
            var str = $("#articleTem").html();
            var html = ejs.render(str,{result:result});
            $(".lists").html(html);
            dropload();  //下拉加载
        },
        error:function () {

        },
        complete:function () {

        }
    })
});
var pageIndex = 1;
//下拉加载
function dropload() {
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
                url:'/AjaxServers/CallWebApiNoAuth.ashx?'+Math.random(),
                data:{
                    WebAPIUrl: urlObj.analysis,//具体WebAPI接口URL地址
                    Data: 'v=1.0&pageIndex='+pageIndex+'&pageSize=10'
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