let express = require('express');

let {verifyToken, verifyAdminRole} = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');

// get all categories
app.get('/category', verifyToken, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email role')
        .exec( (err, categories) => {

            if(err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            Category.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categories,
                    contador: conteo
                });
            });
        });
});

// get category by ID
app.get('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Category.findById(id)
        .exec( (err, category) => {

            if(err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            res.json({
                ok: true,
                category
            });
        });
});

// create new category
app.post('/category', verifyToken, (req, res) => {

    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save( (err, categoryDB) => {

        if(err)
            return res.status(500).json({
                ok: false,
                err
            });

        if(!categoryDB)
            return res.status(400).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            category: categoryDB
        });
    });

});

// update category
app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    let body =  req.body;

    let updateCategory = { description: body.description};

    Category.findByIdAndUpdate( id, updateCategory, {new: true, runValidators: true}, (err, categoryDB) => {

        if(err)
            return res.status(500).json({
                ok: false,
                err
            });

        if(!categoryDB)
            return res.status(400).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            category: categoryDB
        });

    });

});

// delete category
app.delete('/category/:id', [ verifyToken, verifyAdminRole ], (req, res) => {
    let id =  req.params.id;

    Category.findByIdAndRemove(id , (err, removedCategory) => {

        if(err)
            return res.status(500).json({
                ok: false,
                err
            });

        if(!removedCategory)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });

        res.json({
           ok: true,
           message: 'Categoría borrada'
        });

    });
});

module.exports = app;