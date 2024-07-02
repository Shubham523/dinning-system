const mysql =require("mysql2/promise");

const dbPool = mysql.createPool({
    host : "localhost",
    user : "root",
    password: "sxza345.",
    database:"dinningsystem",

})

module.exports = dbPool;