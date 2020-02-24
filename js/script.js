//https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1
//https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=zh-CN
var greetMsg = "";
var motto = "";
var isSearchVisible = true;

/**
 * opreate array bookmarkObjs with menber functions only!
 * the function takes valid args only
 */
var bookmarkObjs = [];

function addBookmark(title, url) {
    var bk = {
        "id": "bookmark-" + url,//id should be unique
        "title": title,
        "url": url
    }
    bookmarkObjs.push(bk);
    saveBookmarks();
}

function delBookmark(_id) {
    bookmarkObjs.splice(bookmarkObjs.findIndex(item => item.id === _id), 1);
    saveBookmarks();
}

function createBookMark(title, url) {
    var bkId = "bookmark-" + url;
    createEle(bkId, "bookmark-div", "bookmark-container", "div");
    createEle(bkId + "-btn", "bookmark-action-btn", bkId, "button");
    createEle(bkId + "-btn-div", "bookmark-action-icon-div", bkId + "-btn", "div");
    createEle(bkId + "-a", null, bkId, "a");
    createEle(bkId + "-a-div", "bookmark-main-div", bkId + "-a", "div");
    createEle(bkId + "-a-div-div-1", "bookmark-icon", bkId + "-a-div", "div");
    createEle(bkId + "-a-div-div-2", "bookmark-title", bkId + "-a-div", "div");
    document.getElementById(bkId + "-a").href = url;
    document.getElementById(bkId + "-a-div-div-2").innerHTML = title;
    var domain = url.split("/")[2];
    if (domain) {
        domain = url.split("/")[0] + domain;
    }
    else {
        domain = "";
    }
    document.getElementById(bkId + "-a-div-div-1").style.background = "url(" + domain + "/favicon.ico) no-repeat 0px center";
}

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
    updateGreetMsg();//if very late stop show user name in greet words.
    app.$data.helloMsg = greetMsg;
    isSearchVisible = true;
}

/**
 * 
 * @param {elementId} childId 
 * @param {elementClass} className 
 * @param {elementParentId} parentId 
 * @param {elementType} type 
 * create an new element with id={childId} and class={className}
 * the new element will be child of {parentId}
 * new element is a {type} element
 */
function createEle(childId, className, parentId, type) {
    var child = document.createElement(type);
    if (childId) {
        child.id = childId;
    }
    if (className) {
        child.className = className;
    }
    document.getElementById(parentId).append(child);
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
                createEle("setting-page-div", "setting-page-div", "vm", "div");
                createEle("close-button-div-s", "close-btn-div", "setting-page-div", "div");
                createEle("setting-title", "dialog-title", "close-button-div-s", "p")
                createEle("close-button", "close-button", "close-button-div-s", "button");
                createEle("name-div", "setting-form-div", "setting-page-div", "div");
                createEle("name-label", null, "name-div", "label", "name");
                createEle("name-input", null, "name-div", "input");
                createEle("location-div", "setting-form-div", "setting-page-div", "div");
                createEle("location-label", null, "location-div", "label");
                createEle("location-input", null, "location-div", "input");
                document.getElementById("setting-title").innerHTML = "setting";
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
        },
        createAddBookmarkDiv: function (event) {
            if (document.getElementById("add-bookmark-dialog")) {
                return;
            }
            else {
                //create new bookmark dialog
                createEle("add-bookmark-dialog", "add-bookmark-dialog-div", "vm", "div");
                createEle("close-button-div-a", "close-btn-div", "add-bookmark-dialog", "div");
                createEle("add-bookmark-title", "dialog-title", "close-button-div-a", "p");
                createEle("close-button-bookmark", "close-button", "close-button-div-a", "button");
                createEle("title-div", "setting-form-div", "add-bookmark-dialog", "div");
                createEle("title-label", null, "title-div", "label");
                createEle("title-input", null, "title-div", "input");
                createEle("url-div", "setting-form-div", "add-bookmark-dialog", "div");
                createEle("url-label", null, "url-div", "label");
                createEle("url-input", null, "url-div", "input");
                document.getElementById("add-bookmark-title").innerHTML = "add a bookmark"
                var nameLabel = document.getElementById("title-label");
                nameLabel.for = "title";
                nameLabel.innerHTML = "title:";
                var urlLabel = document.getElementById("url-label");
                urlLabel.for = "url";
                urlLabel.innerHTML = "url:";
                document.getElementById("url-input").placeholder = "https://..."

                //event listener : build new bookmark when click
                document.getElementById("close-button-bookmark").addEventListener("click", function () {
                    var bkTitle = document.getElementById("title-input").value;
                    var bkUrl = document.getElementById("url-input").value;
                    document.getElementById("vm").removeChild(document.getElementById("add-bookmark-dialog"));
                    if (!strIsnull(bkTitle) && !strIsnull(bkUrl)) {
                        createBookMark(bkTitle, bkUrl);
                        addBookmark(bkTitle, bkUrl);
                    }
                })
            }
        }
    }
})

/**
 * save the user input on the setting dialog
 */
function saveSettings() {
    chrome.storage.sync.set({ 'name': app.$data.name, 'weatherAPI': heWeatherAPI },
        function () {
            //console.log(heWeatherAPI);
        });
}

/**
 * @param {fetch weather data handler} fn 
 * read user setting on the setting dialog
 */
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

/**
 * save user bookmarks
 */
function saveBookmarks() {
    chrome.storage.sync.set({ 'bookmarks': bookmarkObjs }, function () {
    });
}

/**
 * read user bookmarks
 */
function readBookmarks() {
    chrome.storage.sync.get('bookmarks', function (res) {
        bookmarkObjs = res.bookmarks;
        bookmarkObjs.forEach(element => {
            createBookMark(element.title, element.url);
        });
    })
}

/**
 * @param {url where to fetch} url 
 * @param {*} successCallBack 
 * @param {*} errorCallBack 
 * fetch internet data
 */
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
        let date = new Date();
        let hour = date.getHours();
        let night = "";
        if (!(hour > 4 && hour < 19)) {
            night = "n";
        }
        app.$data.weatherIconUrl = "icon/svg/" + json.HeWeather6[0].now.cond_code + night + ".svg";
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
        app.$data.showname = true;
        greetMsg = "Good morning!";
    }
    else if (hour > 11 && hour < 19) {//afternoon
        app.$data.showname = true;
        greetMsg = "Good afternoon!";
    }
    else if (hour > 18 && hour < 24) {//evening
        app.$data.showname = true;
        greetMsg = "Good evening!";
    }
    else {//very late
        app.$data.showname = false;
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
    //document.getElementById("new-bookmark-btn").addEventListener("click", addBookmark);
    this.setSearchHidden();
    readBookmarks();
    this.readSettings(function () {
        fetchData(heWeatherAPI, heWeatherRequestSuccessHandler, function () { });
    });

    fetchData(bingImageAPI, bingImageRequestSuccessHandler, function () { });
    fetchData(daylyMottoAPI, daylyMottoRequestSuccessHandler, function () { });
    updateGreetMsg();
}


