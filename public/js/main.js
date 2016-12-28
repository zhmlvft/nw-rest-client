var rest = require('restler');
$(function(){
    // $('#methodGet').click(function(){
    //     $('#req_contentType').hide();
    // });
    // $('#methodPost').click(function(){
    //     $('#req_contentType').show();
    // });
    // $('#methodPut').click(function(){
    //     $('#req_contentType').show();
    // });
    // $('#methodDelete').click(function(){
    //     $('#req_contentType').show();
    // });
    $('#goBtn').click(function(){
        //设置请求头
        var req_headers = JSON.parse($('#req_headers').val());
        var options = {headers:{req_headers}}
        options.method = $('input[name=req_method]:checked').val();
        //设置超时时间 10秒
        options.timeout=10000;
        //设置 http basic 认证信息
        var username = $.trim($('#username').val());
        var password = $.trim($('#password').val());
        if(username!=""){
            options.username=username;
            options.password=password;
        }
        //获取url
        var url = $('#inputUrl').val();
        rest.request(url,options).on("timeout",function(ms){
            //输出超时信息
            $('#res_body').removeClass().addClass("hljs").html("<h2 style='color:red'>连接超时，请检查网络和地址是否可用</h2>");
        }).on('complete', function(data,response) {
            var headers = response.headers;
            if(headers["content-type"]){
                if(headers["content-type"].indexOf('application/json')!=-1){
                    //json
                    if(typeof data === 'string'){
                        data = JSON.parse(data);
                    }
                    $('#res_body').removeClass().addClass("hljs json").text(JSON.stringify(data,undefined,2));
                }else if(headers["content-type"].indexOf('text/xml')!=-1){
                    //xml
                    $('#res_body').removeClass().addClass("hljs xml").text(data);
                }else{
                    //其他
                    $('#res_body').removeClass().addClass("hljs").text(data);
                }
            }else{
                //输出错误码
                $('#res_body').removeClass().addClass("hljs").text("Response status: "+response.statusCode);
            }
            //高亮
            hljs.highlightBlock($('#res_body')[0]);
            $('#res_headers').text(JSON.stringify(response.headers,undefined,2));
            hljs.highlightBlock($('#res_headers')[0]);
        });
    })
});