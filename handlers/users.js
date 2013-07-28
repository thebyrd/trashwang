module.exports = {
  /**
   * Selfie Signup Page
   */
  signup: function (builder) {
    return builder
    .respond('templates.users.signup')
  },

  newUser: function (builder) {
    return builder
      .builds('app.db')
      .builds('createUser')
        .using('req.body')
        .using('app.db')
      .redirect('/parties')
  }
}
