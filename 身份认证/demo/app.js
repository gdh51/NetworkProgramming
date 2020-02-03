const http = require('http'),
    fs = require('fs'),
    path = require('path');

http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, './index.html'), function (err, dir) {
            res.setHeader('Content-Type', 'text/html');
            res.end(dir);
        });
    } else if (req.url === '/login' && req.method === 'post') {

    }
}).listen(3000, function () {
    console.log('running');
});