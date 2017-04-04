'use strict'

let https = require('https');
let fs = require('fs');
let process = require('process');
let path = require('path');
let url = require('url');
let args = process.argv.slice(2);
let port = 3000;
let root = '';


if(args.length % 2) {
	console.error('参数个数不对:', args);
} else {
	var params = {}
	for(var i = 0, iLen = args.length - 1; i < iLen; i += 2) {
		var key = args[i];
		var val = args[i+1];
		//params[key] = val;
		console.log(key)
		switch(key) {
			case '-p':
				port = Math.max(Math.round(val), 1)
				break;
			case '-r':
				root = val;
				break;
			default:
				console.error('无效参数：', key);
		}
	}
}
if(root) {
	console.log(`启动代理服务器。根目录为:${root}, 端口为:${port}`);
} else {
	console.error('请指定文件目录。如: node app.js /Users/XXX/Documents/codes/');
	return;
}

var options = {
	key: fs.readFileSync('./keys/server-key.pem'),
	ca: [fs.readFileSync('./keys/ca-cert.pem')],
	cert: fs.readFileSync('./keys/server-cert.pem')
};

https.createServer(options,function(request,response){
	let urlParam = url.parse(request.url);
	let pathname = urlParam.pathname;
	let filepath = path.join(root, pathname);
	fs.stat(filepath, function(err, states){
		if(!err && states.isFile()) {
			console.log('200 ' + request.url);
			response.writeHead(200);
			fs.createReadStream(filepath).pipe(response);
		}
	})
}).listen(port, '127.0.0.1');