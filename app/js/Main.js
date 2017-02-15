(function(){

    "use strict";
    var self = window.Main =
    {
        settings:
        {
            isiOS: false,
            isLocal: false,
            useFakeData: false
        },
        viewport:
        {
            width:0,
            height: 0
        },

        init: function()
        {
            window.Loading = SquareLoading;


            if( window.location.host == "local.savorks.com" || window.location.host == "socket.savorks.com")
            {
                Main.settings.isLocal = true;
            }

            if(Main.settings.isLocal || Utility.urlParams.usefakedata == '1') Main.settings.useFakeData = true;

            ScalableContent.init([640, 1920, 1920]);
            ScalableContent.enableFixFullImage = false;
            ScalableContent.enableDrawBounds = false;

            self.settings.isiOS = Utility.isiOS();

            //window._CLICK_ = (self.settings.isiOS)? "touchend": "click";
            window._CLICK_ = (self.settings.isiOS)? "touchstart": "click";
            //window._CLICK_ = (self.settings.isiOS)? "mouseup": "click";

            self.viewport.width = $(window).width();
            self.viewport.height = $(window).height();

            Menu.init();
            MainPage.init();


            /*
            $.ajax(
            {
                url:'./message/add/',
                'method': 'post',
                data:
                {
                    redirect:'/',
                    data:{Message: {
                        'name': 'from script',
                        'email': 'test@ddd.ccc',
                        'company': 'test company',
                        'tel': '0955666555',
                        'title': 'sdfsdf',
                        'content': 'sdfsdfdsf'
                    }}
                }
            })
            .done(function(data)
            {
                console.log(data);
                //console.log(JSON.parse(data));
                //var newsData = JSON.parse(data);
                //console.log(newsData);
            })
            .fail(function()
            {
                console.log('fail');
            });
            */

            $(window).on("resize", onResize);
            onResize();
        }
    };

    function onResize()
    {
        var width = $(window).width(),
            height = $(window).height();

        self.viewport.width = width;
        self.viewport.height = height;

        Menu.resize();
        MainPage.resize();
        Menu.update();


        //ScalableContent.updateView(1280, height);

        //ScalableContent.updateView(Math.max(1280, width), height);
        ScalableContent.updateView(width, height);
        ScalableContent.updateResizeAble();
    }

}());
