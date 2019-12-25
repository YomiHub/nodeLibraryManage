/* 业务处理模块 */
const path = require('path');
const fs = require('fs');
const db = require('./connectDB.js');

//渲染首页
exports.showIndex = (req, res) => {
  let sql = 'select * from book';
  db.base(sql, null, (results) => {
    res.render('index', { list: results });  //将数据对象命名为list
  })

}

//跳转到
//添加图书页
exports.toAddBook = (req, res) => {
  res.render('addBook', {});  //无需渲染数据
}


//提交表单，添加图书信息到文件中
exports.addBook = (req, res) => {
  let info = req.body;
  let addData = {};

  for (let key in info) {
    addData[key] = info[key];
  }

  let sql = 'insert into book set ?';
  db.base(sql, addData, (results) => {
    if (results.affectedRows == 1) {
      res.redirect('/');
    } else {
      res.send(results);
    }
  })
}

//根据ID查询到图书信息，并跳转页面
exports.toEditBook = (req, res) => {
  let id = req.query.id; //获取到参数：修改图书id
  let sql = 'select * from book where id=?';
  let data = [id];
  db.base(sql, data, (results) => {
    if (results.length > 0) {
      res.render('editBook', results[0]);   //注意查询返回的结果是一个数组，所以要取0
    } else {
      res.send(results);
    }
  })
}

//根据ID修改图书信息
exports.editBook = (req, res) => {
  let info = req.body;
  let sql = 'update book set name=?,author=?,category=?,description=? where id=?';
  let data = [info.name, info.author, info.category, info.description, info.id];
  db.base(sql, data, (results) => {
    if (results.affectedRows == 1) {
      res.redirect('/');
    } else {
      res.send(results);
    }
  })
}

//根据ID删除图书
exports.deleteBook = (req, res) => {
  let id = req.query.id;
  let sql = 'delete from book where id=?';
  let data = [id];
  db.base(sql, data, (results) => {
    if (results.affectedRows == 1) {
      res.redirect('/');
    } else {
      res.send(results);
    }
  })
}