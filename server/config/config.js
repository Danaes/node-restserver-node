//=== PORT ===
process.env.PORT = process.env.PORT || 3000;

//=== ENVIRONMETN ===
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=== DATABASE ===
let urlDB;

if ( process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = proccess.env.MONGO_URI;

process.env.URLBD = urlDB;