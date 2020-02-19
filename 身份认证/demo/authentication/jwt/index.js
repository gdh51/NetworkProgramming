const jsonwebtoken = require('jsonwebtoken');
const PRIVATE_KEY = 'lazybones';
const defaultOpt = {
    expriresIn: 300,
    issuer: 'Lazybones'
};

// 生成JWT
function genJWT (userData) {
    return jsonwebtoken.sign(userData, PRIVATE_KEY, defaultOpt);
}

// 注销JWT
function cancelJWT (JWT) {

}

// 更新JWT

// 验证JWT
function verifyJWT (token = '') {
    return jsonwebtoken.verify(token, PRIVATE_KEY, defaultOpt);
}

module.exports = {
    genJWT,
    verifyJWT
};