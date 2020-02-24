/**
 * Author : zhuwenq
 * Descripsion : this code is bullshit now.
 */


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

function addBookmarkToArray(title, url, imageUrl) {
    var bk = {
        "id": "bookmark-" + url,//id should be unique
        "title": title,
        "url": url,
        "imageUrl": imageUrl
    }
    bookmarkObjs.push(bk);
    saveBookmarks();
}

function delBookmarkFromArray(_id) {
    bookmarkObjs.splice(bookmarkObjs.findIndex(item => item.id === _id), 1);
    saveBookmarks();
    //the bookmark container must not be full
    app.$data.isbookmarkfull = false;
}

function findBookmarkInArray(_id) {
    for (var i = 0; i < bookmarkObjs.length; ++i) {
        if (bookmarkObjs[i].id == _id) {
            return bookmarkObjs[i];
        }
    }
}

function changeBookmarkInArray(objOld, objNew) {
    for (var i = 0; i < bookmarkObjs.length; ++i) {
        if (objOld.id == bookmarkObjs[i].id) {
            bookmarkObjs[i] = objNew;
        }
    }
    saveBookmarks();
}

function changeBookmarkDom(oldId, newBookmark) {
    //document.getElementById(oldId).removeChild();
    document.getElementById(oldId).removeChild(document.getElementById(oldId + "-a"));
    var newId = newBookmark.id;
    var newUrl = newBookmark.url;
    var newTitle = newBookmark.title;
    document.getElementById(oldId).id = newId;
    //createEle(newId + "-btn", "bookmark-action-btn", newId, "button");
    document.getElementById(oldId + "-btn").id = newId + "-btn";
    document.getElementById(oldId + "-btn-div").id = newId + "-btn-div";
    //createEle(newId + "-btn-div", "bookmark-action-icon-div", newId + "-btn", "div");
    createEle(newId + "-a", null, newId, "a");
    createEle(newId + "-a-div", "bookmark-main-div", newId + "-a", "div");
    createEle(newId + "-a-div-div-1", "bookmark-icon", newId + "-a-div", "div");
    createEle(newId + "-a-div-div-2", "bookmark-title", newId + "-a-div", "div");

    document.getElementById(newId + "-a").href = newUrl;
    document.getElementById(newId + "-a-div-div-2").innerHTML = newTitle;

    document.getElementById(newId + "-a-div-div-1").style.background
        = "url(\"" + newBookmark.imageUrl + "\")";
}

/**
 * @param {*} url 
 */
function getIconUrlFromStdUrl(url) {
    var domain = url.split("/")[2];
    if (domain) {
        domain = url.split("/")[0] + domain;
    }
    else {
        domain = "";
    }
    return domain + "/favicon.ico";
}


String.prototype.gblen = function () {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        var c = this.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        } else {
            len += 2;
        }
    }
    return len;
}

String.prototype.leftCodes = function (num) {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        var c = this.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        } else {
            len += 2;
        }
        if (len == num || len == num - 1) {
            return this.slice(0, i);
        }
    }
    return this;
}

