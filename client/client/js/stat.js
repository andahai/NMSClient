/**
 * Created by lenovo on 2014/12/16.
 */
$('document').ready(function(){
    init();
});
//是否全屏标志
var screenFlag = 0;
function init(){
    var url="/nms/getGatexState";
    $.get(url,function(data){
        createTable(data);
    });
    fullScreen();
    getLocalStation();
    setInterval("ajax_data()",2000);
}
//初始化表格
function createTable(data){
    var jsonArray = JSON.parse(data);
    var length = jsonArray.length;
    for(var i =0 ;i<length;i++) {
        var rowTemplate = "<tr id=" + i + "><td class='city'>%s</td><td class='main'>%s</td><td class='backup1'>%s</td>"
            + "<td class='backup2'>%s</td></tr>";
        var row = sprintf(rowTemplate, jsonArray[i].city, jsonArray[i].main, jsonArray[i].backup1, jsonArray[i].backup2);
        $("#state").append($(row));
    }
    replaceTr($("#state"));
    setCss();
}
//轮询状态信息和接口信息
function ajax_data(){
    var url="/nms/getGatexState";
    $.get(url,function(data)
    {
        var jsonArray = JSON.parse(data);
        var length = jsonArray.length;
        for(var i = 0;i<length;i++){
            for(var k in jsonArray[i]){
                $('#' + i).children('.' + k).text(jsonArray[i][k]);
            }
        }
        replaceTr($("#state"));
    });
}
//DOWN进行警告
function replaceTr(trobj)
{
    trobj.find("td, th").each(
        function(){
            var text_ = $(this).text();
            var RED_WORD="断开";
            var RED_WORD1 = "DOWN";
            var GREEN_WORD="up";
            if (text_ == RED_WORD || text_ == RED_WORD1)
            {
                var span = $("<span></span>").css('color', 'white')
                    .css('background-color', 'red')
                    .css('font-weight', 'bold')
                    .css('padding', '2px 1px');
                span.text('断开');
                $( this ).empty().html(span);
            }
        }
    );
}
//添加偶数行背景
function setCss(){
    $("#state tr:odd").css("background-color","#F3F3F3");
}
//数字保留一位小数点
function judge(str){
    if(str > 0 && str <= 100000){
        var num = new Number(str);
        return num.toFixed(1);
    }
    else if(str == 0){
        return "";
    }
    else
        return str;
}
//全屏
function fullScreen(){
    $('#fullScreen').click(
        function(){
            if(screenFlag == 0) {
                $('#header').css("display", "none");
                $('#menu').css('display', 'none');
                $('#content').css('background-color', 'white');
                $('#fullState').addClass('fullScreen');
                screenFlag = 1;
                $('#fullScreen').attr("value","退出全屏");
                return;
            }
            if(screenFlag == 1){
                $('#header').css("display", "block");
                $('#menu').css('display', 'block');
                $('#content').css('background-color', '#0052A4');
                $('#fullState').removeClass('fullScreen');
                screenFlag = 0;
                $('#fullScreen').attr("value","全屏显示");
                return;
            }
        }
    );
}
//getLocalStation
function getLocalStation(){
    var url="/nms/getLocalStationName";
    $.get(url,function(data) {
        var jsonData = JSON.parse(data);
        $("#localStation").text(jsonData.localStationName);
    });
}
