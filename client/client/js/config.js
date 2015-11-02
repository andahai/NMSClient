$(document).ready(function(){
    //var data = [{station:'石家庄',eth0:'LAN1',eth1:'LAN2',eth2:'LAN3',gw:'10.33.0.1',netmask:'255.255.255.0',ip:'192.168.0.1',order:'.212'},
    //  {station:'长春',eth0:'LAN1',eth1:'LAN2',eth2:'LAN3',gw:'10.33.0.1',netmask:'255.255.255.0',ip:'192.168.0.1',order:'.212'}];
    init();
});
function init(){
//    checkAuth();
    var url="/nms/getStationList";
    $.get(url,function(data){
        createTable(data);
    });
    goGolbal();
    getLocalStation();
//   setInterval("ajax_data()",2000);
}
function createTable(data){
    var jsonArray = JSON.parse(data);
    var length = jsonArray.length;
    $("#config tbody").empty();
    for(var i =0 ;i<length;i++) {
        //增加站点，每行ID为i
        if (jsonArray[i].localFlag == "true") {
            var rowtemplate = "<tr id=" + i + "><td class='station'>&nbsp;%s&nbsp;</td>"
                +"<td><input type='text' readonly='readonly' class='diff'><a href=/nms/stationconfig?station=%s class='edit'>编辑</a><a href=# class='reboot' onclick='reboot(this, " + i + ")'>重启</a></td>";
            //设备接口
            var urlCity =  encodeURI(jsonArray[i].city);
            var row = sprintf(rowtemplate, jsonArray[i].city, urlCity);
        }
        else {
            var rowtemplate = "<tr id=" + i + "><td class='station'>&nbsp;%s&nbsp;</td>"
                + "<td><input type='text' readonly='readonly' class='diff'><a href=/nms/stationconfig?station=%s class='edit'>编辑</a><a href=# class='distribute' onclick='distribute(this," + i + ")'>下发</a><a href=# class='reboot' onclick='reboot(this, " + i + ")'>重启</a></td>";
            var urlCity =  encodeURI(jsonArray[i].city);
            var row = sprintf(rowtemplate, jsonArray[i].city, urlCity);
        }
        $('#config tbody').append($(row));
        if(jsonArray[i].disable == "true"){
            $("#" + i).css("color","grey");
            $("#" + i).find(".distribute").css("color","grey");
            $("#" + i).find(".distribute").unbind("click");
            $("#" + i).find(".reboot").css("color","grey");
            $("#" + i).find(".reboot").unbind("click");
            $("#" + i).find(".reboot").attr("href","#");
            $("#" + i).find(".distribute").attr("href","#");
            $("#" + i).find(".distribute").attr("disable","true");
            $("#" + i).find(".reboot").attr("disable","true");

        }
        else if(jsonArray[i].connectFlag == "false"){
            $("#" + i).find(".diff").val("");
            $("#" + i).find(".distribute").css("color","grey");
            $("#" + i).find(".distribute").unbind("click");
            $("#" + i).find(".reboot").css("color","grey");
            $("#" + i).find(".reboot").unbind("click");
            $("#" + i).find(".reboot").attr("href","#");
            $("#" + i).find(".distribute").attr("href","#");
            $("#" + i).find(".distribute").attr("disable","true");
            $("#" + i).find(".reboot").attr("disable","true");
        }
        else if(jsonArray[i].diffFlag == "true"){
            $("#" + i).find(".diff").val("*");
        }

    }
}
function setCss(){
    $("#config tr:odd").css("background-color","#F3F3F3");
}
function ajax_data(){
    var url="/nms/getGatex";
    $.get(url,function(data){
        createTable(data);
    });
}
//check center and authority
function checkAuth(){
    var url = "/nms/getConfigInfo";
    $.get(url,function(data){
        var jsonMap = JSON.parse(data);
        if(jsonMap.centerFlag == "false"){
            $("#addStation").css("display","none");
        }
        if(jsonMap.authority == "3"){
            $("#globalConfig").css("display","none");
        }
    });
}

function goGolbal(){
    $("#globalConfig").click(function(){
        var url="/nms/globalconfig";
        location.href = url;
    });
};

function reboot(ahref,id){
    $("#rebootFlag" + id).remove();
    $(ahref).parent().append("<span id='rebootFlag" + id + "'>重启中</span>");
    var stationName = $(ahref).parents("tr").children("td:nth-child(1)").text();
    stationName = $.trim(stationName);
    stationName = encodeURI(stationName);
    $.ajax({
        url: "/nms/reboot?station=" + stationName,
        type: 'GET',
        dataType: 'json',
        cache: false,
        success:function(data){
            if(data.exitStatus == "success"){
                $("#rebootFlag" + id).text("重启成功");
            }else{
                $("#rebootFlag" + id).text("重启失败");
            }
        }
    });
};


function distribute(ahref,id){
    $("#distributeFlag" + id).remove();
    $(ahref).parent().append("<span id='distributeFlag"  + id + "'>下发中</span>");
    var stationName = $(ahref).parents("tr").children("td:nth-child(1)").text();
    stationName = $.trim(stationName);
    stationName = encodeURI(stationName);
    $.ajax({
        url: "/nms/distribute?station=" + stationName,
        type: 'GET',
        dataType: 'json',
        cache: false,
        success:function(data){
            if(data.exitStatus == "success"){
                $("#distributeFlag" + id).text("下发成功");
            }else{
                $("#distributeFlag" + id).text("下发失败");
            }
        }
    });
};

//getLocalStation
function getLocalStation(){
    var url="/nms/getLocalStationName";
    $.get(url,function(data) {
        var jsonData = JSON.parse(data);
        $("#localStation").text(jsonData.localStationName);
    });
}