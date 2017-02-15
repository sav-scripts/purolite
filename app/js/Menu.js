/**
 * Created by sav on 2017/2/10.
 */
(function(){

    var $doms = {},
        _buttonDic,
        _currentFocus,
        _isMobileOpen = false,
        _alerted = false;

    var self = window.Menu =
    {
        menuHeight: 83,
        init: function()
        {
            _buttonDic = MainPage.contentDic;

            $doms.container = $('#menu');
            $doms.buttonContainer = $doms.container.find(".button-container");

            $doms.buttonBar = $doms.container.find('.button-bar');
            $doms.buttons = {};

            $doms.btns = $doms.buttonContainer.find(".btn");

            //setupButton(1, 'index');
            //setupButton(2, 'product');
            //setupButton(6, 'live');

            for(var i=1;i<=9;i++){ setupButton(i); }

            self.toContent(_buttonDic['1']);


            setupMobileButtons();

            $(window).scroll(update);

            function setupButton(index, type)
            {
                var buttonName = _buttonDic[index],
                    $btn = $doms.buttons[buttonName] = $doms.buttonContainer.find('.btn:nth-child('+index+')');

                $btn.on('mouseover', function()
                {
                    //barTo(buttonName);
                    //console.log($btn.position());
                    //console.log($btn.width());

                }).on('mouseout', function()
                {
                    //barReturn();
                }).on(_CLICK_, function()
                {
                    //self.toContent(buttonName);
                    MainPage.toContent(buttonName);
                });
            }
        },

        toContent: function(contentName)
        {
            _currentFocus = contentName;

            barTo(contentName);

            $doms.btns.toggleClass('focused', false);

            var $btn = $doms.buttons[contentName];
            $btn.toggleClass('focused', true);
        },

        update: update,

        resize: function()
        {
            self.menuHeight = parseInt($('#menu').css('height'));
        }
    };

    function update()
    {
        var factor = document.documentElement.clientHeight / (window.innerHeight || 0);
        if(factor > 1) factor = 1;

        if(!_alerted)
        {
            _alerted = true;
            //alert($('#index').offset().top + ", " + $('#index').position().top);
            //alert(factor);
        }

        //console.log($('#index')[0].getBoundingClientRect());
        //console.log($('#product')[0].getBoundingClientRect());

        if(Main.viewport.width > 640 && Main.viewport.width <= 1280)
        {
            $doms.container.css({
                'left': -$(window).scrollLeft()
            });
        }
        else
        {
            $doms.container.css({
                'left': 0
            });
        }

        var contentName,
            menuHeight = $('#menu').height() + 1;

        for(var i=1;i<=9;i++)
        {
            contentName = _buttonDic[i];
            if(_buttonDic[i+1])
            {
                var bound1 = $('#' + _buttonDic[i])[0].getBoundingClientRect(),
                    bound2 = $('#' + _buttonDic[i+1])[0].getBoundingClientRect();

                if(bound1.top >= menuHeight)
                {
                    break;
                }
                else if(bound1.top <= menuHeight && bound2.top >= menuHeight)
                {
                    break;
                }
            }
        }

        self.toContent(contentName);
        //console.log(contentName);
    }

    function setupMobileButtons()
    {
        var $container = $doms.mobileContainer = $doms.container.find('.mobile-button-container'),
            $btnContainer = $container.find(".buttons"),
            $btnOpen = $doms.container.find(".mobile-btn-open");

        $btnOpen.on(_CLICK_, function()
        {
            _isMobileOpen? mobileClose(): mobileOpen();
        });

        for(var i=1;i<=9;i++){ setupButton(i); }

        $container.on(_CLICK_, function(event)
        {
            if(event.target == $container[0]) mobileClose();
        });

        $container.css('display', 'block').css('visibility', 'hidden');

        function setupButton(index)
        {
            var buttonName = _buttonDic[index],
                $btn = $btnContainer.find('.btn:nth-child('+index+')');

            $btn.on(_CLICK_, function()
            {
                MainPage.toContent(buttonName);
                mobileClose();
            });
        }
    }

    function mobileOpen()
    {
        if(_isMobileOpen) return;
        _isMobileOpen = true;

        $doms.mobileContainer.css('visibility', 'visible');
    }

    function mobileClose()
    {
        if(!_isMobileOpen) return;
        _isMobileOpen = false;

        $doms.mobileContainer.css('visibility', 'hidden');
    }

    function barTo(buttonName)
    {
        var $btn = $doms.buttons[buttonName];

        var left = $btn.position().left,
            width = $btn.width();

        TweenMax.to($doms.buttonBar,.5, {left: left, width: width, ease:Power3.easeOut});
    }

}());