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
        app.$data.showname = false;
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
    app.$data.showname = true;
}
var daylyMottoAPI = 'https://v1.hitokoto.cn/';
var bingImageAPI = 'https://jsonp.afeld.me/?url=http%3A%2F%2Fcn.bing.com%2FHPImageArchive.aspx%3Fformat%3Djs%26idx%3D0%26n%3D1';
var heWeatherAPI = 'https://free-api.heweather.net/s6/weather/now?location=jiangning,nanjing&key=c2647375f06d4852a1f6883899e984b0';
var app = new Vue({
    el: '#app',
    data: {
        imageUrl: "",
        helloMsg: greetMsg,
        name: "",
        showname: false,
        picCopyRight: "",
        picCopyRightLink: "",

        weatherText: "",
        temp: 20,
        weatherIconUrl: ""
    },
    methods: {
        createSettingDiv: function (event) {
            if (document.getElementById("setting-page-div")) {
                return;
            }
            else {
                function createEle(childId, className, parentId, type) {
                    var child = document.createElement(type);
                    child.id = childId;
                    if (className) {
                        child.className = className;
                    }
                    document.getElementById(parentId).append(child);
                }

                createEle("setting-page-div", "setting-page-div", "vm", "div");
                createEle("close-button-div", "close-btn-div", "setting-page-div", "div");
                createEle("close-button", "close-button", "close-button-div", "button");
                createEle("name-div", "setting-form-div", "setting-page-div", "div");
                createEle("name-label", null, "name-div", "label", "name");
                createEle("name-input", null, "name-div", "input");
                createEle("location-div", "setting-form-div", "setting-page-div", "div");
                createEle("location-label", null, "location-div", "label");
                createEle("location-input", null, "location-div", "input");
                var nameLabel = document.getElementById("name-label");
                nameLabel.for = "name";
                nameLabel.innerHTML = "name:";
                document.getElementById("name-input").type = "text";
                var locationLabel = document.getElementById("location-label");
                locationLabel.for = "location";
                locationLabel.innerHTML = "location:";
                var locationInput = document.getElementById("location-input");
                locationInput.type = "text";
                locationInput.placeholder = "for example:jiangning,nanjing";

                document.getElementById("close-button").addEventListener("click", function () {
                    var namestr = document.getElementById("name-input").value;
                    if (!strIsnull(namestr)) {
                        app.$data.name = namestr;
                    }
                    var location = document.getElementById("location-input").value;
                    if (location.length > 4) {
                        heWeatherAPI = 'https://free-api.heweather.net/s6/weather/now?location='
                            + location
                            + '&key=c2647375f06d4852a1f6883899e984b0';
                        fetchData(heWeatherAPI, heWeatherRequestSuccessHandler, function () { });
                    }
                    document.getElementById("vm").removeChild(document.getElementById("setting-page-div"));
                    saveSettings();
                })
            }
        }
    }
})

function saveSettings() {
    chrome.storage.sync.set({ 'name': app.$data.name, 'weatherAPI': heWeatherAPI },
        function () {
            console.log(heWeatherAPI);
        });
}

function readSettings(fn) {
    chrome.storage.sync.get('name', function (res) {
        if (res) {
            app.$data.name = res.name;
        }
    });
    chrome.storage.sync.get('weatherAPI', function (res) {
        if (res) {
            heWeatherAPI = res.weatherAPI;
            fn();
        }
    });
}

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
        greetMsg = "Good morning!";
        app.$data.showname = true;
    }
    else if (hour > 11 && hour < 19) {//afternoon
        greetMsg = "Good afternoon!";
        app.$data.showname = true;
    }
    else if (hour > 18 && hour < 24) {//evening
        greetMsg = "Good evening!";
        app.$data.showname = true;
    }
    else {//very late
        greetMsg = "What a busy day!";
        app.$data.showname = false;
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
                if (toTransLate.charCodeAt(1) > 255) {
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
    //document.getElementById("search-input").addEventListener("blur", setSearchHidden);
    this.setSearchHidden();

    this.readSettings(function () {
        console.log(heWeatherAPI);
        fetchData(heWeatherAPI, heWeatherRequestSuccessHandler, function () { });
    });

    fetchData(bingImageAPI, bingImageRequestSuccessHandler, function () { });
    fetchData(daylyMottoAPI, daylyMottoRequestSuccessHandler, function () { });
    updateGreetMsg();
}


