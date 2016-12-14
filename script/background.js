chrome.webRequest.onBeforeRequest.addListener(

    function(details) {
    	var targetReg = /a.js$/;
        if(targetReg.test(details.url)) {
        	return {redirectUrl: 'http://localhost:8080/example/js/b.js'};
    	}
    	return true;
    },

    {

        urls: ["<all_urls>"], //你要拦截的url地址

        types: ["script"] //拦截类型为script，

    },

    ["blocking"] //类型blocking为拦截,

);

function backgroundMethod(param) {
	return chrome.extension.getViews()[1].frontMethod() + param;
}