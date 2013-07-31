var fs = require('fs')
// TR▲SH W▲NG
module.exports = {
  createUser: function (db, cdn, email, body, files) {
    if (body && body.email && body.password && files.picture) {
      // upload file
      var stream = fs.createReadStream(files.picture.path)
      var path = body.email + '-' + files.picture.name
      cdn.putStream(stream, path, {'Content-Length': files.picture.size}, function (err, res) {
        if (err) throw err
      })

      // email user
      email.sendEmail({
        Source: 'david@someshit.io',
        Destination: {
          ToAddresses: [body.email]
        },
        Message: {
          Subject: {
            Data: 'Welcome to TR▲SH W▲NG',
            Charset: 'utf-8'
          },
          Body: {
            Text: {
              Data: 'hi there,\nI just wanted to send you an email to let you know that here at someshit.io we be revolutionizing evra thang. thx for joining the cause.\n - trashwang core team'
            }
          }
        },
        ReplyToAddresses: ['david@someshit.io']
      }, function (err, data){if (err) throw err})


      // create user
      return db.putItem('trashwang', {
        schema: 'user',
        id: body.email,
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
      return db.getItem('trashwang')
      .setHashKey('schema','user')
      .setRangeKey('id', body.email)
      .execute()
      .then(function (data) {
        console.log(data)
        var user = data.result
        if (data.result && user.password == body.password) {
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
  },

  simpleLayout: function (req) {
    return {
      layout: 'templates.layout.simple'
    }
  }
}
