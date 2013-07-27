module.exports = {
  /**
   * Selfie Signup Page
   */
  signup: function (builder) {
    return builder
    .builds('app.db')
    .builds('someNode')
      .using('app.db')
    .respond('templates.users.signup', 'someNode')      
  }
}
