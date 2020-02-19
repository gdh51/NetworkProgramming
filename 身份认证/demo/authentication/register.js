const { UNKNOWN, FIND } = require('./code-and-reward');
const { verifyJWT, genJWT } = require('./jwt/index')

// 验证数据库或其他地方的用户密码是否正确，暴露一个回调函数
function dbAuth (payload, fn) {
    return new Promise((resolve, reject) => {
        fn.call(null, resolve, reject, payload);

        // 如果没有手动更新状态，那么，自动拒绝
        reject(UNKNOWN);
    });
}

async function register (payload) {
     let userData = await dbAuth(payload, function (resolve, reject, proof) {

        // 数据库验证后返回信息
        resolve({
            username: payload.username
        });
    });

    return genJWT(userData);
}