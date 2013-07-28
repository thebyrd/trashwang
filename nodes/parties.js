var Q = require('kew')

// var parties = [
//       {
//         id: 0,
//         title: 'foo',
//         description: 'this is a RAD party',
//         pictures: ['one.png', 'two.png'],
//         required: [
//           {title: 'six-pack', fullfilled: 3, needed: 4, contributorUserIds: [123, 456, 789]},
//           {title: 'speaker', fullfilled: 2, needed: 2, contributorUserIds: [456, 789]},
//           {title: 'bagels', fullfilled: 0, needed: 12, contributorUserIds: []}
//         ]
//       }
//     ]

module.exports = {
  parties: function (db) {
    console.log('get parties')
    var defer = Q.defer()

    db.smembers('/parties', defer.makeNodeResolver())
    return defer.promise.then(function (err, partyIds) {
      if (err) console.log(err)
      if (err.length == 0) return {parties: []}
      var promises = []

      for (var i = 0; i < partyIds.length; i++) {
        promises.push(partyIds[i])
      }

      return Q.all(promises)
        .then(function (content) {
          return {parties: content}
        })
    })
  },

  partyById: function (db, partyId) {
    if (!partyId) return null

    console.log('$view', partyId)

    for (var i = 0, party; party = parties[i]; i++) {
      if (party.id == partyId) return {party: party}
    }

    return null

    // db.hgetall('/party/' + partyId, function (err, party) {
    //   if (err) return null
    //   else return party
    // })
  },

  createParty: function (db, body) {
    if (!body) return null

    // db.exists('/parties' + body.)

    return true
  },

  updatePartyById: function (db, body) {
    if (!body) return null

    console.log('$update',body)
    return true
  }
}
