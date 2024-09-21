var http = require('http')
var fs = require('fs')
var template = require('art-template')

var server = http.createServer()

server.on('request', function (req, res) {
  console.log(req.url)
  if (req.url === '/') {
    // 首页
    // 读取html模板渲染页面
    fs.readFile('./views/index.html', function (err, data) {
      if (err) {
        return res.end('404 Not Fond')
      }
      // 使用模板引擎
      var htmlStr = data.toString()
      var htmlRet = template.render(htmlStr, {
        name: 'jack',
        age: 18,
        hobby: 'dance'
      })
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(htmlRet)
    })
  } else if (req.url === '/user') {
    // 留言板
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('<p>hello 世界</p><a href="">点我</a>')
  } else if (req.url.indexOf('/public') === 0) {
    // 读取静态文件
    // 把public文件下的静态资源全部开放出去
    fs.readFile('.' + req.url, function (err, data) {
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
