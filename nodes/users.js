var Q = require('kew')

function getUserById(db, userId, callback) {
  db.hgetall('/users/' + userId, callback)
}

function getUserByEmail(db, userEmail, callback) {
  db.get('/users/index/byEmail/' + userEmail, function (err, userId) {
    getUserById(db, userId, callback)
  })
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
        db.incr('/users', function (err, newId) {
          db.set('/users/index/byEmail/' + body.email, newId)
          var user = {
            id: newId,
            email: body.email,
            password: body.password,
            photo: body.photo
          }

          db.hmset('/users/' + newId, user, function () {})
          console.log('new user', user)
          return session.user = user
        })
      }
    })
  },

  loginUser: function (db, body, session, res) {
    if (!body || !body.email || !body.password) return null

    return getUserByEmail(db, body.email, function (err, user) {
      if (user && (user.password == body.password)) {
        session.user = user
        res.redirect('/parties')
      } else {
        res.redirect('/login')
      }
    })
  },

  continueOrRedirect: function (res, session) {
    session.user ? res.redirect('/login') : res.redirect('/parties')
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
