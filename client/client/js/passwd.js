/**
 * Created by lenovo on 2015/1/19.
 */
$(document).ready(function(){
    getLocalStation();
    $("form").validate({
        rules:{
            user:{
                required:true
            },
            passwd:{
                required:true
            },
            passwdAgain:{
                equalTo:"#passwd"
            }
        },
        messages:{
            user:{
                required:"用户名不能为空"
            },
            passwd:{
                required:"密码不能为空"
            },
            passwdAgain:{
                equalTo:"两次密码输入不一致"
            }
        }

    });
});
function checkPasswd(){
    $("form").submit(function(){
        var passwd = $("#passwd").val();
        var passwdAgain = $("#passwdAgain").val();
        if(passwd != passwdAgain){
            alert("两次密码输入不一致，请重新输入！")
            return false;
        }
    });
}

//getLocalStation
function getLocalStation(){
    var url="/nms/getLocalStationName";
    $.get(url,function(data) {
        var jsonData = JSON.parse(data);
        $("#localStation").text(jsonData.localStationName);
    });
}