/* 路由模块 */
const express = require('express');
const router = express.Router();
const service = require('./service.js');

//渲染主页
router.get('/', service.showIndex);

//跳转
router.get('/toAddBook', service.toAddBook);  //添加图书页面
router.get('/toEditBook', service.toEditBook);  //修改图书页面

//提交表单
router.post('/addBook', service.addBook);  //添加图书
router.post('/editBook', service.editBook);  //修改图书信息
router.get('/deleteBook', service.deleteBook); //删除图书信息
module.exports = router;