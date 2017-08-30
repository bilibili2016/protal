/**
 * Created by liushuai on 2017/8/23.
 */

var obj = {
    TrialType:'Trial' ,  //申请类型
    Modules:'',     //模块选择
    CustomerName:'',//申请人姓名
    CustomerPhone:'',      //联系电话
    vCode:'',  //验证码
    Email:'',     //邮箱
    CompanyName:'',//公司名称
    Position:'',   //职务
    vCardUrl:'',  //名片上传
    Guid:'' //校验验证码时效性参数
};

$(function () {
    var isSuccess = true;
    var imgUlr = '';

    /*点击每一个模块选择标签控制选中状态*/
    var totalSel = 0;
    $('.answer span').on('touchstart', function () {
        if ($('.applyTrail').prop('checked')) {
            if (totalSel >= 3) {
                if ($(this).hasClass('current')) {
                    $(this).removeClass('current');
                }
            } else {
                if ($(this).hasClass('current')) {
                    $(this).removeClass('current');
                } else {
                    $(this).addClass('current');
                }
            }
            totalSel = $('.answer span.current').length;
            if(totalSel==3){
                $('.answer span').each(function () {
                    if(!$(this).hasClass('current')){
                        $(this).addClass('cannot');
                    }
                });
            }else{
                $('.answer span').each(function () {
                    if(!$(this).hasClass('current')){
                        $(this).removeClass('cannot');
                    }
                });
            }
        } else {
            if ($(this).hasClass('current')) {
                $(this).removeClass('current');
            } else {
                $(this).addClass('current');
            }
        }
    });

    /*切换申请类型的时候重置选择的标签*/
    var selectWitch = 'apply';
    $('.applyTrail').on('click', function () {
        if (selectWitch == 'consul') {
            $('.answer span').each(function (index, item) {
                $(item).removeClass('current');
                $(item).removeClass('cannot');
            })
        }
        selectWitch = 'apply'
    });
    $('.consultation').on('click', function () {
        if (selectWitch == 'apply') {
            $('.answer span').each(function (index, item) {
                $(item).removeClass('current');
                $(item).removeClass('cannot');
            });
        }
        selectWitch = 'consul';
    });

    $('.telephone').keyup(function () {
        if ('' != $(this).val().replace(/\d{1,}\.{0,1}\d{0,}/, '')) {
            $(this).val($(this).val().match(/\d{1,}\.{0,1}\d{0,}/) == null ? '' : $(this).val().match(/\d{1,}\.{0,1}\d{0,}/));
        }
    });


    $('footer').on('click', function () {
        if(!isSuccess){
            return;
        }
        var form_data = getDate();
        if(form_data.CustomerName && form_data.CustomerPhone && form_data.Email && form_data.CompanyName && form_data.Position && form_data.vCardUrl) {
            // 提交
            var data = '';
            for(var i in form_data){
                data += i+'='+form_data[i]+'&';
            }
            data+'vCode=1.4';
            isSuccess =false;
            $.ajax({
                url: '/AjaxServers/CallWebApiNoAuth.ashx',
                dataType: 'json',
                type: 'get',
                data: {
                    WebAPIUrl: urlObj.add,
                    Data: data
                },
                success: function (data) {
                    if (data.Message == 'Success') {
                        alert('提交成功');
                        window.location.reload();
                    } else {
                        alert(data.Message);
                    }
                },
                complete: function () {
                    isSuccess = true;
                }
            });
        }
    });


    uploadFile(obj);

    function getDate() {
        try {
            if ($('.applyName').val().length == 0) {
                throw '请输入申请人姓名!';
            }
            obj.CustomerName = $('.applyName').val();//申请人姓名
            if ($('.telephone').val().length == 0) {
                throw '请输入联系电话!';
            }else{
                if(!(/^1[34578]\d{9}$/.test($('.telephone').val()))){
                    throw '电话格式不正确!';
                }
            }
            obj.CustomerPhone = $('.telephone').val();//申请人手机号
            if($('#emailAdd').val().length==0){
                throw '请输入电子邮箱!';
            }else{
                var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
                if(!re.test($('#emailAdd').val())){
                    throw '请输入正确的邮箱格式!';
                }
            }
            obj.Email = $('#emailAdd').val();//电子邮箱
            if($('#identCode').val().length==0){
                throw '请输入验证码!'
            }
            obj.vCode = $('#identCode').val();

            if ($('#componeyName').val().length == 0) {
                throw '请输入公司名称!';
            }
            obj.CompanyName = $('#componeyName').val();//公司名称

            var moduleArr = [];
            $('.answer span').each(function () {
                if ($(this).hasClass('current')) {
                    moduleArr.push($(this).text());
                }
            });
            if(moduleArr.length==0){
                throw '请选择申请模块!';
            }
            moduleArr.join(',');
            obj.Modules = moduleArr;
            if($('.position').val().length==0){
                throw '请输入职务!';
            }
            obj.Position = $('.position').val();
            obj.TrialType = $('.applyTrail').prop('checked')?'Trial':'Consult';
            if(obj.vCardUrl.length==0){
                throw '请上传名片!';
            }
        } catch (e) {
            alert(e);
            return;
        }
        return obj;
    }

    $('.uploadFile').on('click',function (e) {
        $('.webuploader-pick').next('div').click();
    });
    $('.choice-i').find('div').attr('style','');
    /*上传文件*/
    function uploadFile(){
        var maxSize = 10*1024*1024;
        var uploader = WebUploader.create({
            swf: 'js/Uploader.swf',
            server: '/AjaxServers/FileHandler.ashx',
            pick: '.upload',
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,
            auto:true,
            threads:1,
            duplicate:true,
            fileSingleSizeLimit:maxSize
        });

        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {
            $('.tagging').hide();
          /*  if(file.ext !='jpg' && file.ext !='png' ){
                alert('图片格式不符合要求!');
                uploader.cancelFile( file );
            }*/
        });
        //上传前
        uploader.on('uploadBeforeSend', function (block, data, headers) {
            data = $.extend(data, {
                ActionName: "upload"
            });
        });
        // 上传成功
        uploader.on('uploadSuccess', function (file, response) {
            var success = response.result;
            obj.vCardUrl = response.url;
            if (success) {
                $('.showPrev').attr('src',obj.vCardUrl);
                $('.showImg').show();
                $('.uploadFile').hide();
                $('.choice-i').hide();
            } else {
                alert(response.msg);
            }
        });

        uploader.on('uploadError', function (file) {
            alert('上传出错!')
        });
    }

    $('.delFile').click(function () {
        $('.showImg').hide();
        $(".uploadFile").show();
        $('.choice-i').show();
    });

});
var countdown = 60;
function settime(val) {
    if($('.telephone').val().length==0){
        alert('请输入手机号!');
        return;
    }
    if(countdown==60){
        var str = $('.telephone').val();
        $.ajax({
            url: '/AjaxServers/CallWebApiNoAuth.ashx',
            dataType: 'json',
            type: 'get',
            timeout:15000,
            data: {
                WebAPIUrl: urlObj.getVerifyCode,
                Data:'vCode=1.4&customerphone='+str
            },
            success: function (data) {
                if(data.Message!='Success'){
                    // alert(data.Message);
                }else{
                    obj.Guid = data.Guid;
                }
            },
            error: function (err) {
                // alert(err);
            }
        });
    }
    if (countdown == 0) {
        $(val).attr('onclick', "settime(this)");
        val.innerHTML = "获取验证码";
        countdown = 60;
        return;
    } else {
        $(val).attr('onclick', '');
        val.innerHTML = "重新发送(" + countdown + ")";
        countdown--;
    }
    setTimeout(function () {
        settime(val);
    }, 1000)
}