/**
 * Created by sav on 2017/2/12.
 */
(function(){

    var IMG_PATH = './img/upload/articles/',
        NEWS_PATH = './papi/view/',
        ATTACHMENT_PATH = '../files/upload/articles/';

    var $doms = {},
        $newsBlockList,
        _newsData;

    var BLOCK_WIDTH,
        CONTAINER_WIDTH,
        _numColumns,
        _wGap,
        _startX,
        _hGap,
        _totalBottom = 0,
        _screenWidth = null,
        _inMobileMode = false,
        _needUpdate = false;

    var self = window.News =
    {
        _isOpen: false,

        init: function($container)
        {
            if(Main.settings.isLocal)
            {
                IMG_PATH = 'http://trader99.com/img/upload/articles/';
                NEWS_PATH = 'http://trader99.com/purolite/papi/view/';
                ATTACHMENT_PATH = 'http://www.trader99.com/files/upload/articles/';
            }

            $doms.container = $container;

            $doms.newsContainer = $doms.container.find(".news-container");
            $doms.newsSample = $doms.container.find(".news-block");

            $doms.newsMore = $doms.container.find(".news-more");
            TweenMax.set($doms.newsMore, {autoAlpha:0});

            $doms.newsMoreBtn = $doms.newsMore.find(".btn").on(_CLICK_, function()
            {
                if(!self._isOpen)
                {
                    self._isOpen = true;
                    open();
                }
            });

            $doms.newsSample.detach();

            self.resize();

            ApiProxy.callApi('papi/', {}, 'papi/', 'json', function(response)
            {
                _newsData = response;
                $newsBlockList = [];

                createNews(0);
            });
        },

        resize: function()
        {
            var oldScreenWidth = _screenWidth,
                oldInMobileMode = _inMobileMode;

            _screenWidth = Main.viewport.width;
            _inMobileMode = _screenWidth <= 640;

            if(oldScreenWidth === null)
            {
                _needUpdate = false;
            }
            else
            {
                _needUpdate = (_inMobileMode != oldInMobileMode);
            }


            if(_inMobileMode)
            {
                BLOCK_WIDTH = 552;
                _wGap = 30;
                CONTAINER_WIDTH = 640;
            }
            else
            {
                BLOCK_WIDTH = 240;
                _wGap = 30;
                CONTAINER_WIDTH = 1280;
            }

            _numColumns = parseInt(CONTAINER_WIDTH / (BLOCK_WIDTH + _wGap));

            _startX = (CONTAINER_WIDTH - (_numColumns * (BLOCK_WIDTH + _wGap))) * .5 + (_wGap * .5);

            //_wGap = (CONTAINER_WIDTH - (BLOCK_WIDTH*_numColumns)) / (_numColumns*2 + 1);
            _hGap = 30;

            if(!self._isOpen)
            {
                $doms.container.height(Main.viewport.height);
            }

            if(_needUpdate)
            {
                _totalBottom = 0;
                repositionBlocks();
                if(self._isOpen) open();
            }
        }
    };

    function open()
    {
        TweenMax.to($doms.newsMore,.8, {autoAlpha: 0, onComplete: function()
        {
            $doms.newsMore.detach();
        }});

        var newHeight = _totalBottom + parseInt($doms.newsContainer.css('top')) + 100;
        TweenMax.to($doms.container,.7,{height:newHeight+'px'});
    }


    function createNews(index)
    {
        //console.log(_newsData);
        //console.log(_newsData.length);
        if(index >= _newsData.length)
        {
            TweenMax.to($doms.newsMore,.5, {autoAlpha: 1});

            return;
        }

        var newsData = _newsData[index].Article;

        //console.log(newsData);

        var $newsBlock = $doms.newsSample.clone();

        $doms.newsContainer.append($newsBlock);

        var $thumb = $newsBlock.find(".thumb"),
            $title = $newsBlock.find(".title"),
            $description = $newsBlock.find(".description"),
            $more = $newsBlock.find(".more");

        var isAttachment = (newsData.attachment && newsData.attachment != 'null');

        var thumbUrl = IMG_PATH + newsData.path + newsData.pic,
            attachmentUrl = isAttachment? ATTACHMENT_PATH + newsData.path + newsData.attachment: null;

        //$more.find("a")[0].href = NEWS_PATH + newsData.id;

        $more.on(_CLICK_, function()
        {
           NewsPopup.show(NEWS_PATH, thumbUrl, attachmentUrl, newsData.id);
        });

        //console.log(thumbUrl);

        TweenMax.set($newsBlock, {autoAlpha:0});

        $title.text(newsData.created);
        $description.text(newsData.title);

        var img = new Image;
        img.onload = function()
        {
            createIt();
        };

        img.onerror = function()
        {
            createIt();
        };

        img.src = thumbUrl;

        function createIt()
        {
            $newsBlock._img = img;
            $newsBlock._$thumb = $thumb;

            //var thumbWidth = $newsBlock._$thumb.width(),
            //    thumbHeight = $newsBlock._img.height / $newsBlock._img.width * thumbWidth;
            //
            //$newsBlock._$thumb.height(thumbHeight);

            $thumb.css('background-image', 'url('+thumbUrl+')').css('background-size', 'cover');

            $newsBlock._index = index;
            $newsBlockList[index] = $newsBlock;

            positionBlock($newsBlock);

            TweenMax.to($newsBlock,.5, {autoAlpha:1});

            createNews(index+1);
        }
    }

    function repositionBlocks()
    {
        var i;

        for(i=0;i<$newsBlockList.length;i++)
        {
            positionBlock($newsBlockList[i]);
        }
    }

    function positionBlock($newsBlock)
    {
        var thumbWidth = $newsBlock._$thumb.width(),
            thumbHeight = $newsBlock._img.height / $newsBlock._img.width * thumbWidth;

        $newsBlock._$thumb.height(thumbHeight);

        var index = $newsBlock._index,
            columnIndex = index % _numColumns,
            y = 0;

        if(index-_numColumns >= 0)
        {
            var $topBlock = $newsBlockList[index-_numColumns];
            y = $topBlock._bottom;
        }

        $newsBlock.css({
            'position': 'absolute',
            'left': _startX + (_wGap+BLOCK_WIDTH)*columnIndex,
            'top': y
        });

        $newsBlock._bottom = y + $newsBlock.height() + _hGap;

        _totalBottom = Math.max($newsBlock._bottom, _totalBottom);

    }

}());