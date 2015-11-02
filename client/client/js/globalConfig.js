/**
 * Created by lenovo on 2015/1/18.
 */
$(document).ready(function(){
    var url="/nms/getGlobalConfig";
    $.get(url,function(data){
        createTable(data);
    });

});
function createTable(data){
    var jsonMap = JSON.parse(data);
    var rowTemplate = "<tr><td>%s</td><td><input type='text' name=%s value=%s></td></tr>";
    $.each(jsonMap,function(name,value){
        var cnname;
        switch(name){
            case "version":
                cnname = "VERSION";
                break;
            case "multi_thread":
                cnname = "MULTI-THREAD";
                break;
            case "tunnel_nodelay":
                cnname = "TUNNEL-NODELAY";
                break;
            case "normal_dup_time":
                cnname = "NORMAL-DUP-TIME";
                break;
            case "id_mutex_time":
                cnname = "ID-MUTEX-TIME";
                break;
            case "max_flow_age":
                cnname = "MAX-FLOW-AGE";
                break;
            case "clean_time":
                cnname = "CLEAN-TIME";
                break;
            case "keepalive_time":
                cnname = "KEEPALIVE-TIME";
                break;
            case "bridge":
                cnname = "BRIDGE";
                break;
            default :
                break;

        }
        var row = sprintf(rowTemplate,cnname,name,value);
        $('#globalConfig').append($(row));
    });
}
