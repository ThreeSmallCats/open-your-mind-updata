let hogan = require('hogan.js')



let api = {
    // 数据请求
    ajax(url, resolve, reject) {
        let xml = new XMLHttpRequest();
        xml.open('GET', url, true);
        xml.send()
        xml.onreadystatechange = function () {
            if (xml.readyState === 4 && xml.status === 200) {
                resolve(JSON.parse(xml.responseText))
            } else if (xml.readyState === 4 && xml.status === 404) {
                reject(err)
            }
        }
    },
    pages(type) {
        let obj = this.types(type)
        let max = obj.max
        let multiple = obj.multiple
        let oldpage = parseInt(Math.random() * multiple)
        if (oldpage === 0) {
            oldpage = 1
        }
        return this.two(oldpage, max)
    },
    two(oldpage, max) {
        if (oldpage <= max) {
            return {
                oldpage,
                max
            }
        } else {
            oldpage = parseInt(oldpage / 2)
            return this.two(oldpage, max)
        }
    },
    types(type) {
        switch (type) {
            case 'gxmy':
                return {
                    max: 49,
                    multiple: 100
                };
            case 'zmmy':
                return {
                    max: 206,
                    multiple: 1000
                };
            case 'cymy':
                return {
                    max: 107,
                    multiple: 1000
                };
            case 'dwmy':
                return {
                    max: 75,
                    multiple: 100
                };
            case 'aqmy':
                return {
                    max: 20,
                    multiple: 100
                };
            case 'dmmy':
                return {
                    max: 105,
                    multiple: 1000
                };
            case 'rmmy':
                return {
                    max: 61,
                    multiple: 100
                };
            case 'dimmy':
                return {
                    max: 8,
                    multiple: 10
                };
            case 'cy':
                return {
                    max: 68,
                    multiple: 100
                };
            case 'dgmy':
                return {
                    max: 56,
                    multiple: 100
                };
            case 'ry':
                return {
                    max: 34,
                    multiple: 100
                };
            case 'etmy':
                return {
                    max: 0,
                    multiple: 0
                };
            case 'wpmy':
                return {
                    max: 58,
                    multiple: 100
                };
            case 'zwmy':
                return {
                    max: 55,
                    multiple: 100
                };
            case 'jmmy':
                return {
                    max: 60,
                    multiple: 100
                };
            case 'sbmy':
                return {
                    max: 41,
                    multiple: 100
                };
            case 'symy':
                return {
                    max: 45,
                    multiple: 100
                };
            case 'ypmy':
                return {
                    max: 31,
                    multiple: 100
                };
            case 'yymy':
                return {
                    max: 22,
                    multiple: 100
                };
            case 'ysmy':
                return {
                    max: 27,
                    multiple: 100
                };
            case 'cwmy':
                return {
                    max: 49,
                    multiple: 100
                };
            case 'qtmy':
                return {
                    max: 46,
                    multiple: 100
                };
            case 'miyujingxuan':
                return {
                    max: 0,
                    multiple: 0
                };
            case 'njmy':
                return {
                    max: 46,
                    multiple: 100
                };
            case 'zlmy':
                return {
                    max: 44,
                    multiple: 100
                };
            case '图片':
                return {
                    max: 13,
                    multiple: 100
                };
            case '笑话':
                return {
                    max: 469,
                    multiple: 1000
                };
        }
    },
    // html模板
    getHtml(htmlTemplate, data) {
        let template = hogan.compile(htmlTemplate)
        let resule = template.render(data)
        return resule
    },
    // 获取笑话
    getJoke(page) {
        return new Promise((resolve, rejece) => {
            this.ajax(`https://route.showapi.com/341-1?showapi_appid=61360&showapi_sign=6ca7f466876e4b7290013bbc30712583&page=${page}`, resolve, rejece)
        })
    },
    // 获取图片
    getPic(page) {
        return new Promise((resolve, rejece) => {
            this.ajax(`https://route.showapi.com/341-2?showapi_appid=61360&showapi_sign=6ca7f466876e4b7290013bbc30712583&page=${page}`, resolve, rejece)
        })
    },
    // 获取谜语类型
    getGuessType() {
        return new Promise((resolve, rejece) => {
            this.ajax(`https://route.showapi.com/151-3?showapi_appid=61360&showapi_sign=6ca7f466876e4b7290013bbc30712583`, resolve, rejece)
        })
    },
    // 获取谜语
    getGuess(typeId, page) {
        return new Promise((resolve, rejece) => {
            this.ajax(`https://route.showapi.com/151-4?showapi_appid=61360&showapi_sign=6ca7f466876e4b7290013bbc30712583&typeId=${typeId}&page=${page}`, resolve, rejece)
        })
    },
    // 字体自适应
    fontSlef(ele, num) {
        let width = document.documentElement.clientWidth || document.body.clientWidth;
        ele.style.fontSize = width / num + 'px'
    }
}

module.exports = api;