var KEY_PACK_MAP = 'store.goodplan.smares.packagemap';
var KEY_FILE_MAP = 'store.goodplan.smares.filemap';

var packageMap;
var fileMap;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == 'init') {
        var packageMapStr = localStorage.getItem(KEY_PACK_MAP);
        packageMap = packageMapStr ? JSON.parse(packageMapStr) : {};

        var fileMapStr = localStorage.getItem(KEY_FILE_MAP);
        fileMap = fileMapStr ? JSON.parse(fileMapStr) : {};

        sendResponse({ state: 1 });
    }
});

chrome.webRequest.onBeforeRequest.addListener(

    function(details) {
        // var targetReg = /origin.js$/;
        //    if(targetReg.test(details.url)) {
        //    	return {redirectUrl: 'http://localhost:8080/example/target/target.js'};
        // }

        for (var key in fileMap) {
            if (key == details.url) {
                if (chrome.extension.getViews()[1]) {
                    chrome.extension.getViews()[1].output('file matched! originUrl:' + key + ' ,targetUrl:' + fileMap[key]);
                }
                return { redirectUrl: fileMap[key] };
            }
        }
        for (var key in packageMap) {
            var reg = new RegExp('^' + key, 'g');
            if (reg.test(details.url)) {
            	console.log(packageMap[key] + details.url.substring(key.length));
                return { redirectUrl: packageMap[key] + details.url.substring(key.length) };
            }
        }
        return {};
    },

    {

        urls: ["<all_urls>"], //你要拦截的url地址

        types: ["script", "stylesheet", "image", "main_frame", "sub_frame"] //拦截类型为script，

    },

    ["blocking"] //类型blocking为拦截,

);

function getMapping() {
    var packageMapStr = localStorage.getItem(KEY_PACK_MAP);
    var fileMapStr = localStorage.getItem(KEY_FILE_MAP);
    return {'packageMap':packageMapStr ? JSON.parse(packageMapStr) : {}, 
			'fileMap':fileMapStr ? JSON.parse(fileMapStr) : {}};
}

function setMapping(originUrl, targetUrl, isPackage) {
	var map, key;
	if(isPackage) {
		map = packageMap;
		key = KEY_PACK_MAP;
	} else {
		map = fileMap;
		key = KEY_FILE_MAP;
	}
    map[originUrl] = targetUrl;
    localStorage.setItem(key, JSON.stringify(map))
}

function clearLocalStorage() {
    localStorage.clear();
    packageMap = {};
    fileMap = {};
}

// no use, test code
function backgroundMethod(param) {
    return chrome.extension.getViews()[1].frontMethod() + param;
}
