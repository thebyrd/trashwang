function getPartyById(db, partyId) {
  return db.get('/party/' + partyId)
}

module.exports = {
  parties: function (db) {
    return db.smembers('/parties')
      .then(function (partyIds) {
        console.log('partyIds', partyIds)
        if (!partyIds) {
          return []
        } else {
          var content = getPartyById(partyIds[0])
          for (var i = 1; i < partyIds.length; i++) {
            content.then(getPartyById(partyIds[i]))
          }

          return content
        }
      })
      .then(function (content) {
        return {parties: content}
      })
  },

  partyById: function (db, partyId) {
    if (!createParty) return null

    return createParty.then(function (party) {
      return db.hgetall('/parties/' + partyId)
    })
  },

  // expects, title,  description
  createParty: function (db, body, user) {
    console.log('create', body, user)
    if (!body) return null

    return db.exists('/parties/index/byTitle' + body.title)
      .then(function (partyExists) {
        if (partyExists == 1) {
          throw new Error('party exists')
        } else {
          return db.incr('/party')
        }
      })
      .then(function (newId) {
        var party = {
          id: newId,
          title: body.title,
          description: body.description,
          userId: 0, //user.id,
          open: true
        }

        db.set('/parties/index/byTitle/' + party.title, party.id, function () {})
        db.sadd('/parties/index/byUserId/' + 0, party.id, function () {})
        db.sadd('/parties/index/byAvailability', party.id, function () {})

        console.log('new party', party)
        db.hmset('/parties/' + newId, party)
        return party
      })
  },

  updatePartyById: function (db, body) {
    if (!body) return null

    console.log('$update',body)
    return true
  }
}
