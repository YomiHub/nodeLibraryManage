/* nodejs实现图书管理系统后台resful接口 */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./router.js');
const app = express();

//设置静态资源的虚拟目录为/www
app.use('/www', express.static(path.join(__dirname, './public')));

//body-parser使用设置
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(router);
app.listen(3000, () => {
  console.log('running···');
})


