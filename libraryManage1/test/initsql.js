/* 把data.json中的数据拼接成sql语句之后存储到data.sql文件中 */
const path = require('path');
const fs = require('fs');

fs.readFile(path.join(__dirname, '../', 'data.json'), 'utf8', (err, content) => {
  if (err) return;
  let data = JSON.parse(content);
  let arrData = [];
  data.forEach((item) => {
    let sql = `insert into book (name,author,category,description) values ('${item.name}','${item.author}','${item.category}','${item.desc}');`;
    arrData.push(sql);
  })

  //写入文件
  fs.writeFile(path.join(__dirname, './data.sql'), arrData.join(''), 'utf8', (err) => {
    if (err) {
      console.log('write erro');
      return;
    }
    console.log('data init finished!')
  })
})