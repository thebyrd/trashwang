module.exports = {
  /**
   * Selfie Signup Page
   */
  index: function (builder) {
    return builder
      .builds('app.db')
      .builds('getAllParties')
        .using('app.db', 'req.params')
      .respond('templates.parties.index')
  },
  create: function (builder) {
    return builder
      .builds('app.db')
      .builds('uploadPartyImages')
        .using('app.cdn', 'req.body.images', {'partyName': 'req.body.name'})
      .builds('createParty')
        .using('app.db', 'req.body', 'req.session', {'images': 'uploadPartyImages'})
      .respond('templates.parties.show', 'createParty')
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
