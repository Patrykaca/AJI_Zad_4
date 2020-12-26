const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "kaca",
    database: "aji_zad_4",
    host: "localhost",
    port: 5432
});

module.exports = pool;
