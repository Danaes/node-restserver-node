const jwt = require('jsonwebtoken');

// === TOKEN VERIFY ===
let verifyToken = (req, res, next ) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err)
            return res.status(401).json({
                ok:  false,
                err: {
                    message: 'Token no valido'
                }
            });

        req.user = decoded.user;
        next();
    });
};

// ===  ADMIN_ROLE VERIFY ===

let verifyAdminRole = (req, res, next) => {

    let user = req.user;

    if( user.role !== 'ADMIN_ROLE')
        return res.status(400).json({
            ok:  false,
            err: {
                message: 'El usuario no es administrador'
            }
        });

    next();
};

module.exports = {
    verifyToken,
    verifyAdminRole
};