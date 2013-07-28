module.exports = {
  /**
   * Selfie Signup Page
   */
  index: function (builder) {
    return builder
      .builds('app.db')
      .builds('getAllParties')
        .using('app.db', 'req.params')
      .respond('templates.parties.index', 'getAllParties')
  },
  create: function (builder) {
    return builder
      .builds('app.db')
      .builds('createParty')
        .using('app.db', 'req.body')
      .respond('templates.parties.show', 'createParty')
  },
  show: function (builder) {
    return builder
      .builds('app.db')
      .builds('partyById')
        .using('app.db', 'req.params.partyId')
      .respond('templates.parties.show', 'partyById')
  },
  new: function (builder) {
    return builder
      .respond('templates.parties.newParty')
  }
}
