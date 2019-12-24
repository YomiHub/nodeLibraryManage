const express = require('express');
const router = require('./router.js')
const path = require('path');
const template = require('art-template');
const bodyParser = require('body-parser');
const app = express();

//启动静态资源服务，设置虚拟路径www（用于）
app.use('/www', express.static(path.join(__dirname, './public')));

//模板引擎配置
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'art');
app.engine('art', require('express-art-template'));

//body-parser使用设置
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(router);  //路由文件
app.listen(3000, () => {
  console.log('running···')
})