//mysql通用通用操作封装
const mysql = require('mysql');

exports.base = (sql, data, callback) => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpass',
    database: 'library'
  });

  connection.connect();

  connection.query(sql, data, function (error, results, fields) {
    if (error) throw error;
    callback(results);  //数据库操作是异步的，所以通过回调函数返回操作结果
  })
  connection.end();
}
