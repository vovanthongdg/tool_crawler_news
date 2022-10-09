const mysql = require('mysql');


const conn = mysql.createConnection({
    host    : '3.0.209.240',  
    user    : 'root',
    password: 'a7ed48b900cb04a0b',
    database: 'fastnews'
});
//kết nối.
conn.connect(function (err){
    //nếu có nỗi thì in ra
    if (err) {
        throw err.stack;
        
    }
    //nếu thành công
    console.log('Kết nối thành công!!!');
    
});
module.exports = conn;