const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files)
        return res.status(400).json({
            ok: false,
            message: 'No se ha seleccionado ningún archivo'
        });

    //Validar tipo
    let tiposValidos = ['user','product'];

    if(tiposValidos.indexOf( tipo ) < 0)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos válidos son '+ tiposValidos.join(', '),
                tipo
            }
        });


    let archivo = req.files.archivo;
    let fileName = archivo.name.split('.');
    let extension = fileName[fileName.length - 1];

    //Extensiones permitidas
    let extesionesValidas = ['png','jpg','gif','jpeg'];

    if(extesionesValidas.indexOf( extension ) < 0)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones válidas son '+ extesionesValidas.join(', '),
                ext: extension
            }
        });

    //Cambiar el nombre del archivo
    let name = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }s/${ name }`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        switch (tipo){
            case 'user':
                imgUser(id, res, name);
                break;
            case 'product':
                imgProduct(id, res, name);
                break;
        }
    });

});

function imgUser(id, res, fileName){

    User.findById(id, (err, user) => {

       if(err) {
           removeFile(fileName, 'users');

           return res.status(500).json({
               ok: false,
               err
           });
       }

       if(!user) {
           removeFile(fileName, 'users');

           return res.status(400).json({
               ok: false,
               err: {
                   message: 'El usuario no existe'
               }
           });
       }

       removeFile(user.img, 'users');

       user.img = fileName;

       user.save((err, userDB) => {

           if(err)
               return res.status(500).json({
                   ok: false,
                   err
               });

           res.json({
               ok: true,
               user: userDB,
               img: fileName
           });
       })
    });
}

function imgProduct(id, res, fileName){
    
    Product.findById(id, (err, product) => {

        if(err) {
            removeFile(fileName, 'products');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!product) {
            removeFile(fileName, 'products');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        removeFile(product.img, 'products');

        product.img = fileName;

        product.save((err, productDB) => {

            if(err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            res.json({
                ok: true,
                product: productDB,
                img: fileName
            });
        })
    });
}

function removeFile(fileName, tipo){
    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ fileName }`);

    if( fs.existsSync(pathImg) )
        fs.unlinkSync(pathImg);
}

module.exports = app;