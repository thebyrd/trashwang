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
  createUser: function (db, body, req, res) {
    if (body && body.name && body.email && body.password) {
      console.log('$$$$$$$', req.files)
      db.set('users:' + body.email, JSON.stringify(body), function (err, data) {
        console.log(err||data)
      })
      req.session.user = body
      return body
    } else {
      res.redirect('/signup')
    }
  },

  loginUser: function (db, body, session, res) {
    var defer = Q.defer()
    db.get('users:'+body.email, defer.makeNodeResolver())
    return derfer.promise.then(function (data) {
      var user = JSON.parse(data)
      return body.password == user.password
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
