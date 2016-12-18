var KEY_PACK_MAP = 'store.goodplan.smares.packagemap';
var KEY_FILE_MAP = 'store.goodplan.smares.filemap';

var packageMapStr = localStorage.getItem(KEY_PACK_MAP);
var packageMap = packageMapStr ? JSON.parse(packageMapStr) : {};

var fileMapStr = localStorage.getItem(KEY_FILE_MAP);
var fileMap = fileMapStr ? JSON.parse(fileMapStr) : {};

chrome.webRequest.onBeforeRequest.addListener(

    function(details) {
        // var targetReg = /origin.js$/;
        //    if(targetReg.test(details.url)) {
        //    	return {redirectUrl: 'http://localhost:8080/example/target/target.js'};
        // }
        for (var key in fileMap) {
        	if(chrome.extension.getViews()[1]) {
        		chrome.extension.getViews()[1].output('EMP: ' + key + ' , OMP:' + details.url);
        	}
            if (key == details.url) {
            	if(chrome.extension.getViews()[1]) {
            		chrome.extension.getViews()[1].output('file matched! originUrl:' + key + ' ,targetUrl:' + fileMap[key]);
            	}
                return { redirectUrl: fileMap[key] };
            }
        }
        for (var key in packageMap) {
            var reg = new RegExp('^' + key, 'g');
            if (reg.test(details.url)) {
            	//chrome.extension.getViews()[1].output('package matched! originUrl:' + key + ' ,targetUrl:' + packageMap[key]);
                return { redirectUrl: packageMap[key] + details.url.substring(key.length) };
            }
        }
        return {};
    },

    {

        urls: ["<all_urls>"], //你要拦截的url地址

        types: ["script"] //拦截类型为script，

    },

    ["blocking"] //类型blocking为拦截,

);

// function setMapping(originUrl, targetUrl, isPackage) {
//     var map = isPackage ? packageMap : fileMap;
//     map[originUrl] = targetUrl;
// }

// no use, test code
function backgroundMethod(param) {
    return chrome.extension.getViews()[1].frontMethod() + param;
}
