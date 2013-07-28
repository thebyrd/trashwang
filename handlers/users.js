module.exports = {
  /**
   * Selfie Signup Page
   */
  signup: function (builder) {
    return builder
      .respond('templates.users.signup')
  },

  login: function (builder) {
    return builder
      .respond('templates.users.login')
  },

  loginPost: function (builder) {
    return builder
      .builds('app.db')
      .builds('loginUser')
        .using('app.db', 'req.body', 'req.session', 'res')
      .redirect('/')
  },

  create: function (builder) {
    return builder
      .builds('app.db')
      .builds('createUser')
        .using('app.db', 'req.body', 'req.session', 'res')
      .redirect('/parties')
  },

  update: function (builder) {
    return builder
      .builds('app.db')
      .builds('updateUser')
        .using('app.db', 'req.body')
      .redirect('/me')
  }
}
