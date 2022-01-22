const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_KEY = "lk4jsd5LKJ5hHGhl8776kjlh5h634hlrek5867IYGG89Ggdrg8g8odfngiojpserh";

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({message: "La peticion no tiene cabecera de Autenticacion."});
    } else {
        const token = req.headers.authorization.replace(/['"]+/g, "");

        try {
            var payload = jwt.decode(token, SECRET_KEY);

            if (payload.exp <= moment.unix()) {
                return res.status(404).send({message: 'El token ha expirado.'});
            }
        } catch (err) {
            console.log(err);
            return res.status(404).send({message: 'Token invalido.'});
        }
    }

    req.user = payload;
    next();
}
