const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_KEY = "lk4jsd5LKJ5hHGhl8776kjlh5h634hlrek5867IYGG89Ggdrg8g8odfngiojpserh";

exports.createAccessToken = function (user) {
    const payload = {
        id: user._id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        createToken: moment().unix(),
        exp: moment().add(3, 'hours').unix()
    }

    return jwt.encode(payload, SECRET_KEY);
}

exports.createRefreshToken = function (user) {
    const payload = {
        id: user._id,
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, SECRET_KEY);
}

exports.decodedToken = (token) => {
    return jwt.decode(token, SECRET_KEY, true);
}