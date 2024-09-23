var http = require('http')
var fs = require('fs')
var template = require('art-template')

// url模块的parse()方法可以解析url地址为一个json数据
var url = require('url')

var server = http.createServer()

// 渲染数据
var comments = [
  {
    name: '张三',
    message: '你好，我是张三',
    time: '2020/01/22'
  },
  {
    name: '李四',
    message: '你好，我是李四',
    time: '2020/01/22'
  },
  {
    name: '王五',
    message: '你好，我是王五',
    time: '2020/01/22'
  },{
    name: '张六',
    message: '你好，我是张六',
    time: '2020/01/22'
  }
]

server.on('request', function (req, res) {
  // 获取url对象
  var pathObj = url.parse(req.url, true)
  var pathName = pathObj.pathname // 获取路由

  console.log(pathName)
  if (pathName === '/' || pathName === '/index.html') {
    // 首页
    // 读取html模板渲染页面
    fs.readFile('./views/index.html', function (err, data) {
      if (err) {
        return res.end('404 Not Fond')
      }
      var htmlStr = template.render(data.toString(), {
        comments: comments
      })
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(htmlStr)
    })
  } else if (pathName === '/post') {
    fs.readFile('./views/post.html', function (err, data) {
      if (err) {
        return res.end('404 Not Found')
      }

      res.end(data)
    })
  } else if (pathName === '/pinglun') {
    // 表单提交，获取数据
    var comment = pathObj.query
    comment.time = (new Date()).toLocaleDateString()
    comments.unshift(comment)
    // 获取数据后通过服务器让页面重定向到首页更新数据
    //     1、状态码设置为 302 临时重定向
    //      statusCode
    //     2、在响应头中告诉客户端往哪儿重定向
    //       setHeader
    res.statusCode = 302
    res.setHeader('Location', '/')
    res.end()

  } else if (pathName === '/tmp.html') {
    // 读取html模板渲染页面
    fs.readFile('./views/tmp.html', function (err, data) {
      if (err) {
        return res.end('404 Not Fond')
      }
      // 使用模板引擎
      var htmlStr = data.toString()
      var htmlRet = template.render(htmlStr, {
        name: 'jack',
        age: 19,
        hobby: 'dance'
      })
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(htmlRet)
    })
  } else if (pathName.indexOf('/public') === 0) {
    // 读取静态文件，这里要单独配置才能读取静态文件
    // 把public文件下的静态资源全部开放出去
    fs.readFile('.' + pathName, function (err, data) {
      if (err) {
        return res.end('404 Not Found')
      }
      res.end(data)
    })
  } else if (pathName.indexOf('/views/common') === 0) {
    // 读取公共html文件
    fs.readFile('.' + pathName, function (err, data) {
      if (err) {
        return res.end('404 Not Found')
      }
      res.end(data)
    })
  } else {
    // 其他
    fs.readFile('./views/404.html', function (err, data) {
      if (err) {
        return res.end('404 Not Found')
      }
      res.end(data)
    })
  }
})

server.listen(3000, function () {
  console.log('server is running...')
})
