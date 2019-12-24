/* 业务处理模块 */
const data = require('./data.json');
const path = require('path');
const fs = require('fs');


//获取图书id最大值，用函数表达式的方法来定义函数
let maxCode = () => {
  let code = [];
  data.forEach((item) => {
    code.push(item.id);
  });

  return Math.max.apply(null, code);
}

//渲染首页
exports.showIndex = (req, res) => {
  res.render('index', { list: data });  //将数据对象命名为list
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
  addData.id = (maxCode() + 1) + ""; //自增图书id,转为string
  for (let key in info) {
    addData[key] = info[key];
  }
  data.push(addData); //将添加的书放入数组中

  //参数null,4表示格式化json数据，在数据前添加4个空格
  fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(data, null, 4), (err) => {
    if (err) {
      res.send('server erro');
    }

    //文件写入成功后跳转到首页
    res.redirect('/');
  })
}

//根据ID查询到图书信息，并跳转页面
exports.toEditBook = (req, res) => {
  let id = req.query.id; //获取到参数：修改图书id
  let book = {};
  data.forEach((item) => {
    if (item.id == id) {
      book = item;
      return;  //注意在forEach循环中没有for循环使用的break关键字
    }
  });
  res.render('editBook', book);
}

//根据ID修改图书信息
exports.editBook = (req, res) => {
  let info = req.body;
  data.forEach((item) => {
    if (item.id == info.id) {
      for (let key in info) {
        item[key] = info[key];
      }
      return;
    }
  })

  //将数据从内存写入文件
  fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(data, null, 4), (err) => {
    if (err) {
      res.send('server erro');
    }

    //文件写入成功后跳转到首页
    res.redirect('/');
  })
}

//根据ID删除图书
exports.deleteBook = (req, res) => {
  let id = req.query.id;
  data.forEach((item, index) => {
    if (item.id == id) {
      data.splice(index, 1);
    }
    return;
  })

  fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(data, null, 4), (err) => {
    if (err) {
      res.send('server error');
    }
    res.redirect('/');  //返回首页
  })
}