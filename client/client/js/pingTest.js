/**
 * Created by lenovo on 2015/10/8.
 */
/**
 * Created by lenovo on 2014/12/16.
 */
$('document').ready(function(){
    init();
});
//是否全屏标志
var screenFlag = 0;
function init(){
    var url="/nms/getState";
    $.get(url,function(data){
        createTable(data);
    });
    fullScreen();
    setInterval("ajax_data()",2000);
    getInterfaceState();
    reverseInterface()
//    var data = [{"cnname":"changchun","gateway":"2.331","switcher":"232","host":"Down"},{"cnname":"changchun","gateway":"231","switcher":"232","host":"Down"}];
//    createTable(data);

}
//获取接口状态信息
function getInterfaceState(){
    var url="/nms/getInterface";
    $.get(url,function(data){
        var interfaceState = JSON.parse(data);
        var stat= "";
        var warn= false;

        if (interfaceState.main == 'Up') {
            stat = '禁用主用接口';
        } else if (interfaceState.main == 'Down') {
            stat = '启用主用接口';
            warn = true;
        } else {
            stat = $("#mainInterface").val();
        }

        $("#mainInterface").val(stat);
        if(warn) {
            $("#mainInterface").css('color','red');
            $("#mainInterface").css('font-weight','bold');
        } else {
            $("#mainInterface").css('color','black');
            $("#mainInterface").css('font-weight','normal');
        }

        if (interfaceState.backup == 'Up') {
            warn = false;
            stat = '禁用备用接口';
        } else if (interfaceState.backup == 'Down') {
            warn = true;
            stat = '启用备用接口';
        } else {
            stat = $("#backupInterface").val();
        }

        $("#backupInterface").val(stat);
        if(warn) {
            $("#backupInterface").css('color','red');
            $("#backupInterface").css('font-weight','bold');
        } else {
            $("#backupInterface").css('color','black');
            $("#backupInterface").css('font-weight','normal');
        }
    })
}
//控制接口up，down状态
function reverseInterface() {
    $("#mainInterface").click(function() {
        var stat = {};
        if ($("#mainInterface").val() == "禁用主用接口")
            stat = {"main":"down"}
        else if ($("#mainInterface").val() == "启用主用接口")
            stat = {"main":"up"};

        var url = "/nms/setInterface";
        $.post(url, stat);
    });

    $("#backupInterface").click(function() {
        var stat = {};
        if ($("#backupInterface").val() == "禁用备用接口")
            stat = {"backup":"down"};
        else if ($("#backupInterface").val() == "启用备用接口")
            stat = {"backup":"up"};

        var url = "/nms/setInterface";
        $.post(url, stat);
    });
}
//初始化表格
function createTable(data){
    var jsonArray = JSON.parse(data);
    var length = jsonArray.length;
    for(var i =0 ;i<length;i++) {
        var rowTemplate = "<tr id=" + i + "><td class='city'><a href=/nms/stationState?station=%s>%s</a></td><td class='main'>%s</td><td class='backup1'>%s</td>"
            + "<td class='backup2'>%s</td><td class='mirror'>%s</td></tr>";
        var row = sprintf(rowTemplate, jsonArray[i].city, jsonArray[i].city, jsonArray[i].main, jsonArray[i].backup1, jsonArray[i].backup2, jsonArray[i].mirror);
        $("#state").append($(row));
    }
    replaceTr($("#state"));
    setCss();
}
//轮询状态信息和接口信息
function ajax_data(){
    var url="/nms/getState";
    $.get(url,function(data)
    {
        var jsonArray = JSON.parse(data);
        var length = jsonArray.length;
        for(var i = 0;i<length;i++){
            for(var k in jsonArray[i]){
                if(k == "city"){
                    $('#'+i).children('.'+k).text("<a href=/nms/stationState?station=" + jsonArray[i][k] + ">" + jsonArray[i][k] + "</a>");
                }
                $('#'+i).children('.'+k).text(jsonArray[i][k]);
            }
        }
        replaceTr($("#state"));
    });
    getInterfaceState();
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
