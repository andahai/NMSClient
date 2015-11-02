/**
 * Created by lenovo on 2014/12/27.
 */
$(document).ready(function(){
    $("input[name='proFlag']").val("false");
    $("#seniorConfigButton").hide();
    $("#seniorStationConfig").hide();
    $("#seniorInterfaceConfig").hide();
    var url = window.location.href;
    var start = url.indexOf("station=");
    var order = url.slice(start + 8);
    var url = "/nms/getStationConfig?station=" + order;
    $.get(url,function(data){
        showConfig(data);
    });
    restart(order);
    modifyHref();
    getLocalStation();
});
var seniorFlag = 0;
function showConfig(data){
    var config = JSON.parse(data);
    $("input[name='cnNameStr']").val(config.cnNameStr);
    if(config.modeStr == "PLANT") {
        $("input[name='modeStr']").val("串联");
    }else if(config.modeStr == "WIRETAP") {
        $("input[name='modeStr']").val("并联");
    }
    var list = config.interfaceList;
    $("input[name='length']").val(list.length);
    for(var i =0 ;i<list.length;i++) {
        var rowTemplate = "<tr><td><input name='cnNameStr" +i + "' type='text' value='%s'/>" +
            "<input name='oldName" + i + "' type='hidden' value='%s'/></td>" +
            "<td><input name='vlanIdStr" +i + "' type='text' value='%s'/></td>" +
            "<td><input name='lanStr" +i + "' type='text' value='%s'/></td>" +
            "<td><input name='addressIP" +i + "' type='text' value='%s'/></td>" +
            "<td><input name='netmaskIP" +i + "' type='text' value='%s'/></td>" +
            "<td><input name='gatewayIP" +i + "' type='text' value='%s'/></td>" +
            + "</tr>";
        var row = sprintf(rowTemplate, list[i].cnNameStr,list[i].nameStr, list[i].vlanIdStr, list[i].lanStr, list[i].addressIP, list[i].netmaskIP,  list[i].gatewayIP);
        $("#interfaceConfig").append($(row));
    }
}
function modifyHref(){
    var url = window.location.href;
    var start = url.indexOf("station=");
    order = url.slice(start + 8);
    $("input[name='station']").val(order);
}

//reboot
function restart(order){
    $("#restart").click(function(){
       $.ajax({
            url: "/nms/reboot?station=" + order ,
            type: 'GET',
            dataType: 'json',
            cache: false
        });
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



