require('./config/config');
require('colors');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// rutes config
app.use( require('./routes/index') );

// Enable folder public
app.use( express.static ( path.resolve( __dirname, '../public') ));

mongoose.connect(process.env.URLBD, (err, res) => {

    if(err) throw err;

    console.log('Base de datos ON-LINE'.green);
});

app.listen(process.env.PORT, () => console.log(`Listening port ${process.env.PORT}`));