const http = require('http');
const fs = require('fs');

http.createServer(function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    if (!req.headers.cookie) {
        res.setHeader('Set-Cookie', 'c1=b1; max-age=30000; Samesite=Strict');
    }
    console.log(req.method)
    if (req.method.toLowerCase() === 'get') {
        res.setHeader('Content-Type', 'text/html');
        fs.readFile('./victim.html', function (err, file) {
            res.end(file);
        });
        return;
    }

    res.end(JSON.stringify(req.headers));
}).listen(3000, function () {
    console.log('listening...');
});