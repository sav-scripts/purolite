/**
 * Created by sav on 2017/2/13.
 */
(function(){

    var $doms = {},
        _attachmentUrl;

    var self = window.NewsPopup =
    {
        init: function()
        {
            $doms.container = $('#news-popup');

            $doms.thumb = $doms.container.find(".thumb");
            $doms.title = $doms.container.find(".title");
            $doms.time = $doms.container.find(".time");
            $doms.detail = $doms.container.find(".detail");

            $doms.btnClose = $doms.container.find(".btn-close").on(_CLICK_, function()
            {
                self.hide();
            });

            $doms.btnDownload = $doms.container.find(".pdf-download").on(_CLICK_, function()
            {
                console.log(_attachmentUrl);
                window.open(_attachmentUrl, '_blank');
            });


            $doms.container.css('visibility', 'visible').detach();
        },

        show: function(apiPath, thumbUrl, attachmentUrl, newsId)
        {
            var url = apiPath + newsId;

            _attachmentUrl = attachmentUrl;

            $doms.btnDownload.css('display', _attachmentUrl? 'block': 'none');

            Loading.progress('empty').show();

            ApiProxy.callApi(url, {}, 'papi/view/', 'json', function(response)
            {
                //console.log(response);

                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    $doms.title.text(response.Article.title);
                    $doms.time.text(response.Article.created);

                    $doms.thumb.css({
                        'background': 'url('+thumbUrl+')',
                        'background-position': 'center center',
                        'background-size': 'cover'
                    });

                    $doms.detail.html(response.ArticleText.content);

                    $('body').toggleClass('unscrollable', true).append($doms.container);

                    var tl = new TimelineMax;
                    tl.set($doms.container, {autoAlpha:0});
                    tl.to($doms.container,.4, {autoAlpha:1});
                }

                Loading.hide();
            })
        },

        hide: function()
        {
            $('body').toggleClass('unscrollable', false);

            var tl = new TimelineMax;
            tl.to($doms.container,.4,{autoAlpha:0});
            tl.add(function()
            {
                $doms.container.detach();
            });
        },

        resize: function()
        {

        }
    };

}());