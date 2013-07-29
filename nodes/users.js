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
      return db.putItem('trashwang', {
        schema: 'user',
        id: body.email,
        password: body.password,
        img: path
      }).execute()
    } else {
      res.redirect('/signup')
    }
  },

  loginUser: function (db, body, session, res) {
    if (body && body.email && body.password) {
      return db.getItem('trashwang')
                .setHashKey('schema','users')
                .setRangeKey('id', body.email)
                .execute()
                .then(function (data) {
                  console.log(data)
                  var user = data.result
                  if (user.password == body.password) {
                    session.user = user
                    return true
                  } else {
                    res.redirect('/login')
                  }
                })
    } else {
      res.redirect('/login')
    }
  },

  getUserByEmail: function (db, userEmail) {
  },

  simpleLayout: function (req) {
    return {
      layout: 'templates.layout.simple'
    }
  }
}
