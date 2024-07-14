const mysql = require('mysql');


const conn = mysql.createConnection({
    host    : 'localhost',  
    user    : 'root',
    password: '',
    database: 'newsapp'
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