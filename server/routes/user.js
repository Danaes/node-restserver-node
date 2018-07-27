const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('.././models/user');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

const app = express();

app.get('/user', [ verifyToken ], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    User.find({ status: true }, 'name email google role status img')
        .skip(desde)
        .limit(limite)
        .exec( (err, users) => {

            if(err)
                return res.status(400).json({
                    ok: false,
                    err
                });

            User.count({ status: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    users,
                    contador: conteo
                });
            });
        });

});

app.post('/user', [ verifyToken, verifyAdminRole ], (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save( (err, userDB) => {

        if(err)
            return res.status(400).json({
                ok: false,
                err
            });

        res.json({
           ok: true,
           user: userDB
        });
    });
});

app.put('/user/:id', [ verifyToken, verifyAdminRole ], (req, res) => {

    let id = req.params.id;
    let body =  _.pick(req.body, ['name','email','img','role','status']);

    User.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, userDB) => {

        if(err)
            return res.status(400).json({
                ok: false,
                err
            });


        res.json({
            ok: true,
            user: userDB
        });

    });
});

app.delete('/user/:id', [ verifyToken, verifyAdminRole ], (req, res) => {

    let id = req.params.id;

    let changeStatus = { status: false };

    User.findByIdAndUpdate( id, changeStatus, {new: true}, (err, userDeleted) => {

        if(err)
            return res.status(400).json({
                ok: false,
                err
            });

        if( !userDeleted )
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });

        res.json({
            ok: true,
            user: userDeleted
        });

    });
});

module.exports = app;