module.exports = {
  index: function (builder) {
    return builder
      .builds('app.db')
      .builds('parties')
        .using('app.db', 'req.params')
      .respond('templates.parties.index', 'parties')
  },
  create: function (builder) {
    return builder
      .builds('app.db')
      .builds('createParty')
        .using('app.db', 'req.params.body')
      .respond('templates.parties.create', 'createParty')
  },
  view: function (builder) {
    return builder
      .builds('app.db')
      .builds('partyById')
        .using('app.db', 'req.params.partyId')
      .respond('templates.parties.view', 'partyById')
  },
  update: function (builder) {
    return builder
      .builds('app.db')
      .builds('updatePartyById')
        .using('app.db', 'req.params.partyId')
      .respond('templates.parties.view', 'partyId')
  }
}
