# nodeLibraryManage
基于Nodejs与Express框架实现图书信息的增删查改业务（ajax、mysql、body-parser、art-template）



### 基于express实现图书信息的增删改查
> 该项目一共包含三个版本，前两个版本是存储方式不同，第三个版本是渲染方式不同。

> 实现该项目可以用到两种存储方法，一种是使用静态的json文件存储图书信息，通过对文件内容的修改实现增删改查的功能，对应版本0；另外一个版本是结合mysql包，通过mysql数据库存储图书信息，实现相同的功能，对应版本1。

> 以上两种存储方式都是基于后端渲染模板实现数据更新，还有一种就是基于ajax通过前端渲染实现数据更新，对应版本2。

#### 开发准备
- node环境安装，这里用的版本是v12.10.0
- npm安装，这里使用的版本是6.10.0
- 创建空项目文件夹libearyManage，在文件夹下新建入口文件index.js，然后初始化项目`npm init -y`
- 在本地安装依赖的包 `npm install express art-template body-parser --save` 
- 为使express兼容art-template还需要安装包 `npm install express-art-template --save`
- node操作数据库依赖的mysql包 `npm install mysqljs/mysql --save`
- mysql环境：Server version: 5.7.24 MySQL Community Server (GPL)
- 使用到的开发文档: [express]("http://www.expressjs.com.cn/guide/using-template-engines.html")、[art-template]("https://aui.github.io/art-template/zh-cn/docs/syntax.html")、[express-art-template]("https://github.com/aui/express-art-template")、[body-parser]("https://github.com/expressjs/body-parser#readme")、[mysql](https://github.com/mysqljs/mysql)
- 数据库管理设计工具：navicat

#### 入口文件index.js
- 代码[链接](https://github.com/YomiHub/nodeLibraryManage/blob/master/libraryManage/index.js)

```js
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
```

#### 静态资源
- 在目录下新建public目录用于存放静态资源，例如页面引入的css文件、静态页面html文件、图片

#### 页面模板文件
- 在目录下新建data.json模拟后台数据（基于mysql版本则不需要该文件）

```json
[
  {
    "id": "1",
    "name": "三国演义",
    "author": "罗贯中",
    "category": "文学",
    "desc": "一个杀伐纷争的年代"
  },
  {
    "id": "2",
    "name": "水浒传",
    "author": "施耐庵",
    "category": "文学",
    "desc": "108条好汉的故事"
  },
  {
    "id": "3",
    "name": "西游记",
    "author": "吴承恩",
    "category": "文学",
    "desc": "佛教与道教的斗争"
  },
  {
    "id": "4",
    "name": "红楼梦",
    "author": "曹雪芹",
    "category": "文学",
    "desc": "一个封建王朝的缩影"
  },
  {
    "name": "天龙八部",
    "author": "金庸",
    "category": "文学",
    "desc": "武侠小说",
    "id": 5
  }
]
```

- 在项目目录下新建views文件夹，并在文件夹下新建index.art、addBook.art、editBook.art （可以先编写.html静态文件，之后再改写为模板文件），文件具体内容[链接](https://github.com/YomiHub/nodeLibraryManage/tree/master/libraryManage/views)
  - index.art用于显示图书信息，以及提供跳转入口
  - addBook.art 是一个表单，用于添加图书信息
  - editBook.art  与addBook.art类似，但是需要渲染数据，用于修改图书信息


#### 业务处理模块
- 创建service.js文件，在该文件内处理业务
  + 基于静态json文件的实现[链接](https://github.com/YomiHub/nodeLibraryManage/blob/master/libraryManage/service.js)
  + 基于mysql数据库存储的实现[链接](https://github.com/YomiHub/nodeLibraryManage/blob/master/libraryManage1/service.js)

#### 路由模块
- 创建router.js文件，在该文件内处理路由
  + 基于静态json文件的实现[链接](https://github.com/YomiHub/nodeLibraryManage/blob/master/libraryManage/router.js)


#### 数据库准备
- 启动数据库：`net start mysql`（对应关闭数据库的命令为`net stop mysql`）
- 用navicat创建数据库：命名为library、字符集为utf8 -- UTF-8 Unicode、排序规则为utf8_bin
- 在数据库library中新建表book，包含字段id、name、author、category、description
- 创建connectDB.js文件用于存放数据库操作通用api 

```js
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

```

#### 在项目目录下创建文件夹test，用于专门存放测试脚本
- initsql.js 用于将json文件转成insert语句，初始化数据，生成data.sql文件，在navicat中运行sql语句插入数据

```js
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
```

</br>

-------
#### 版本2
> 前后端分离，通过ajax请求在前端完成页面的渲染。开发环境与上述两个版本一致，但因为不需要后端渲染，所以依赖的包有所不同

#### 开发准备
- 创建项目resfulLibrary，在项目下创建入口文件index.js，初始化项目 `npm init -y`
- 安装express `npm install express body-parser --save`
- 安装node操作数据库依赖的mysql包 `npm install mysqljs/mysql --save`
- 数据库常用操作封装connectDB.js，文件内容[链接](https://github.com/YomiHub/nodeLibraryManage/blob/master/libraryManage1/connectDB.js)
- index.js作为入口文件

```js
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

```

#### 路由管理router.js（采用resful接口）

```js
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
```

#### 业务处理service.js（采用resful接口）
- 主要包括图书的增删改查

```js
const db = require('./connectDB.js');

exports.allBooks = (req, res) => {
  let sql = 'select * from book';
  db.base(sql, null, (result) => {
    res.json(result);
  })
}

exports.addBook = (req, res) => {
  let info = req.body;
  let sql = 'insert into book set ?';
  db.base(sql, info, (result) => {
    if (result.affectedRows == 1) {
      res.json({ flag: 1 });
    } else {
      res.json({ flag: 2 });
    }
  })
}

exports.getBookById = (req, res) => {
  let id = req.params.id;
  let sql = 'select * from book where id=?';
  let data = [id];
  db.base(sql, data, (result) => {
    res.json(result[0]);
  })
}

exports.editBook = (req, res) => {
  let info = req.body;
  let sql = 'update book set name=?,author=?,category=?,description=? where id=?';
  let data = [info.name, info.author, info.category, info.description, info.id];
  db.base(sql, data, (result) => {
    if (result.affectedRows == 1) {
      res.json({ flag: 1 });
    } else {
      res.json({ flag: 2 });
    }
  })
}

exports.deleteBook = (req, res) => {
  let id = req.params.id;
  let sql = 'delete from book where id=?';
  let data = [id];

  db.base(sql, data, (result) => {
    if (result.affectedRows == 1) {
      res.json({ flag: 1 });
    } else {
      res.json({ flag: 2 });
    }
  })
}

```

#### 创建静态资源目录public存放静态文件，在目录下创建js、css文件夹、html文件
- 在js文件夹中放依赖的js文件：[template-web.js](https://aui.github.io/art-template/zh-cn/docs/installation.html)、[jquery-3.1.0.min.js](https://blog.jquery.com)、[dialog.js](https://github.com/YomiHub/nodeLibraryManage/blob/master/resfulLibrary/public/js/dialog.js)

#### 前端页面渲染
- 首页[public/index.html](https://github.com/YomiHub/nodeLibraryManage/blob/master/resfulLibrary/public/index.html)
- 首页样式文件[public/css/index.css](https://github.com/YomiHub/nodeLibraryManage/blob/master/resfulLibrary/public/css/index.css)
- 首页交互[public/is/index.js](https://github.com/YomiHub/nodeLibraryManage/blob/master/resfulLibrary/public/js/index.js)

```js
//事件处理,通过ajax请求获取数据渲染前端页面
$(function () {
  //127.0.0.1:3000/books  渲染首页
  initIndexlist();

  //添加图书按钮事件
  function addBook() {
    $('#toaddbook-btn').click(function () {
      var form = $('#book-form');

      //实例化弹窗，MarkBox操作的是原生的dom，所以需要将jquery对象转为原生的dom
      var dialog = new MarkBox(600, 400, "添加图书", form.get(0));
      dialog.init();

      //绑定了添加图书和修改图书信息的按钮事件，所以绑定事件之前需要解绑事件
      form.find('input[type=button]').unbind('click').click(function () {
        //提交添加图书表单
        $.ajax({
          type: "post",
          url: "/books/book",
          dataType: "json",
          data: form.serialize(),  //格式化表单数据
          success: function (data) {
            if (data.flag == 1) {
              initIndexlist();  //图书添加成功刷新列表数据
              dialog.close();
            }
          }
        })
      })
    })
  }


  //初始化列表
  function initIndexlist() {
    $.ajax({
      type: 'get',
      url: '/books',
      dataType: 'json',
      success: function (data) {
        //第一个参数为模板id（带引号），第二个参数为渲染数据
        var html = template('indexTpl', { list: data });

        //渲染数据列表
        $('#book-list').html(html);

        //必须在渲染数据完成后才可以对列表进行修改和删除操作
        $('#book-list').find("tr").each(function (index, ele) {
          //ele是原生对象，要用$转成jquery对象
          var td = $(ele).find('td:eq(5)');  //第6列是操作按钮
          var id = $(ele).find('td:eq(0)').text();  //第1列存放的是id
          //编辑图书信息按钮
          td.find('a:eq(0)').click(function () {
            editBook(id);
          })

          //删除图书信息操作
          td.find('a:eq(1)').click(function () {
            deleteBook(id);
          })

          //绑定添加图书信息的按钮事件
          addBook();

          //与修改表单信息同一个form,所以需要清空表单
          var form = $('#book-form');
          form.get(0).reset();  //该方法不能清空隐藏元素的内容
          form.find('input[type=hidden]').val('');
        })
      }
    })
  }

  //编辑图书信息
  function editBook(id) {
    var form = $('#book-form');
    var dialog = new MarkBox(600, 400, "修改图书信息", form.get(0));
    $.ajax({
      type: 'get',
      url: '/books/book/' + id,
      dataType: 'json',
      success: function (data) {
        form.find('input[name=id]').val(data.id);
        form.find('input[name=name]').val(data.name);
        form.find('input[name=author]').val(data.author);
        form.find('input[name=category]').val(data.category);
        form.find('input[name=description]').val(data.description);
        dialog.init();
        form.find('input[type=button]').unbind('click').click(function () {
          //提交修改后的表单信息
          $.ajax({
            type: 'put',
            url: '/books/book',
            data: form.serialize(),
            dataType: 'json',
            success: function (data) {
              if (data.flag == '1') {
                initIndexlist();
                dialog.close();
              }
            }
          })
        })
      }
    })
  }

  //删除图书信息
  function deleteBook(id) {
    $.ajax({
      type: 'delete',
      url: '/books/book/' + id,
      dataType: 'json',
      success: function (data) {
        if (data.flag == '1') {
          initIndexlist();
        }
      }
    })
  }
})
```

项目[地址](https://github.com/YomiHub/nodeLibraryManage)，通过在每个版本的项目目录下运行命令`npm install`安装依赖的包，启动服务index.js，访问本地本地ip[127.0.0.1:3000]