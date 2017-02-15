/**
 * Created by sav on 2017/2/10.
 */
(function(){

    var $doms = {},
        _tweenDic =
        {
            scrollTop:0
        };

    window.MainPage =
    {
        contentDic:
        {
            1: 'index',
            2: 'product',
            3: 'industry',
            4: 'apply',
            5: 'brand',
            6: 'live',
            7: 'about',
            8: 'news',
            9: 'concat'
        },
        init: function()
        {
            $doms.container = $('#main-page');

            cycleBackgrounds($doms.container.find("#index"), 2);
            cycleBackgrounds($doms.container.find("#live"), 2);

            News.init($doms.container.find('#news'));
            NewsPopup.init();

            _tweenDic.scrollTop = $(window).scrollTop();

            $doms.selectLists = $doms.container.find(".select-list");

            $doms.selectLists.on('change', function($d)
            {
                var url = $(this)[0].value;
                //if(url) window.open(url, '_blank');
                if(url) window.open(url, '_self');
            });

            $doms.contents = $doms.container.find('.main-content');

            setupConcatForm();
        },
        toContent: function(contentName)
        {
            _tweenDic.scrollTop = $(window).scrollTop();

            var $content = $doms.container.find('#' + contentName);
            var target = $content.offset().top - Menu.menuHeight;

            var speed = 600,
                dy = Math.abs(target - _tweenDic.scrollTop),
                duration = Math.min(.8, dy/speed);

            TweenMax.to(_tweenDic,duration, {scrollTop: target, onUpdate: function()
            {
                window.scrollTo($(window).scrollLeft(), _tweenDic.scrollTop);
            }});

            //TweenMax.to(window,.5, {scrollTop:target});

            //window.scrollTo($(window).scrollLeft(), target);
        },
        resize: function()
        {
            //console.log($(document).height());

            //$doms.contents.height(Main.viewport.height - Menu.menuHeight);

            //console.log('window width = ' + Main.viewport.width + ", body width = " + $('body').width());
            //console.log(document.documentElement.clientWidth + ", " + (window.innerWidth || 0));


            if(Main.viewport.width <= 640)
            {
                $doms.contents.css('height', '');
            }
            else
            {
                var factor = document.documentElement.clientWidth / (window.innerWidth || 0);
                if(factor > 1) factor = 1;

                $doms.contents.height(Main.viewport.height/factor - Menu.menuHeight);
            }

            //$doms.contents.height(Main.viewport.height);

            News.resize();
        }
    };

    function setupConcatForm()
    {
        $doms.concat = $doms.container.find("#concat");

        $doms.fields =
        {
            name: $doms.concat.find(".field-name"),
            phone: $doms.concat.find(".field-phone"),
            email: $doms.concat.find(".field-email"),
            company: $doms.concat.find(".field-company"),
            title: $doms.concat.find(".field-title"),
            content: $doms.concat.find(".field-content")
        };

        $doms.concat.find(".btn-send").on(_CLICK_, function()
        {
            Loading.progress('empty').show();

            trySend();
        });
    }

    function trySend()
    {
        var formObj = checkForm();

        if(formObj)
        {
            ApiProxy.callApi("message/add", formObj, "message/add", 'text', function(response)
            {
                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    if(response == 'OK')
                    {
                        alert('您的需求已成功送出');
                        clearForm();
                    }
                    else
                    {
                        alert('表單送交失敗');
                    }
                }
                Loading.hide();
            });
        }
        else
        {
            Loading.hide();
        }
    }

    function clearForm()
    {
        for(var key in $doms.fields)
        {
            var $field = $doms.fields[key];
            $field[0].value = '';
        }
    }

    function checkForm()
    {
        var formObj={};
        var dom;

        dom = $doms.fields.name[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入您的名稱'); dom.focus(); return;
        }else formObj.name = dom.value;

        dom = $doms.fields.phone[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入您的聯繫電話'); dom.focus(); return;
        }else formObj.tel = dom.value;

        dom = $doms.fields.email[0];
        if(!PatternSamples.email.test(dom.value))
        {
            alert('請輸入您的電子郵件信箱'); dom.focus(); return;
        }
        else formObj.email = dom.value;

        dom = $doms.fields.company[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入公司名稱'); dom.focus(); return;
        }else formObj.company = dom.value;

        dom = $doms.fields.title[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入詢問主旨'); dom.focus(); return;
        }else formObj.title = dom.value;

        dom = $doms.fields.content[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入內容'); dom.focus(); return;
        }else formObj.content = dom.value;

        return formObj;

    }

    function cycleBackgrounds($container, numBackgrounds)
    {
        var i,
            $buttonContainer = $container.find('.dot-button-container'),
            isPlaying = false,
            currentIndex = 1;

        for(i=1;i<=numBackgrounds;i++)
        {
            setupButton(i);

        }

        updateBtns();

        var tl = $container.bgCycleTimer = new TimelineMax();

        tl.add(function()
        {
            var newIndex = currentIndex+1;
            if(newIndex > numBackgrounds)
            {
                newIndex = 1;
            }
            toIndex(newIndex);
        }, 5);

        function setupButton(i)
        {
            var $bg,
                $btn;

            $bg = $container.find('.bg-' + i);
            $btn = $buttonContainer.find(".btn:nth-child("+i+")");

            if(i != currentIndex)
            {
                $bg.css({
                    'display': 'none',
                    'left': '100%'
                });
            }

            $btn.on(_CLICK_, function()
            {
                if(!isPlaying) toIndex(i);
            })
        }

        function toIndex(index)
        {
            if(currentIndex != index)
            {
                var $oldBg = $container.find('.bg-' + currentIndex),
                    $newBg = $container.find('.bg-' + index);

                isPlaying = true;

                var tl = new TimelineMax;
                tl.set($newBg, {left:'100%', display:'block'});
                tl.to($newBg,.7, {left: 0, ease:Power1.easeInOut}, 0);
                tl.to($oldBg,.7, {left: '-100%', ease:Power1.easeInOut}, 0);
                tl.set($oldBg, {display:'none'});
                tl.add(function()
                {
                    isPlaying = false;
                });

                currentIndex = index;
                updateBtns();
                $container.bgCycleTimer.restart();
            }
        }

        function updateBtns()
        {
            for(var i=1;i<=numBackgrounds;i++)
            {
                var $btn = $buttonContainer.find(".btn:nth-child("+i+")");
                $btn.toggleClass('focused', i == currentIndex);
            }
        }
    }

}());