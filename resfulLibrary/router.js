const express = require('express');
const service = require('./service.js');
const router = express.Router();

//查询所有图书信息
router.get('/books', service.allBooks);

//添加图书信息
router.post('/books/book', service.addBook);

//根据id查询编辑图书的信息
router.get('/books/book/:id', service.getBookById);

//提交编辑后的信息
router.put('/books/book', service.editBook);

//根据id删除图书信息
router.delete('/books/book/:id', service.deleteBook);

module.exports = router;