function createBookMark(title, url, imgUrl) {
    var bkId = "bookmark-" + url;
    createEle(bkId, "bookmark-div", "bookmark-container", "div");
    createEle(bkId + "-btn", "bookmark-action-btn", bkId, "button");
    createEle(bkId + "-btn-div", "bookmark-action-icon-div", bkId + "-btn", "div");
    createEle(bkId + "-a", null, bkId, "a");
    createEle(bkId + "-a-div", "bookmark-main-div", bkId + "-a", "div");
    createEle(bkId + "-a-div-div-1", "bookmark-icon", bkId + "-a-div", "div");
    createEle(bkId + "-a-div-div-2", "bookmark-title", bkId + "-a-div", "div");
    document.getElementById(bkId + "-a").href = url;
    document.getElementById(bkId + "-a-div-div-2").innerHTML
        = title.gblen() > 11 ? title.leftCodes(12) + "..." : title;

    imgUrl = recongnizeIconUrl(imgUrl, url);

    document.getElementById(bkId + "-a-div-div-1").style.background
        = "url(\"" + imgUrl + "\")";


    document.getElementById(bkId + "-btn").addEventListener("click", function (event) {
        setTimeout(() => {
            fn();
        }, 10);

        function fn() {
            createEle("bkmenu-dialog", "dialog-div", "vm", "div");
            createEle("change", null, "bkmenu-dialog", "button");
            createEle(null, null, "bkmenu-dialog", "br");
            var changeBtn = document.getElementById("change");
            changeBtn.innerHTML = 'change';

            var dialogEle = document.getElementById("bkmenu-dialog");

            //var btn = document.getElementById(bkId + "-btn");
            var topoffset = -dialogEle.offsetHeight - 20;
            var leftoffset = -document.getElementById("bookmark-container").offsetLeft
                + event.target.parentNode.offsetWidth / 1.8;

            fixDialogPosition(event.target, "bkmenu-dialog", topoffset, leftoffset);
            dialogEle.style.padding = "5px";

            changeBtn.addEventListener("click", function () {
                var bkToChange = findBookmarkInArray(bkId);
                var newBKObj = {
                    "id": "",
                    "title": "",
                    "url": "",
                    "imageUrl": ""
                }
                document.getElementById("vm").removeChild(dialogEle);
                setTimeout(() => {
                    newBookmarkDialog("change-bookmark-dialog", bkId, "Change this:");
                    document.getElementById("close-button-bookmark").addEventListener("click", function () {
                        var bkTitle = document.getElementById("title-input").value;
                        var newUrl = document.getElementById("url-input").value;
                        var iconUrl = document.getElementById("icon-url-input").value;
                        document.getElementById("vm")
                            .removeChild(document.getElementById("change-bookmark-dialog"));

                        var newId = "bookmark-" + newUrl;
                        if (!strIsnull(bkTitle) && !strIsnull(newUrl)) {
                            newBKObj.title = bkTitle;
                            newBKObj.url = newUrl;
                            newBKObj.id = newId;
                            newBKObj.imageUrl = recongnizeIconUrl(iconUrl, newUrl);
                            changeBookmarkInArray(bkToChange, newBKObj);
                            //show new bookmark.
                            changeBookmarkDom(bkToChange.id, newBKObj);
                        }
                    })
                }, 10);
            })
            createEle("delete", null, "bkmenu-dialog", "button");
            var deleteBtn = document.getElementById("delete");
            deleteBtn.innerHTML = 'delete';
            deleteBtn.addEventListener("click", function () {
                delBookmarkFromArray(bkId);
                document.getElementById("vm").removeChild(dialogEle);
                document.getElementById("bookmark-container").removeChild(document.getElementById(bkId));
            })
        }
    })
}

function setSearchHidden() {
    if (!isSearchVisible) {
        return;
    }
    document.getElementById("search-container").className = "search-div-fade-in search-div";
    document.getElementById("hello-div").className = "hello hello-div-center";
    document.getElementById("bookmark-container").style.opacity = 0;
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
    document.getElementById("bookmark-container").style.opacity = 100;
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
    document.getElementById(parentId).appendChild(child);
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
        weatherIconUrl: "",

        isbookmarkfull: false
    },
    methods: {
        createSettingDiv: function (event) {
            setTimeout(() => {
                fn();
            }, 10);
            function fn() {
                if (document.getElementById("setting-page-div")) {
                    return;
                }
                else {
                    createEle("setting-page-div", "dialog-div", "vm", "div");
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
                    locationInput.placeholder = "eg:jiangning,nanjing";

                    var ele = document.getElementById("setting-btn");
                    var dia = document.getElementById("setting-page-div");
                    var topoffset = ele.offsetHeight + 5;
                    var leftoffset = ele.offsetWidth - dia.offsetWidth;

                    var duckDom = document.getElementById("setting-btn");

                    fixDialogPosition(duckDom, "setting-page-div", topoffset, leftoffset);

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
        },
        createAddBookmarkDiv: function (event) {
            var bookmarksNum = bookmarkObjs.length;
            var bookmarkWidth = document.getElementById("new-bookmark-btn").offsetWidth
                + 24;//add the padding
            var isFull = false;
            if ((bookmarksNum + 2) * bookmarkWidth > 0.9 * screen.width) {
                isFull = true;
            }
            setTimeout(() => {
                newBookmarkDialog("add-bookmark-dialog", "new-bookmark-btn", "Add a bookmark:");
                document.getElementById("close-button-bookmark").addEventListener("click", function () {
                    var bkTitle = document.getElementById("title-input").value;
                    var bkUrl = document.getElementById("url-input").value;
                    var imageUrl = document.getElementById("icon-url-input").value;
                    document.getElementById("vm").removeChild(document.getElementById("add-bookmark-dialog"));
                    if (!strIsnull(bkTitle) && !strIsnull(bkUrl)) {
                        imageUrl = recongnizeIconUrl(imageUrl, bkUrl);
                        createBookMark(bkTitle, bkUrl, imageUrl);
                        addBookmarkToArray(bkTitle, bkUrl);
                        if (isFull) {
                            app.$data.isbookmarkfull = true;
                        }
                    }
                })
            }, 10);
        }
    }
})

