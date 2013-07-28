module.exports = {
  /**
   * Selfie Signup Page
   */
  signup: function (builder) {
    return builder
    .builds('app.db')
    .respond('templates.users.signup', 'someNode')
  },

  newUser: function (builder) {
    return builder
      .builds('app.db')
      .builds('createUser')
        .using('app.db')
      .redirect('/parties')
  }
}
