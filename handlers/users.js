module.exports = {
  /**
   * Selfie Signup Page
   */
  signup: function (builder) {
    return builder
    .builds('simpleLayout')
      .using('req')
    .respond('templates.users.signup', 'simpleLayout')
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
      .builds('continueOrRedirect')
        .using('res', 'res.session')
      .redirect('/parties')
  },

  create: function (builder) {
    return builder
      .builds('app.db')
      .builds('createUser')
        .using('app.db', 'req.body', 'req.session', 'res')
      .redirect('/parties')
  }
}