function recongnizeIconUrl(imgUrl, url) {
    imgUrl = imgUrl ? imgUrl : "";
    imgUrl = imgUrl == "" ? getIconUrlFromStdUrl(url) : imgUrl;
    return imgUrl;
}

function newBookmarkDialog(id, duckId, title) {
    if (document.getElementById(id)) {
        return;
    }
    else {
        //create new bookmark dialog
        createEle(id, "dialog-div", "vm", "div");
        createEle("close-button-div-a", "close-btn-div", id, "div");
        createEle("add-bookmark-title", "dialog-title", "close-button-div-a", "p");
        createEle("close-button-bookmark", "close-button", "close-button-div-a", "button");
        createEle("title-div", "setting-form-div", id, "div");
        createEle("title-label", null, "title-div", "label");
        createEle("title-input", null, "title-div", "input");
        createEle("url-div", "setting-form-div", id, "div");
        createEle("url-label", null, "url-div", "label");
        createEle("url-input", null, "url-div", "input");
        createEle("icon-url-div", "setting-form-div", id, "div");
        createEle("icon-url-label", null, "icon-url-div", "label");
        createEle("icon-url-input", null, "icon-url-div", "input");
        document.getElementById("add-bookmark-title").innerHTML = title;
        var titleLabel = document.getElementById("title-label");
        titleLabel.for = "title";
        titleLabel.innerHTML = "title:";
        var urlLabel = document.getElementById("url-label");
        urlLabel.for = "url";
        urlLabel.innerHTML = "url:";
        document.getElementById("url-input").placeholder = "https://..."

        document.getElementById("icon-url-label").innerHTML = "iconUrl:";
        document.getElementById("icon-url-input").placeholder = "(optional)";

        var dia = document.getElementById(id);
        document.getElementById("title-input").focus();

        var topoffset = -dia.offsetHeight - 20;
        var leftoffset = -document.getElementById("bookmark-container").offsetLeft

        var duckDom = document.getElementById(duckId);

        fixDialogPosition(duckDom, id, topoffset, leftoffset);
        //event listener : build new bookmark when click
    }
}

function fixDialogPosition(duckDom, dialogId, topOffset, leftOffset) {
    var dia = document.getElementById(dialogId);

    var diatop = getElementTop(duckDom) + topOffset;
    var dialeft = getElementLeft(duckDom) + leftOffset;

    dia.style.top = diatop + "px";
    dia.style.left = dialeft + "px";
}

function getElementLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;

    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }

    return actualLeft;
}

function getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;

    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    return actualTop;
}

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
        if (res.name) {
            app.$data.name = res.name;
        }
    });
    chrome.storage.sync.get('weatherAPI', function (res) {
        if (res.heWeatherAPI) {
            heWeatherAPI = res.weatherAPI;
            fn();
        }
    });
}

/**
 * save user bookmarks
 */
function saveBookmarks() {
    chrome.storage.sync.set({
        'bookmarks': bookmarkObjs
        , 'isBookmarkFull': app.$data.isbookmarkfull
    }, function () {
    });
}

/**
 * read user bookmarks
 */
function readBookmarks() {
    chrome.storage.sync.get('bookmarks', function (res) {
        if (res.bookmarks) {
            bookmarkObjs = res.bookmarks;
            bookmarkObjs.forEach(element => {
                createBookMark(element.title, element.url, element.imageUrl);
            });
        }
        if (res.isBookmarkFull) {
            app.$data.isbookmarkfull = res.isBookmarkFull;
        }
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


/**
 * when blank place be clicked,
 * all dialog will be deleted.
 * so,if want to press a button to call a dialog out,
 * use settimeout to aviod the new dialog be deleted.
 */
document.addEventListener('click', function (event) {
    var idList = ["add-bookmark-dialog", "setting-page-div", "bkmenu-dialog", "change-bookmark-dialog"];
    idList.forEach(element => {
        var cdom = document.getElementById(element);
        if ((cdom && event.target != cdom) && !cdom.contains(event.target)) {
            document.getElementById("vm").removeChild(cdom);
        }
    });
})
