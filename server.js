var express = require('express')
var app = express()

var fs = require('fs')
var path = require('path')

var config = require('./config')

app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(express.cookieParser('#factsOnly'))
app.use(express.session({secret: 'mad sus trashwang'}));
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

app.use(express.static(path.join(__dirname, 'views')))
app.use(express.errorHandler())

app.db = new require('then-redis').createClient()

var isAuthenticated = function (req, res, next) {
  req.session.user ? next() : res.redirect('/login')
}

app.get(['/', '/signup'], function (req, res) {
  if (req.query.apiv) {
    res.json( {
      success: true,
      payload: {}
    })
  } else {
    var page = {}
    page.bodyHtml = soynode.render('templates.users.signup')
    page.fromServerSide = true
    var layout = soynode.get('templates.layout.index')
    var html = layout(page, null, {})
    res.send(html)
  }
})

app.get('/login', function (req, res) {
  var page = {}
  page.bodyHtml = soynode.render('templates.users.login')
  var layout = soynode.get('templates.layout.index')
  var html = layout(page, null, {})
  res.send(html)
})

app.post('/login', function (req, res) {
  console.log('trying to login', req.body)
  if (!req.body || !req.body.email || !req.body.password) return null

  return app.db.get('/user/index/byEmail/' + req.body.email)
    .then(function (userId) {
      console.log('found userid', userId)
      return app.db.hgetall('/user/' + userId)
    }).then(function (user) {
      console.log('found user', user)
      if (user.password != req.body.password) throw new Error('not valid auth')
      return req.session.user = user
    })
    .then(function () {
      res.redirect('/parties')
    }, function (e) {
      res.redirect('/login')
    })
})

app.post('/users', function (req, res) {
  console.log('make a user', req.body)
  if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
    res.redirect('/')
    return null
  }

  return app.db.exists('/user/index/byEmail/' + req.body.email)
    .then(function (exists) {
      if (exists == 1) throw new Error('user already exists')
      else return app.db.incr('/user')
    })
    .then(function (newId) {
      var user = {
        id: newId,
        email: req.body.email,
        password: req.body.password,
        photo: req.body.photo
      }

      app.db.set('/user/index/byEmail/' + req.body.email, newId)
      app.db.hmset('/user/' + newId, user)
      console.log('new user', user)
      req.session.user = user
      res.redirect('/parties')
    }, function (e) {
      res.redirect('/')
    })
})

function getPartyById(db, partyId) {
  return app.db.get('/party/' + partyId)
}

app.get('/parties', function (req, res) {
  var parties = app.db.smembers('/parties')
    .then(function (partyIds) {
      console.log('partyIds', partyIds)
      if (!partyIds) {
        return []
      } else {
        var content = getPartyById(partyIds[0])
        for (var i = 1; i < partyIds.length; i++) {
          content.then(getPartyById(partyIds[i]))
        }

        return content
      }
    })

  if (req.query.apiv) {
    res.json( {
      success: true,
      payload: {parties: parties}
    })
  } else {
    var page = {}
    page.bodyHtml = soynode.render('templates.parties.index', {parties: parties})
    var layout = soynode.get('templates.layout.index')
    var html = layout(page, null, {})
    res.send(html)
  }
})


// fs.readdirSync('./nodes').forEach(function (namespace) {
//   var nodes = require('./nodes/' + namespace)
//   for (var node in nodes)
//     graph.add(node, nodes[node], getFunctionParams(nodes[node])).disableNodeCache()
// })


// var handlers = {} // "Post.index": function (req, res) {}
// fs.readdirSync('./handlers').forEach(function (namespace) {
//   namespace = namespace.slice(0, -3)
//   var methods = require('./handlers/' + namespace)
//   for (var handler in methods) {
//     var name = namespace + '.' + handler
//     handlers[name] = methods[handler](graph.newBuilder(name))
//   }
// })

// var screens = [] // TODO write middleware to put this in the GLOBALS var
// var routes = require('./routes')
// for (var route in routes) {
//   for (var method in routes[route]) {
//     if (method == 'screen') {
//       screens.push({route: route, screen: route['screen']})
//     } else {
//       var handlerName = routes[route][method]
//       app[method](route, handlers[handlerName])
//     }
//   }
// }

app.listen(config.port)
console.log('TrashWang on port', config.port)
