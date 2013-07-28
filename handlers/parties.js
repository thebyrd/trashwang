module.exports = {
  /**
   * Selfie Signup Page
   */
  index: function (builder) {
    return builder
      .builds('app.db')
      .builds('parties')
        .using('app.db')
      .respond('templates.parties.index', 'parties')
  },
  create: function (builder) {
    return builder
      .builds('app.db')
      .builds('createParty')
        .using('app.db', 'req.body', 'res.session.user')
      .builds('partyById')
        .using('app.db', 'createParty')
      .respond('templates.parties.show', 'partyById')
  },
  show: function (builder) {
    return builder
      .builds('app.db')
      .builds('partyById')
        .using('app.db', 'req.params.partyId')
      .respond('templates.parties.show', 'partyById')
  },
  update: function (builder) {
    return builder
      .builds('app.db')
      .builds('updatePartyById')
        .using('app.db', 'req.params.partyId')
      .builds('partyById')
        .using('app.db', 'req.params.partyId')
      .respond('templates.parties.show', 'partyById')
  },
  new: function (builder) {
    return builder
      .respond('templates.parties.newParty')
  }
}
