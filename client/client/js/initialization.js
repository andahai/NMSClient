/**
 * Created by lenovo on 2015/12/8.
 */
$(document).ready(function(){
    init();
});
function init(){
    reset();
    ping();

};

function reset(){
    $("#reset").click(function(){
        $("#ethName").val("");
        $("#vlanID").val("");
        $("#localIP").val("");
        $("#localGatewayIP").val("");
        $("#remoteGatewayIP").val("");
        $("#pingState").empty();
    });
}
//ping
function ping(){
    $("#ping").click(function(){
        $.ajax({
            url: "/getPingState",
            type: 'GET',
            dataType: 'json',
            cache: false,
            success:function(data){
                $("#pingState").empty().html("<span>" + data + "</span>");
            }
        });
    });
}
//submit form
function formSave(){
    var validator = validata();
    if(validator.form()){
        $.ajax({
            url: "/getdata",
            type: 'GET',
            dataType: 'json',
            data:$("#initForm").serialize(),
            cache: false,
            success:function(data){
                alert("配置保存成功");
            },
            error:function(){
                alert("配置保存失败");
            }
        });
    }

}

//validate
function validata(){
    return $("#initForm").validate({
        rules:{
            ethName:{
                required:true
            },
            vlanID:{
                required:true
            },
            localIP:{
                required:true,
                ipv4:true
            },
            localGatewayIP:{
                required:true,
                ipv4:true
            },
            remoteGatewayIP:{
                required:true,
                ipv4:true
            }
        },
        messages: {
            ethName: {
                required: "*设备接口名不能为空"
            },
            vlanID: {
                required: "*vlan号不能为空"
            },
            localIP: {
                required: "*设备IP不能为空",
                ipv4: "*请输入合法的设备IP地址"
            },
            localGatewayIP: {
                required: "*本地网关IP不能为空",
                ipv4: "*请输入合法的本地网关IP地址"
            },
            remoteGatewayIP: {
                required: "*远端网关IP不能为空",
                ipv4: "*请输入合法的远端网关IP地址"
            }
        }


    });
}
