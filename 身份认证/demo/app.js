const http = require('http'),
    fs = require('fs'),
    path = require('path'),
    jsonwebtoken = require('jsonwebtoken');

http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, './index.html'), function (err, dir) {
            res.setHeader('Content-Type', 'text/html');
            res.end(dir);
        });
    } else if (req.url === '/login' && req.method === 'POST') {
        let str = '';
        req.on('data', chunk => {
            str += chunk;
        });
        req.on('end', () => {
            // 处理完成的数据传输的逻辑
            let USER_DATA = JSON.parse(str);
            let {
                password,
                username
            } = USER_DATA;
            res.writeHead(200, {
                'Content-Type': 'text/plain;charset=UTF-8'
            });
            if (username === 'admin' && password === '123') {
                res.end(JSON.stringify({
                    code: 200,
                    msg: '正确',
                    token: jsonwebtoken.sign({
                        username,
                        password
                    }, 'lazybones', {
                        expiresIn: 300
                    })
                }));
            } else {
                let msg = JSON.stringify({
                    code: 404,
                    msg: '不正确'
                });
                res.end(msg);
            }
        });
    }
}).listen(3000, function () {
    console.log('running');
});