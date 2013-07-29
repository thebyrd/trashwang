var Q = require('kew')

// TR▲SH W▲NG
module.exports = {
  createUser: function (db, body, session, res) {
    if (body && body.name && body.email && body.password) {

    

    } else {
      res.redirect('/signup')
    }
  },

  loginUser: function (db, body, session, res) {
    if (body && body.email && body.password) {

    }
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
