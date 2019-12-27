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