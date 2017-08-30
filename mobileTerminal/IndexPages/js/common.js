/**
 * Created by liyr on 2017/8/24.
 */
$(function () {
    //rem适配方案
    var width = $(document).width()/16;
    $('head').append('<style>html{font-size:'+width+'px!important}</style>');

});
function darg(){
    var wrap = document.querySelector(".nav_wrap");
    var list = document.querySelector(".nav_list");
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

//					console.log(timeV+" : "+pointV);
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

