/**
 * Created by liyr on 2017/8/25.
 */
$(function () {
    $(".wrap").load('indexNews.html?r='+Math.random());
    $('footer a').click(function () {
        var index = $(this).index();
        $(this).find('span').addClass('hover').parent().siblings().find('' +
            'span').removeClass('hover');
        if(index == 0){
            $(this).find('img').attr('src','../images/icon-01-h.png');
            $(this).next().find('img').attr('src','../images/icon-02.png');
            $(this).next().next().find('img').attr('src','../images/icon-03.png');
            $(".wrap").load('indexNews.html?r='+Math.random());
        }else if(index == 1){
            $(this).find('img').attr('src','../images/icon-02-h.png');
            $(this).prev().find('img').attr('src','../images/icon-01.png');
            $(this).next().find('img').attr('src','../images/icon-03.png');
            $(".wrap").load('indexNum.html?r='+Math.random());
        }else{
            $(this).find('img').attr('src','../images/icon-03-h.png');
            $(this).prev().find('img').attr('src','../images/icon-02.png');
            $(this).prev().prev().find('img').attr('src','../images/icon-01.png');
            $(".wrap").load('aboutUs.html?r='+Math.random());
        }
    })
});
