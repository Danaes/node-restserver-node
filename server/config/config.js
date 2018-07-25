//=== PORT ===
process.env.PORT = process.env.PORT || 3000;

//=== ENVIRONMETN ===
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=== DATABASE ===
let urlDB;

if ( process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = process.env.MONGO_URI;

process.env.URLBD = urlDB;

// === TOKEN EXPIRATON ===
// 3O DÍAS
process.env.TOKEN_EXPIRATON = 60 * 60 * 24 * 30;

// === SEED ===
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// === Google ClientID ===
process.env.CLIENT_ID = process.env.CLIENT_ID || '27094936869-h8t9g3rkronjsqgv0kvot4h6i9jht8l4.apps.googleusercontent.com';