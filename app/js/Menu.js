/**
 * Created by sav on 2017/2/10.
 */
(function(){

    var $doms = {},
        _buttonDic,
        _currentFocus,
        _isMobileOpen = false;

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

            //setupButton(1, 'index');
            //setupButton(2, 'product');
            //setupButton(6, 'live');

            for(var i=1;i<=9;i++){ setupButton(i); }

            self.toContent(_buttonDic['1']);

            $(window).scroll(function(){
                $doms.container.css({
                    'left': -$(this).scrollLeft()
                });
            });

            setupMobileButtons();

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
                    barReturn();
                }).on(_CLICK_, function()
                {
                    self.toContent(buttonName);
                    MainPage.toContent(buttonName);
                });
            }
        },

        toContent: function(contentName)
        {
            var oldFocus = _currentFocus;

            _currentFocus = contentName;

            barTo(contentName);

            var $btn = $doms.buttons[contentName];
            $btn.toggleClass('focused', true);

            if(oldFocus)
            {
                var $oldBtn = $doms.buttons[oldFocus];
                $oldBtn.toggleClass('focused', false);
            }
        },

        resize: function()
        {
            self.menuHeight = parseInt($('#menu').css('height'));
        }
    };

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

        $container.css('visibility', 'hidden');

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


    function barReturn()
    {
        barTo(_currentFocus);
    }

    function barTo(buttonName)
    {
        var $btn = $doms.buttons[buttonName];

        var left = $btn.position().left,
            width = $btn.width();

        TweenMax.to($doms.buttonBar,.5, {left: left, width: width, ease:Power3.easeOut});
    }

}());