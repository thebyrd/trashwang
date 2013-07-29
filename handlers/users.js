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

  /**
   * Creates a user and redirects them to a list of parties.
   * Expects to be handling a POST request
   */
  create: function (builder) {
    return builder
      .builds('app.db')
      .builds('app.cdn')
      .builds('createUser')
        .using('app.db', 'app.cdn', 'req.body', 'req.files', 'res')
      .redirect('/parties')
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
