/**
 * Created by lenovo on 2015/10/31.
 */

$(document).ready(function(){
    restart();
});
function restart(){
    $("#reboot").click(function(){
        var id = $(this).parents("tr").children("td:nth-child(1)").text();
        alert(id);
    });
};
