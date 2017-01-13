var mapping = chrome.extension.getBackgroundPage().getMapping();
var packageMap = mapping.packageMap;
var fileMap = mapping.fileMap;
var selectedLI = null;
var removeBtn = null;

var container = document.getElementsByClassName('url_response_container')[0];
var ul = container.getElementsByTagName('ul')[0];
for (var key in packageMap) {
    ul.appendChild(createLiElement(key, packageMap[key]));
}
for (var key in fileMap) {
    ul.appendChild(createLiElement(key, fileMap[key]));
}

var KEY_INPUT_0 = 'store.goodplan.smares.input0';
var KEY_INPUT_1 = 'store.goodplan.smares.input1';

var input_arr = document.getElementsByTagName('input');
input_arr[0].value = localStorage.getItem(KEY_INPUT_0) || '';
input_arr[1].value = localStorage.getItem(KEY_INPUT_1) || '';
input_arr[0].addEventListener('change', function(event) {
	localStorage.setItem(KEY_INPUT_0, input_arr[0].value);
})
input_arr[1].addEventListener('change', function(event) {
	localStorage.setItem(KEY_INPUT_1, input_arr[1].value);
})

document.body.addEventListener('click', function(event) {
    removeSelectedSpans();
});

var btn = document.getElementById('save');
btn.addEventListener('click', function(event) {
    // 测试调用后台函数
    // var result = chrome.extension.getBackgroundPage().backgroundMethod();//' －。－ '
    // console.log(result);
    // return;

    // ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    // var input_arr = document.getElementsByTagName('input');
    var originUrl = input_arr[0].value;
    var targetUrl = input_arr[1].value;
    if (originUrl == "" || targetUrl === "") {
        return;
    }
    var regBlank = /\s+/g;
    originUrl = originUrl.replace(regBlank, '');
    targetUrl = targetUrl.replace(regBlank, '');
    var regUrl = /http(?:s)?\:\/\/([\w\.\/\:-]*)\/([\w\.-]+)$/g
    if (!regUrl.test(originUrl)) { // 判断Url是否合法；
        return;
    }
    var lastPartOfOriginUrl = RegExp.$2;
    regUrl.lastIndex = 0;
    if (!regUrl.test(targetUrl)) { // 判断Url是否合法；
        return;
    }
    var lastPartOfTargetUrl = RegExp.$2;
    // 判断是文件夹匹配还是文件匹配
    var dotIndexOfOrigin = lastPartOfOriginUrl.indexOf('.');
    var dotIndexOfTarget = lastPartOfTargetUrl.indexOf('.');

    var backgroundPage = chrome.extension.getBackgroundPage();

    if ((dotIndexOfOrigin == -1 && dotIndexOfTarget == -1) ||
        (dotIndexOfOrigin >= 0 && dotIndexOfTarget >= 0)) {
        backgroundPage.setMapping(originUrl, targetUrl, (dotIndexOfOrigin == -1 && dotIndexOfTarget == -1));
        input_arr[0].value = '';
        input_arr[1].value = '';
        ul.appendChild(createLiElement(originUrl, targetUrl));
        //
        localStorage.removeItem(KEY_INPUT_0);
        localStorage.removeItem(KEY_INPUT_1);
    } else {
        console.log('error url');
    }
});

var clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', function(event) {
    chrome.extension.getBackgroundPage().clearLocalStorage();
    ul.innerHTML = "";
    input_arr[0].value = "";
    input_arr[1].value = "";
    document.getElementsByTagName('input')[0].focus();
});

function createLiElement(originUrl, targetUrl) {
    var li = document.createElement('li');
    li.innerHTML = '<div><span>' + originUrl + '</span><span>' + targetUrl + '</span></div>';
    li.addEventListener('click', onLIClick);
    return li;
}

function onLIClick(event) {
    event.stopPropagation();

    var liEl = event.currentTarget;
    
    if(liEl.tagName.toUpperCase() != 'LI' || 
        selectedLI === liEl){
        return;
    }
    removeSelectedSpans();

    var spans = liEl.querySelectorAll('span');
    var forEach = Array.prototype.forEach;
    forEach.call(spans, function(spanEl){
        spanEl.className = 'selected';
    });
    
    removeBtn = document.createElement('div');
    removeBtn.innerText = 'Delete';
    removeBtn.style.cssText = 'border-radius:6px; border:solid 1px #eee; background-color:red; color:white;' + 
        'width:45px; height:16px; position:absolute; text-align:center; cursor:pointer;' + 
        'left:' + event.pageX + 'px; top:' + event.pageY + 'px';
    document.body.appendChild(removeBtn);
    removeBtn.addEventListener('click', removeItem);

    selectedLI = liEl;
}

function removeSelectedSpans() {
    if(!selectedLI || !removeBtn) {
        return;
    }
    var selectedSpans = selectedLI.querySelectorAll('span');
    var forEach = Array.prototype.forEach;
    forEach.call(selectedSpans, function(spanEl){
        spanEl.removeAttribute('class');
    });

    removeBtn.parentNode.removeChild(removeBtn);
    removeBtn.removeEventListener('click', removeItem);

    selectedLI = null;
    removeBtn = null;
}

function removeItem(event) {
    event.stopPropagation();

    var deleteKey = selectedLI.querySelector('span').innerText;
    selectedLI.parentNode.removeChild(selectedLI);
    removeSelectedSpans();
    //packageMap,fileMap
    for(var key in packageMap) {
        if(key == deleteKey) {
            delete packageMap[deleteKey];
            chrome.extension.getBackgroundPage().removeMapping(deleteKey, true);
            return;
        }
    }
    for(var key in fileMap) {
        if(key == deleteKey) {
            delete fileMap[deleteKey];
            chrome.extension.getBackgroundPage().removeMapping(deleteKey, false);
            return;
        }
    }
}

// no use, test code
function frontMethod() {
    return 'front content'
}
