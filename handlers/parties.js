module.exports = {
  index: function (builder) {
    return builder
      .builds('app.db')
      .builds('parties')
        .using('app.db', 'req.params')
      .respond('templates.parties.index', 'parties')
  }
}
