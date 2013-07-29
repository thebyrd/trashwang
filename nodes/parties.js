var uuid = require('node-uuid')
var Q = require('kew')

module.exports = {
  /**
   * 
   */
  getAllParties: function (db, params) {
    return []
  },

  getPartyById: function (db, partyId) {
  },
  createParty: function (db, body, session) {
    if (!session.user) return {
      success: false,
      message: 'user is not authenticated'
    }

    if (body && body.images && body.items && body.name && body.address) {
      
      var items = body.items.map(function (item) {
        return {
          schema: 'item',
          id: uuid.v1(),
          name: item
        }
      })

      var party = {
        id: uuid.v1(),
        schema: 'party',
        name: body.name,
        address: body.address,
        host: session.user.id,
        items: items.map(function (i) {return i.id})
      }

      items = items.forEach(function (i) {
        i.partyId = party.id
        db.putItem('trashwang', i)
        .execute()
        .then(function (data) {
          if (data) {
            console.log('added item')
          } else {
            console.log('dynamo failed to add item')
          }
        })
        .fail(function (err) {
          throw err
        })
      })

      return db.putItem('trashwang', party)
      .execute()
      .then(function (data) {
        if (data) {
          party.items = items // populates items
          return party
        } else {
          console.log('dynamo says fuck you: ', data)
          return {
            success: false,
            message: 'dynamodb error'
          }
        }
      })
      .fail(function (err) {
        throw err
      })
    } else {
      return {
        success: false,
        message: 'missing parameters'
      }
    }
  }
}
