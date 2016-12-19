var mapping = chrome.extension.getBackgroundPage().getMapping();
var packageMap = mapping.packageMap;
var fileMap = mapping.fileMap;

var container = document.getElementsByClassName('url_response_container')[0];
var ul = container.getElementsByTagName('ul')[0];
for(var key in packageMap) {
	ul.appendChild(createLiElement(key, packageMap[key]));
}
for(var key in fileMap) {
	ul.appendChild(createLiElement(key, fileMap[key]));
}

var btn = document.getElementById('save');
btn.addEventListener('click', function(event) {
	// 测试调用后台函数
    // var result = chrome.extension.getBackgroundPage().backgroundMethod();//' －。－ '
    // console.log(result);
    // return;

    // ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    var input_arr = document.getElementsByTagName('input');
    var originUrl = input_arr[0].value;
    var targetUrl = input_arr[1].value;
    if(originUrl == "" || targetUrl === "") {
    	return;
    }
    var regBlank = /\s+/g;
    originUrl = originUrl.replace(regBlank, '');
    targetUrl = targetUrl.replace(regBlank, '');
    var regUrl = /http(?:s)?\:\/\/([\w\.\/\:-]*)\/([\w\.-]+)$/g
    if(!regUrl.test(originUrl)) { // 判断Url是否合法；
    	return;
    } 
    var lastPartOfOriginUrl = RegExp.$2;
    regUrl.lastIndex = 0;
    if(!regUrl.test(targetUrl)) { // 判断Url是否合法；
    	return;
    }
    var lastPartOfTargetUrl = RegExp.$2;
    // 判断是文件夹匹配还是文件匹配
    var dotIndexOfOrigin = lastPartOfOriginUrl.indexOf('.');
    var dotIndexOfTarget = lastPartOfTargetUrl.indexOf('.');

    var backgroundPage = chrome.extension.getBackgroundPage();

    if((dotIndexOfOrigin == -1 && dotIndexOfTarget == -1) ||
    	(dotIndexOfOrigin >= 0 && dotIndexOfTarget >= 0)) {
    	backgroundPage.setMapping(originUrl, targetUrl, (dotIndexOfOrigin == -1 && dotIndexOfTarget == -1));
    	input_arr[0].value = '';
    	input_arr[1].value = '';
    	ul.appendChild(createLiElement(originUrl, targetUrl));
    } else {
    	console.log('error url');
    }
});

var clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', function(event) {
	chrome.extension.getBackgroundPage().clearLocalStorage();
	ul.innerHTML = "";
	document.getElementsByTagName('input')[0].focus();
});

function createLiElement(originUrl, targetUrl) {
	var li = document.createElement('li');
	li.innerHTML = '<div><span>' + originUrl + '</span><span>' + targetUrl +'</span></div>'
	return li;
}

// no use, test code
function frontMethod() {
	return 'front content'
}
