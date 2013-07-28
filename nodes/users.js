var Q = require('kew')

function getUserById(db, userId) {
  var ret = null
  db.hgetall('/users/' + userId, function (err, user) {
    console.log('getUserById', err, user)
    ret = (err ? err : user)
  })
  return ret
}

function getUserByEmail(db, userEmail) {
  var ret = null
  db.get('/users/index/byEmail/' + userEmail, function (err, userId) {
    console.log('getUserByEmail', err, userId)
    var user = getUserById(db, userId)
    ret = (err ? err : user)
  })
  return ret
}

// TR▲SH W▲NG
module.exports = {
  createUser: function (db, body, session, res) {
    var ret
    if (!body) return null

    var defer = Q.defer()

    db.exists('/users/index/byEmail/' + body.email, defer.makeNodeResolver())
    return defer.promise.then(function (data) {
      if (data == 1) {
        res.redirect('/login')
      } else {
        db.set('/users/index/byEmail/' + body.email, 1)
        db.incr('/users', function (err, newId) {
          var user = {
            id: newId,
            email: body.email,
            password: body.password,
            photo: body.photo
          }

          db.hmset('/users/' + newId, user)
          console.log('new user', user)
          return session.user = user
        })
      }
    })
  },

  loginUser: function (db, body, session, res) {
    if (!body || !body.email || !body.password) return null

    var user = getUserByEmail(db, body.email)
    console.log('tried to login with user:', user)
    if (user.password === body.password) {
      session.user = user
      res.redirect('/parties')
    } else {
      res.redirect('/login')
    }
  },

  getUserById: function (db, userId) {
    if (!userId) return null

    return getUserById(db, userId)
  },

  getUserByEmail: function (db, userEmail) {
    if (!userEmail) return null

    return getUserByEmail(db, userEmail)
  },

  filterUser: function (db, user) {
    if (!user) return null
    ;delete user.email
    return user
  },
  simpleLayout: function (req) {
    return {
      layout: 'templates.layout.simple'
    }
  }
}
