import '../css/base.less';
import '../css/index.less';
let BScroll = require('better-scroll')
let api = require('../api/api.js')
let joketemplate = require('../template/joke.string')
let pictemplate = require('../template/pic.string')
let guessTypetemplate = require('../template/guessType.string')
let guesstemplate = require('../template/guess.string')
window.onload = function () {
    let download = document.querySelector('#download');
    let liArr = document.querySelectorAll('.nav-item');
    let liArrWidth = liArr[1].clientWidth;
    let line = document.querySelector('.move-line');
    let lineWidth = line.clientWidth;
    let contentBox = document.querySelector('#content-box')
    let contentItemJoke = document.querySelector('.content-item-joke');
    let contentItemPic = document.querySelector('.content-item-pic');
    let contentItemGuess = document.querySelector('.content-item-guess');
    let contentUl = document.querySelector('.content-ul');
    let contentPic = document.querySelector('.content-pic');
    let contentGuess = document.querySelector('.content-guess');
    let more = document.querySelector('#more')
    let moreIndex = 0
    let typeId = ''
    let enterGuess = 0
    // 判断是安卓还是ios
    let androidOrIphone = navigator.userAgent.toLowerCase();
    download.onclick = function (event) {
        event = event || window.event
        if (/iphone|ipad|ipod/.test(androidOrIphone)) {
            alert('对不起，我们暂时只有安卓的app')
            event.preventDefault();
        } else if (/android/.test(androidOrIphone)) {

        } else if (/window/.test(androidOrIphone)) {

        }
    }
    // nav区
    // 再次点击不会加载
    var jokedata = 1;
    var picdata = 1;
    var guessdata = 1;
    line.style.width = liArrWidth + 'px'
    // 先加载笑话
    jokeBegin()
    for (let i = 0; i < liArr.length; i++) {
        // 自适应字体
        api.fontSlef(liArr[i], 30)
        liArr[i].onclick = function () {
            let index = liArr[i].dataset.index
            if (index == 0) {
                moreIndex = 0
                // 再次点击不会加载
                if (jokedata == 1) {
                    jokeBegin()

                }
                line.style.marginLeft = '10px'
                contentBox.style.transform = 'translateX(0)'
            } else if (index == 1) {
                moreIndex = 1
                // 再次点击不会加载
                if (picdata == 1) {
                    picBagin()

                }
                line.style.marginLeft = '2px'
                contentBox.style.transform = 'translateX(-33.3%)'
            } else if (index == 2) {
                moreIndex = 2
                // 再次点击不会加载
                if (guessdata == 1) {
                    guessBagin()
                }
                line.style.marginLeft = 0
                contentBox.style.transform = 'translateX(-66.6%)'
            }
            for (let a = 0; a < liArr.length; a++) {
                liArr[a].classList.remove('active')
            }
            liArr[i].classList.add('active')

            line.style.left = lineWidth * index + 'px'
        }

    }
    // 笑话区
    function jokeBegin() {
        api.getJoke(api.pages('笑话').oldpage).then((res) => {
            jokedata = res.showapi_res_body.contentlist
            for (let i = 0; i < jokedata.length; i++) {
                jokedata[i].text = jokedata[i].text.replace(/<br \/>/g, '\n')
            }
            let html = api.getHtml(joketemplate, {
                data: jokedata
            })
            contentUl.innerHTML = html
            // 自适应字体
            let contentUlArr = contentUl.children
            let contentUlHeight = 0
            for (let i = 0; i < contentUlArr.length; i++) {
                api.fontSlef(contentUlArr[i], 19)
                contentUlHeight += contentUlArr[i].clientHeight
            }
            contentUl.style.height = contentUlHeight + contentUlArr.length * 9 + 'px'
            new BScroll.default(contentItemJoke, {
                click: true
            })
        })
    }


    // 图片区 难点
    function picBagin() {
        // 为了可以刚刚开始可以滑动一点
        contentPic.style.height = 2500 + 'px'
        new BScroll.default(contentItemPic, {
            click: true
        })
        api.getPic(api.pages('图片').oldpage).then((res) => {
            picdata = res.showapi_res_body.contentlist

            let html = api.getHtml(pictemplate, {
                data: picdata
            })
            contentPic.innerHTML = html
            let contentPicWidth = contentPic.children[0].clientWidth
            //  瀑布流
            let picArr = contentPic.children
            let control = [0, 0]
            // 记录图片加载完成后状态
            let controlHight = []
            // 滑动的高度设置总开关
            let all = 'false'
            for (let i = 0; i < picArr.length; i++) {
                controlHight[i] = 0
            }

            for (let i = 0; i < picArr.length; i++) {

                // 图片加载后才获取高度
                picArr[i].children[0].onload = function () {
                    controlHight[i] = 1
                    let height = picArr[i].clientHeight
                    let min = Math.min(control[0], control[1])
                    let index = control.findIndex((item) => {
                        return min == item
                    })
                    picArr[i].style.top = min + 5 + 'px'
                    picArr[i].style.left = contentPicWidth * index + 'px'
                    control[index] += height + 5
                    let allcontrol = controlHight.some(function (item) {
                        return item == 0
                    })
                    if (!allcontrol) {
                        all = 'true'
                    }
                }

            }
            // 计时器判断当所有图片加载玩后在开启滑动开关
            let timer = window.setInterval(() => {
                if (all === 'true') {
                    
                    let max = Math.max(control[0], control[1])

                    contentPic.style.height = max + 20 + 'px'
                    new BScroll.default(contentItemPic, {
                        click: true
                    })
                    
                    window.clearInterval(timer)
                }
            }, 500)


        })
    }


    // 谜语区
    function guessBagin() {
        let iconfont = [{
                name: '搞笑谜语',
                icon: '&#x3454;'
            },
            {
                name: '字谜',
                icon: '&#xe61c;'
            },
            {
                name: '成语谜语',
                icon: '&#xe653;'
            },
            {
                name: '动物谜语',
                icon: '&#xe60b;'
            },
            {
                name: '爱情谜语',
                icon: '&#xe77a;'
            },
            {
                name: '灯谜谜语',
                icon: '&#xe66e;'
            },
            {
                name: '人名谜语',
                icon: '&#xe6e7;'
            },
            {
                name: '地名谜语',
                icon: '&#xe713;'
            },
            {
                name: '词语谜语',
                icon: '&#xe655;'
            },
            {
                name: '带格谜语',
                icon: '&#xe6b5;'
            },
            {
                name: '用语谜语',
                icon: '&#xe6b2;'
            },
            {
                name: '儿童谜语',
                icon: '&#xe60a;'
            },
            {
                name: '物品谜语',
                icon: '&#xe63d;'
            },
            {
                name: '植物谜语',
                icon: '&#xe606;'
            },
            {
                name: '名谜谜语',
                icon: '&#xe623;'
            },
            {
                name: '书报谜语',
                icon: '&#x3454;'
            },
            {
                name: '俗语谜语',
                icon: '&#xe603;'
            },
            {
                name: '药品谜语',
                icon: '&#xe649;'
            },
            {
                name: '音乐谜语',
                icon: '&#xe615;'
            },
            {
                name: '影视谜语',
                icon: '&#xe61d;'
            },
            {
                name: '称谓谜语',
                icon: '&#xe62d;'
            },
            {
                name: '趣味谜语',
                icon: '&#xe6af;'
            },
            {
                name: '谜语精选',
                icon: '&#xe66b;'
            },
            {
                name: '脑筋急转弯',
                icon: '&#xe715;'
            },
            {
                name: '智力问答',
                icon: '&#xe66d;'
            },
        ]


        api.getGuessType().then((res) => {
            guessdata = res.showapi_res_body.typeList

            for (let i = 0; i < guessdata.length; i++) {
                guessdata[i].icon = iconfont[i].icon

            }

            let html = api.getHtml(guessTypetemplate, {
                data: guessdata
            })
            contentGuess.innerHTML = html
            let liWidth = contentGuess.children[0].clientWidth
            let iconArr = contentGuess.children
            for (let i = 0; i < iconArr.length; i++) {
                // 自适应字体
                api.fontSlef(iconArr[i].children[0], 5)
                api.fontSlef(iconArr[i].children[2], 15)


                iconArr[i].children[0].classList.add('iconfont')
                iconArr[i].children[0].innerHTML = iconfont[i].icon
                iconArr[i].style.height = liWidth + 'px'
            }
            let contentGuessHeight = liWidth * (Math.ceil(iconArr.length / 2))

            contentGuess.style.height = contentGuessHeight + 20 + 'px'
            new BScroll.default(contentItemGuess, {
                click: true
            })

            // 点击谜语类型事件
            showGuessBigan()

        })
    }
    // 显示谜语区
    function showGuessBigan() {
        let guessLiArr = contentGuess.children

        // 返回
        let back = document.querySelector('.show-guess-back')
        // 自适应字体
        api.fontSlef(back, 30)
        back.onclick = function () {
            enterGuess = 0
            showGuess.style.opacity = '0'
            showGuess.style.left = '100%'
        }
        let showGuessTitle = document.querySelector('.show-guess-title')
        let showGuessContent = document.querySelector('.show-guess-content')
        let showGuess = document.querySelector('.show-guess')
        let showGuessItem = document.querySelector('.show-guess-content-item')
        let showGuessItemLi = showGuessItem.children
        let not = document.querySelector('.not')

        for (let i = 0; i < guessLiArr.length; i++) {

            guessLiArr[i].onclick = function () {

                enterGuess = 1
                typeId = guessLiArr[i].dataset.id
                let guessType = guessLiArr[i].dataset.id

                showGuess.style.opacity = '1'
                showGuess.style.left = '0'
                api.getGuess(guessType, api.pages(guessType).oldpage).then((res) => {
                    let data = res.showapi_res_body.pb.contentlist
                    if (data.length < 1) {
                        showGuessItem.style.display = 'none'
                        not.style.display = 'block'
                        return
                    } else {
                        not.style.display = 'none'
                        showGuessItem.style.display = 'block'
                        showGuessTitle.children[0].innerHTML = data[0].typeName
                        //  自适应字体
                        api.fontSlef(showGuessTitle.children[0], 30)
                        let html = api.getHtml(guesstemplate, {
                            data: data
                        })
                        showGuessItem.innerHTML = html
                        //  自适应字体
                        api.fontSlef(showGuessItem, 20)
                        let showGuessItemHeight = 0
                        for (let i = 0; i < showGuessItemLi.length; i++) {
                            showGuessItemHeight += showGuessItemLi[i].clientHeight
                            // 点击显示答案
                            let showAnswer = document.querySelector('.show-answer')
                            // 自适应字体
                            api.fontSlef(showAnswer.children[0], 30)
                            showGuessItemLi[i].onclick = function (e) {
                                e.stopPropagation()
                                showAnswer.style.opacity = '1'
                                showAnswer.style.left = '0'
                                let text = showGuessItemLi[i].dataset.guess
                                let answer = showGuessItemLi[i].dataset.answer
                                let guessText = document.querySelector('.text')
                                let guessAnswer = document.querySelector('.answer')
                                let hide = document.querySelector('.hide')
                                guessText.innerHTML = text
                                guessAnswer.innerHTML = answer

                                api.fontSlef(guessText, 30)
                                api.fontSlef(guessAnswer, 30)
                                let answerHeight = guessAnswer.clientHeight

                                hide.style.height = answerHeight + 1 + 'px'
                                hide.style.lineHeight = answerHeight + 'px'
                                // 自适应字体
                                api.fontSlef(hide, 30)
                                hide.onclick = function (e) {
                                    e.stopPropagation()

                                    if (hide.style.opacity == '0') {
                                        hide.style.opacity = '1'
                                        return
                                    }
                                    hide.style.opacity = '0'
                                }

                                // 返回
                                let back = document.querySelector('.show-answer-back')
                                back.onclick = function (e) {
                                    e.stopPropagation()

                                    hide.style.opacity = '1'
                                    showAnswer.style.opacity = '0'
                                    showAnswer.style.left = '100%'
                                }

                            }
                        }
                        showGuessItem.style.height = showGuessItemHeight + showGuessItemLi.length * 5 + 70 + 'px'
                        new BScroll.default(showGuessContent, {
                            click: true
                        })
                    }




                })

            }
        }
    }

    // 刷新模块
    more.onclick = function () {
        if (moreIndex == 0) {
            jokeBegin()
        } else if (moreIndex == 1) {
            picBagin()
        } else if (moreIndex == 2 && enterGuess == 1) {

            let showGuessTitle = document.querySelector('.show-guess-title')
            let showGuessItem = document.querySelector('.show-guess-content-item')
            let showGuessContent = document.querySelector('.show-guess-content')
            api.getGuess(typeId, api.pages(typeId).oldpage).then((res) => {
                let data = res.showapi_res_body.pb.contentlist

                let html = api.getHtml(guesstemplate, {
                    data: data
                })
                showGuessItem.innerHTML = html
                //  自适应字体
                api.fontSlef(showGuessItem, 20)
                let showGuessItemHeight = 0
                let showGuessItemLi = showGuessItem.children
                for (let i = 0; i < showGuessItemLi.length; i++) {
                    showGuessItemHeight += showGuessItemLi[i].clientHeight
                    // 点击显示答案
                    let showAnswer = document.querySelector('.show-answer')
                    // 自适应字体
                    api.fontSlef(showAnswer.children[0], 30)
                    showGuessItemLi[i].onclick = function (e) {
                        e.stopPropagation()
                        showAnswer.style.opacity = '1'
                        showAnswer.style.left = '0'
                        let text = showGuessItemLi[i].dataset.guess
                        let answer = showGuessItemLi[i].dataset.answer
                        let guessText = document.querySelector('.text')
                        let guessAnswer = document.querySelector('.answer')
                        let hide = document.querySelector('.hide')
                        guessText.innerHTML = text
                        guessAnswer.innerHTML = answer

                        api.fontSlef(guessText, 30)
                        api.fontSlef(guessAnswer, 30)
                        let answerHeight = guessAnswer.clientHeight

                        hide.style.height = answerHeight + 1 + 'px'
                        hide.style.lineHeight = answerHeight + 'px'
                        // 自适应字体
                        api.fontSlef(hide, 30)
                        hide.onclick = function (e) {
                            e.stopPropagation()
                            // console.log('first')
                            if (hide.style.opacity == '0') {
                                hide.style.opacity = '1'
                                return
                            }
                            hide.style.opacity = '0'
                        }

                        // 返回
                        let back = document.querySelector('.show-answer-back')
                        back.onclick = function (e) {
                            e.stopPropagation()

                            hide.style.opacity = '1'
                            showAnswer.style.opacity = '0'
                            showAnswer.style.left = '100%'
                        }

                    }
                }
                showGuessItem.style.height = showGuessItemHeight + showGuessItemLi.length * 5 + 70 + 'px'
                new BScroll.default(showGuessContent, {
                    click: true
                })

            })

        }

    }

}