;(function(){
	chrome.extension.sendMessage({action:"init"}, function(response) {
		if(response.state == 1) {
			console.log("Smares Start!");
		}
	});
})();