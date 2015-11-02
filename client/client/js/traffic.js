/**
 * Created by lenovo on 2014/12/18.
 */
$(document).ready(function(){
    init();
});
var screenFlag = 0;
function init(){
    var url="/nms/getStationTraffic";
    $.get(url,function(data){
        createInterfaceTable(data);
    });
    fullScreen();
    reset();
    getLocalStation();
    setInterval("ajax_data()",2000);
}

function createInterfaceTable(data){
    var jsonArray = JSON.parse(data);
    var length = jsonArray.length;
    for(var i =0 ;i<length;i++) {
        var rowTemplate = "<tr id=" + i + "><td class='name'>%s</td><td class='state'>%s</td><td class='per_packets_recv'>%s</td>"
            + "<td class='per_packets_send'>%s</td><td class='per_bits_recv'>%s</td><td class='per_bits_send'>%s</td><td class='total_packets_recv'>%s</td>"
            +"<td class='total_packets_send'>%s</td><td class='total_bytes_recv'>%s</td><td class='total_bytes_send'>%s</td></tr>";
        var row = sprintf(rowTemplate, jsonArray[i].name, judge(jsonArray[i].state), judge(jsonArray[i].per_packets_recv), judge(jsonArray[i].per_packets_send), judge(jsonArray[i].per_bits_recv),
            judge(jsonArray[i].per_bits_send),judge(jsonArray[i].total_packets_recv),judge(jsonArray[i].total_packets_send),judge(jsonArray[i].total_bytes_recv),judge(jsonArray[i].total_bytes_send));

        $("#interfaceTraffic").append($(row));
    }
    replaceTr($("#interfaceTraffic"));
    setCss();
}


//轮询接口信息
function ajax_data(){
    var url="/nms/getStationTraffic";
    $.get(url,function(data)
    {
        var jsonArray = JSON.parse(data);
        var length = jsonArray.length;
        for(var i = 0;i<length;i++){
            for(var k in jsonArray[i]){
                $('#'+i).children('.'+k).text(judge(jsonArray[i][k]));
            }
        }
        replaceTr($("#interfaceTraffic"));
    });
}
//添加偶数行背景
function setCss(){
    $("#interfaceTraffic tr:odd").css("background-color","#F3F3F3");
}
//DOWN进行警告
function replaceTr(trobj)
{
    trobj.find("td, th").each(
        function(){
            var text_ = $(this).text();
            var RED_WORD="DOWN";
            var RED_WORD1 = "Down";
            var GREEN_WORD="UP";
            if (text_ == RED_WORD || text_ == RED_WORD1)
            {
                var span = $("<span></span>").css('color', 'white')
                    .css('background-color', 'red')
                    .css('font-weight', 'bold')
                    .css('padding', '2px 1px');
                span.text('Down');
                $( this ).empty().html(span);
            }
        }
    );
}

//保留四位显示
function judge(str){
    if(str==null){
        return "";
    }
    if(str == "NaN"){
        return " ";
    }
    else if(str == 0){
        var num = new Number(str);
        return num.toFixed(0);
    }
    else if(str < 10 && str > 0){
        var num = new Number(str);
        return num.toFixed(2);
    }
    else if(str >= 10 && str < 100){
        var num = new Number(str);
        return num.toFixed(1);
    }
    else if(str >= 100 && str < 1000){
        var num = new Number(str);
        return num.toFixed(0);
    }
    else if(str >= 1000 && str < 10000){
        var num = new Number(str/1000);
        return num.toFixed(1)+"K";
    }
    else if(str >= 10000 && str < 1000000){
        var num = new Number(str/1000);
        return num.toFixed(0)+"K";
    }
    else if(str >= 1000000 && str < 10000000){
        var num = new Number(str/1000000);
        return num.toFixed(1)+"M";
    }
    else if(str >= 10000000 && str < 1000000000){
        var num = new Number(str/1000000);
        return num.toFixed(0)+"M";
    }
    else if(str >= 1000000000 && str < 10000000000){
        var num = new Number(str/1000000000);
        return num.toFixed(1)+"G";
    }
    else if(str >= 10000000000 && str < 1000000000000){
        var num = new Number(str/1000000000);
        return num.toFixed(0)+"G";
    }
    else if(str >= 1000000000000){
        var num = new Number(str/1000000000000);
        return num.toFixed(1)+"T";
    }
    else
        return str;
}
function judgePercent(str){
    if(str == "NaN"){
        return " ";
    }
    else if((str>=0.01 && str<=9.99)||(str<=-0.01 && str>=-9.99)){
        var num = new Number(str);
        return num.toFixed(2);
    }
    else if((str>=10.0 && str<99.9)||(str<=-10.0 && str>-99.9)){
        var num = new Number(str);
        return num.toFixed(1);
    }
    else if((str < 0.01 && str >= 0) || (str > -0.01 && str <=  0)){
        return 0;
    }
    else if(str == 100 || str == -100){
        var num = new Number(str);
        return num.toFixed(0);
    }
    else if((str >= 99.9 && str < 100) || (str <= -99.9 && str > -100) ){
        var num = new Number(str);
        return num.toFixed(0);
    }
    else if(str == " ")
        return " ";
    else
        return str;
}
//fullScreen
function fullScreen(){
    $('#fullScreen').click(
        function(){
            if(screenFlag == 0) {
                $('#header').css("display", "none");
                $('#menu').css('display', 'none');
                $('#content').css('background-color', 'white');
                $('#traffic').addClass('fullScreen');
                screenFlag = 1;
                $('#fullScreen').attr("value","退出全屏");
                return;
            }
            if(screenFlag == 1){
                $('#header').css("display", "block");
                $('#menu').css('display', 'block');
                $('#content').css('background-color', '#0052A4');
                $('#traffic').removeClass('fullScreen');
                screenFlag = 0;
                $('#fullScreen').attr("value","全屏显示");
                return;
            }
        }
    );
}
//click event
function reset(){
    $("#resetTraffic").click(function(){
        var url="/nms/resetStationTraffic";
        $.ajax({
            url: "/nms/resetStationTraffic",
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

