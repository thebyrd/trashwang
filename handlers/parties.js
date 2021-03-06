module.exports = {
  /**
   * Selfie Signup Page
   */
  index: function (builder) {
    return builder
      .builds('app.db')
      .builds('getAllParties')
        .using('app.db')
      .respond('templates.parties.index', 'getAllParties')
  },
  create: function (builder) {
    return builder
      .builds('app.db')
      .builds('createParty')
        .using('app.db', 'req.body', 'req.session')
      .respond('templates.parties.show', 'createParty')
  },
  show: function (builder) {
    return builder
      .builds('app.db')
      .builds('getPartyById')
        .using('app.db', 'req.params.partyId')
      .respond('templates.parties.show', 'getPartyById')
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
  },
  uploadImage: function (builder) {
    return builder
      .builds('uploadPartyImages')
        .using('app.cdn', 'req')
      .respond('templates.users.signup', 'uploadPartyImages')
  }
}
