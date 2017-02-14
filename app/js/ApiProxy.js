/**
 * Created by sav on 2016/7/22.
 */
(function(){

    var _papi = '[{"Article":{"id":"8","tag_id":null,"member_id":null,"latest_comment_id":null,"user_id":"1","type":"news","state":"published","selected":null,"created":"2017-01-17 11:01:38","updated":"2017-02-10 05:56:05","published":"2017-01-17 10:59:25","cancelled":null,"replied":null,"title":"\u9913\u9913\u9913\u9913\u9913","summary":"","viewed":"2017-02-10","daily_view_num":"2","weekly_view_num":"4","monthly_view_num":"4","view_num":"4","like_num":"0","order":"0","path":"2017\/01\/","pic":"14846509230d.jpg","attachment":"15107442_10154868356042573_8599540199298584408_n.jpg"}},{"Article":{"id":"6","tag_id":null,"member_id":null,"latest_comment_id":null,"user_id":"1","type":"news","state":"published","selected":null,"created":"2017-01-17 04:08:49","updated":"2017-02-09 10:02:28","published":"2017-01-17 04:08:33","cancelled":null,"replied":null,"title":"\u6e2c\u8a66\uff18\uff16\uff16\uff16\uff16\uff16","summary":"","viewed":"2017-02-09","daily_view_num":"4","weekly_view_num":"6","monthly_view_num":"6","view_num":"6","like_num":"0","order":"0","path":"2017\/01\/","pic":"1484626199ad.jpg","attachment":null}},{"Article":{"id":"5","tag_id":null,"member_id":null,"latest_comment_id":null,"user_id":"1","type":"news","state":"published","selected":null,"created":"2017-01-17 04:08:15","updated":"2017-01-17 04:08:15","published":"2017-01-17 04:06:38","cancelled":null,"replied":null,"title":"\u6e2c\u8a66\u4e00\u4e0b","summary":"","viewed":null,"daily_view_num":null,"weekly_view_num":null,"monthly_view_num":null,"view_num":"0","like_num":"0","order":"0","path":"2017\/01\/","pic":"148462609594.jpg","attachment":null}},{"Article":{"id":"4","tag_id":null,"member_id":null,"latest_comment_id":null,"user_id":"1","type":"news","state":"published","selected":null,"created":"2017-01-17 04:05:27","updated":"2017-02-09 10:00:49","published":"2017-01-17 04:04:19","cancelled":null,"replied":null,"title":"\u6e2c\u8a66\u6e2c\u8a66","summary":"","viewed":"2017-02-09","daily_view_num":"9","weekly_view_num":"12","monthly_view_num":"12","view_num":"12","like_num":"0","order":"0","path":"2017\/01\/","pic":"148462592713.jpg","attachment":null}},{"Article":{"id":"3","tag_id":null,"member_id":null,"latest_comment_id":null,"user_id":"1","type":"news","state":"published","selected":null,"created":"2016-12-01 00:42:24","updated":"2017-02-09 10:01:16","published":"2016-12-01 00:41:04","cancelled":null,"replied":null,"title":"CAKE","summary":" \u86cb\u7cd5","viewed":"2017-02-09","daily_view_num":"4","weekly_view_num":"10","monthly_view_num":"16","view_num":"16","like_num":"0","order":"0","path":"2016\/12\/","pic":"14805529443e.jpg","attachment":"square-up-to-woocommerce-inventory-import-ninjas.zip"}},{"Article":{"id":"2","tag_id":null,"member_id":null,"latest_comment_id":null,"user_id":"1","type":"news","state":"published","selected":null,"created":"2016-01-08 11:51:32","updated":"2017-02-09 11:04:17","published":"2016-01-08 11:51:13","cancelled":null,"replied":null,"title":"purolite","summary":"purolite","viewed":"2017-02-09","daily_view_num":"4","weekly_view_num":"19","monthly_view_num":"11","view_num":"33","like_num":"0","order":"0","path":"2016\/01\/","pic":"148462570170.jpg","attachment":"1512B0000455_V1.pdf"}}]';
    var _papiView = '{"Article":{"id":"8","tag_id":null,"member_id":null,"latest_comment_id":null,"user_id":"1","type":"news","state":"published","selected":null,"created":"2017-01-17 11:01:38","updated":"2017-02-13 08:17:49","published":"2017-01-17 10:59:25","cancelled":null,"replied":null,"title":"餓餓餓餓餓","summary":"","viewed":"2017-02-13 08:18:52","daily_view_num":3,"weekly_view_num":3,"monthly_view_num":9,"view_num":9,"like_num":"0","order":"0","path":"2017/01/","pic":"14846509230d.jpg","attachment":"15107442_10154868356042573_8599540199298584408_n.jpg"},"ArticleText":{"id":"8","keywords":"","description":"","content":"<p>請問有人知道上週華山new balance 247活動是哪家代理商嗎?</p>\\r\\n"}}';

    //console.log(JSON.parse('{"v":"<p>請問有人知道上週華山new balance 247活動是哪家代理商嗎?</p>\\r\\n"}'));
    //console.log(JSON.parse(String(_papiView)));
    //console.log($.parseJSON('{"content":"\u003Cp\u003Epurolitepurolitepurolite\u003C\/p\u003E\r\n"}'));

    var _fakeData =
    {
        "papi/": JSON.parse(_papi),
        "papi/view/": JSON.parse(_papiView),
        "message/add": "OK"
    };

    var _apiExtension = "",
        _apiPath = "./";

    window.ApiProxy =
    {
        callApi: function(apiName, params, fakeDataName, dataType, cb)
        {


            if(Main.settings.useFakeData && fakeDataName)
            {
                if(fakeDataName === true) fakeDataName = apiName;

                var response = _fakeData[fakeDataName];

                complete(response);
            }
            else
            {
                var apiUrl = _apiPath + apiName + _apiExtension,
                    method = "POST";

                $.ajax
                ({
                    url: apiUrl,
                    type: method,
                    data: params,
                    dataType: dataType
                })
                .done(complete)
                .fail(function ()
                {
                    //alert("無法取得伺服器回應");
                    complete({error:"無法取得伺服器回應"});
                });
            }

            function complete(response)
            {
                if(cb) cb.call(null, response);
            }
        }
    };

}());