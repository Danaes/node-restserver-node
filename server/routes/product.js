let express = require('express');

let {verifyToken} = require('../middlewares/authentication');

let app = express();

let Product = require('../models/product');

// get all products
app.get('/product', verifyToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Product.find({ avalible: true })
        .skip(desde)
        .limit(5)
        .sort('name')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec( (err, products) => {

            if(err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            Product.count({ avalible: true }, (err, contador) => {
                res.json({
                    ok: true,
                    products,
                    contador
                });
            });
        });
});

// get product by ID
app.get('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec( (err, product) => {

            if(err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            if(!product)
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'El ID no existe'
                    }
                });

            res.json({
                ok: true,
                product
            });
        });
});

// search products
app.get('/product/search/:term', verifyToken, (req, res) => {

    let term = req.params.term;

    let regex = new RegExp(term, 'i');

    Product.find({ name: regex, avalible: true})
        .populate('category', 'description')
        .exec( (err, products) => {

            if(err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            res.json({
               ok: true,
               products
            });

        });

});


// create new product
app.post('/product', verifyToken, (req, res) => {

    let body = req.body;

    let product = new Product({
        name: body.name,
        priceUni: body.priceUni,
        description: body.description,
        img: body.img,
        category: body.category,
        user: req.user._id
    });

    product.save( (err, productDB) => {

        if(err)
            return res.status(500).json({
                ok: false,
                err
            });

        res.status(201).json({
            ok: true,
            product: productDB
        });
    });

});

// update product
app.put('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    let body =  req.body;

    let updateProduct = {
        name: body.name,
        priceUni: body.priceUni,
        description: body.description,
        img: body.img,
        category: body.category,
        user: req.user._id
    };

    Product.findByIdAndUpdate( id, updateProduct, {new: true, runValidators: true}, (err, productDB) => {

        if(err)
            return res.status(500).json({
                ok: false,
                err
            });

        if(!productDB)
            return res.status(400).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            product: productDB
        });

    });

});

// delete product
app.delete('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    let changeAvalible = { avalible: false };

    Product.findByIdAndUpdate( id, changeAvalible, {new: true}, (err, removedProduct) => {

        if(err)
            return res.status(500).json({
                ok: false,
                err
            });

        if( !removedProduct )
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });

        res.json({
            ok: true,
            message: 'Producto eliminado'
        });

    });
});

module.exports = app;