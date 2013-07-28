var parties = [
      {
        id: 0,
        title: 'foo',
        description: 'this is a RAD party',
        pictures: ['one.png', 'two.png'],
        required: [
          {title: 'six-pack', fullfilled: 3, needed: 4, contributorUserIds: [123, 456, 789]},
          {title: 'speaker', fullfilled: 2, needed: 2, contributorUserIds: [456, 789]},
          {title: 'bagels', fullfilled: 0, needed: 12, contributorUserIds: []}
        ]
      }
    ]

module.exports = {
  parties: function (db, params) {
    return {parties: parties}
  },

  partyById: function (db, partyId) {
    if (!partyId) return null

    console.log('$view', partyId)

    for (var i = 0, party; party = parties[i]; i++) {
      if (party.id == partyId) return party
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
