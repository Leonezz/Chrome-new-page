//https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1
//https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=zh-CN
var greetMsg = "";
var motto = "";
var isSearchVisible = true;
function setSearchHidden() {
    if (!isSearchVisible) {
        return;
    }
    document.getElementById("search-container").className = "search-div-fade-in search-div";
    document.getElementById("hello-div").className = "hello hello-div-center";
    fetchData(daylyMottoAPI, daylyMottoRequestSuccessHandler, function () { });
    setTimeout(() => {
        app.$data.helloMsg = motto;
    }, 500);
    isSearchVisible = false;
}
function setSearchVisible() {
    if (isSearchVisible) {
        return;
    }
    document.getElementById("search-container").className = "search-div";
    document.getElementById("hello-div").className = "hello hello-div-top";
    document.getElementById("search-input").focus();
    app.$data.helloMsg = greetMsg;
    isSearchVisible = true;
}
var daylyMottoAPI = 'https://v1.hitokoto.cn/';
var bingImageAPI = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fcn.bing.com%2FHPImageArchive.aspx%3Fformat%3Djs%26idx%3D0%26n%3D1';
var heWeatherAPI = 'https://free-api.heweather.net/s6/weather/now?location=jiangning,nanjing&key=c2647375f06d4852a1f6883899e984b0';
var app = new Vue({
    el: '#app',
    data: {
        imageUrl: "",
        helloMsg: greetMsg,
        picCopyRight: "",
        picCopyRightLink: "",

        weatherText: "",
        temp: 20,
        weatherIconUrl: ""
    }
})

function fetchData(url, successCallBack, errorCallBack) {
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                //app.$data.imageUrl = obj.images[0].url;
                successCallBack(response);
            }
            else {
                throw new Error('err')
            }
        })
        .catch(errorCallBack)
}

function bingImageRequestSuccessHandler(response) {
    return response.json().then(function (json) {
        app.$data.imageUrl = json.images[0].url
        app.$data.picCopyRight = json.images[0].copyright
        app.$data.picCopyRightLink = json.images[0].copyrightlink
    })
}

function heWeatherRequestSuccessHandler(response) {
    return response.json().then(function (json) {
        app.$data.weatherText =
            json.HeWeather6[0].basic.parent_city
            + ","
            + json.HeWeather6[0].basic.location
            + ": "
            + json.HeWeather6[0].now.cond_txt
            + " "
            + json.HeWeather6[0].now.wind_dir
            + " "
            + json.HeWeather6[0].now.wind_sc
            + "级";
        app.$data.temp = json.HeWeather6[0].now.tmp;
        app.$data.weatherIconUrl = "icon/" + json.HeWeather6[0].now.cond_code + ".png";
    });
}

function daylyMottoRequestSuccessHandler(response) {
    return response.json().then(function (json) {
        motto = json.hitokoto;
        //motto = json.data.content;
    })
}

function updateGreetMsg() {
    let date = new Date();
    let hour = date.getHours();
    if (hour > 4 && hour < 12) {//morning
        greetMsg = "Good morning! zhuwenq";
    }
    else if (hour > 11 && hour < 19) {//afternoon
        greetMsg = "Good afternoon! zhuwenq";
    }
    else if (hour > 18 && hour < 24) {//evening
        greetMsg = "Good evening! zhuwenq";
    }
    else {//very late
        greetMsg = "What a busy day!";
    }
}

function strIsnull(val) {
    var str = val.replace(/(^\s*)|(\s*$)/g, '');//把val首尾的空格去掉。
    if (str == "" || str == undefined || str == null) {//输入框中输入空格也为空
        return true;
    } else {
        return false;
    }
}
document.onkeydown = function (e) {
    var event = event || window.event;
    var searchInput = document.getElementById("search-input");
    if (event.ctrlKey && event.keyCode == 13) {//ctrl + enter
        setSearchVisible();
    }
    else if (event.altKey && event.keyCode == 13) {
        setSearchHidden();
    }
    else if ((!strIsnull(searchInput.value)) && (document.activeElement == searchInput)) {
        if (event.keyCode == 13) {
            let sl = "";
            let tl = "";
            let url = "";
            if (searchInput.value.substring(0, 6) == "#trans") {//google translate
                var toTransLate = searchInput.value.substr(6);
                if (toTransLate.charCodeAt(0) > 255) {
                    sl = "zh-CN";
                    tl = "en";
                }
                else {
                    sl = "en";
                    tl = "zh-CN";
                }
                url = 'https://translate.google.com/?source=gtx#view=home&op=translate&sl='
                    + sl
                    + '&tl='
                    + tl
                    + '&text='
                    + toTransLate;
            }
            else {
                url = 'http://www.google.com/search?q='
                    + searchInput.value;
            }
            window.open(url, "_blank");
        }
    }
}

window.onload = function () {
    document.getElementById("search-input").addEventListener("blur", setSearchHidden);
    this.setSearchHidden();
    fetchData(bingImageAPI, bingImageRequestSuccessHandler, function () { });
    fetchData(heWeatherAPI, heWeatherRequestSuccessHandler, function () { });
    fetchData(daylyMottoAPI, daylyMottoRequestSuccessHandler, function () { });
    updateGreetMsg();
}
