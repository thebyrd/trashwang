var express = require('express')
var app = express()

var fs = require('fs')
var path = require('path')


app.use(express.static(path.join(__dirname, 'views')))
app.use(express.cookieParser('#factsOnly'))
var RedisStore = require('connect-redis')(express)
app.use(express.session({secret: 'mad sus trashwang', store: new RedisStore()}))
app.use(function (req, res, next) {
  console.log(req.url, '->', req.session)
  req.url == '/' || req.url == '/login' || (req.session && req.session.user) ? next() : res.redirect('/login')
})
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(app.router)
app.use(require('less-middleware')({
  src: '/views',
  compress: true
}))

var soynode = require('soynode')
soynode.setOptions({
  outputDir: '/tmp/soy',
  uniqueDir: true,
  allowDynamicRecompile: true,
  eraseTemporaryFiles: true
})
soynode.compileTemplates(path.join(__dirname, 'views/templates'), function (err) {
  if (err) throw err
  console.log('Matador is fighting bulls on port 3000.')
})

app.use(express.errorHandler())

var Dynamite = require('dynamite')
app.db = new Dynamite.Client({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET
})

app.cdn = new require('knox').createClient({
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET,
  bucket: 'trashwang'
})

app.email = new require('aws-sdk').SES({
  apiVersion: '2010-12-01',
  region: 'us-east-1',
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET
})

var shepherd = require('shepherd')

shepherd.NodeInstance.prototype.createHandler = function () {
  return this._builder.createHandler.apply(this._builder, arguments)
}

shepherd.Builder.prototype.respond = function (template, key) {
  var builder = this
  var fn = function (req, res, next) {
    var promise = builder.run({req: req, res: res, app: app})
    promise
    .fail(function (e) {
      console.log('HANDLER ERROR:', e)
    })
    .then(function (data) {
      data = key ? data[key] : data
      if (req.query.apiv) {
        res.json( {
          success: data.success || true,
          payload: data
        })
      } else {
        var body = soynode.render(template, data)
        data.bodyHtml = body
        data.fromServerSide = true
        var layout = soynode.get(data['layout'] || 'templates.layout.index')
        var html = layout(data, null, {})
        res.send(html)
      }
    })
    .fail(function (e) {
      console.log('RENDER ERROR:', e)
    })
  }
  return fn
}

shepherd.NodeInstance.prototype.respond = function () {
  return this._builder.respond.apply(this._builder, arguments)
}

/**
 * If the route is the name of a node that is built it will redirct to its result
 */
shepherd.Builder.prototype.redirect = function (route) {
  var builder = this
  var fn = function (req, res, next) {
    var promise = builder.run({req: req, res: res, app: app})
    promise
    .fail(function (e) {
      console.log('HANDLER ERROR:', e)
    })
    .then(function (data) {
      res.redirect(data[route] || route)
    })
  }
  return fn
}

shepherd.NodeInstance.prototype.redirect = function () {
  return this._builder.redirect.apply(this._builder, arguments)
}

var graph = new shepherd.Graph()

function getFunctionParams (f) {
  return f.toString()
          .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
          .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
          .split(/,/)
}


fs.readdirSync('./nodes').forEach(function (namespace) {
  var nodes = require('./nodes/' + namespace)
  for (var node in nodes)
    graph.add(node, nodes[node], getFunctionParams(nodes[node])).disableNodeCache()
})


var handlers = {} // "Post.index": function (req, res) {}
fs.readdirSync('./handlers').forEach(function (namespace) {
  namespace = namespace.slice(0, -3)
  var methods = require('./handlers/' + namespace)
  for (var handler in methods) {
    var name = namespace + '.' + handler
    handlers[name] = methods[handler](graph.newBuilder(name))
  }
})

var screens = [] // TODO write middleware to put this in the GLOBALS var
var routes = require('./routes')
for (var route in routes) {
  for (var method in routes[route]) {
    if (method == 'screen') {
      screens.push({route: route, screen: route['screen']})
    } else {
      var handlerName = routes[route][method]
      app[method](route, handlers[handlerName])
    }
  }
}

app.listen(3000)
