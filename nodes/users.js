var fs = require('fs')

// TR▲SH W▲NG
module.exports = {
  createUser: function (db, cdn, body, files) {
    if (body && body.email && body.password && files.picture) {
      // upload file
      var stream = fs.createReadStream(files.picture.path)
      var path = body.email + '-' + files.picture.name
      cdn.putStream(stream, path, {'Content-Length': files.picture.size}, function (err, res) {
        if (err) throw err
      })
      // create user
      return db.user(body.email, {
        password: body.password,
        img: path
      }).execute()
    } else {
      return {
        success: false,
        message: 'invalid parameters'
      }
    }
  },

  validateUser: function (db, body, req) {
    if (body && body.email && body.password) {
      return db.user(body.email)
      .then(function (user) {
        if (user && user.password == body.password) {
          req.session.user = user
          return '/parties'
        } else {
          return '/login'
        }
      })
    } else {
      return '/login'
    }
  },

  logoutUser: function (req) {
    delete req.session
    return '/login'
  },

  getUserByEmail: function (db, userEmail) {
    return db.user(userEmail)
    .then(function (user) {
      return {user: user} || {success: false, message: 'user does not exist'}
    })
  },

  simpleLayout: function (req) {
    return {
      layout: 'templates.layout.simple'
    }
  }
}
