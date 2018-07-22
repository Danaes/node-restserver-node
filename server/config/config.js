//=== PORT ===
process.env.PORT = process.env.PORT || 3000;

//=== ENVIRONMETN ===
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=== DATABASE ===
let urlDB;

if ( process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = 'mongodb://cafe_user:q12345@ds245971.mlab.com:45971/cafe-course';

process.env.URLBD = urlDB;