var btn = document.getElementById('btn');
btn.addEventListener('click', function(event) {
    //console.log("click me~~~");
    var result = chrome.extension.getBackgroundPage().backgroundMethod(' －。－ ');
    console.log(result);
});

function frontMethod() {
	return 'front content'
}
