var Q = require('kew')

module.exports = {
  partyById: function (db, partyId) {
    var defer = Q.defer()
    db.get('parties:' + partyId, defer.makeNodeResolver())
    return defer.promise
  },

  createParty: function (db, body) {
    if (body && body.name && body.email && body.password) {
      var defer = Q.defer()
      body.id = require('node-uuid').v1()
      db.set('parties:' + body.id, JSON.stringify(body))
      return body
    } else {
      res.redirect('/new-party')
    }
  },
  
  getAllParties: function (db) {
    return {parties: []} //TODO (artem) put search here
  }
}
