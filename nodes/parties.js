var fs = require('fs')
var Q = require('kew')
var crypto = require('crypto')

/**
 * Generate a 48 bit hex string
 */
function generateId() {
  var b = crypto.randomBytes(6);

  var high = b.readUInt16LE(0)
  var low = b.readUInt32LE(2)

  return ((high * Math.pow(2, 32)) + low).toString(16)
}


module.exports = {

  getAllParties: function (db) {
    return db.newQueryBuilder('trashwang')
    .setHashKey('schema', 'party')
    .execute()
    .then(function (data) {
      return {parties: data.result || []}
    })
  },

  getPartyById: function (db, partyId) {
    return db.getItem('trashwang')
    .setHashKey('schema', 'party')
    .setRangeKey('id', partyId)
    .execute()
    .then(function (data) {
      var party = data.result
      return Q.all(party.items.map(function (itemId) {
        return db.getItem('trashwang')
        .setHashKey('schema', 'item')
        .setRangeKey('id', itemId)
        .execute()
        .then(function (data) {
          return data.result
        })
      }))
      .then(function (items) {
        party.items = items
        return {party: party}
      })

    })
  },

  uploadPartyImages: function (cdn, req) {
    if (req.files) {
      var imageNames = []
      for (var name in req.files) {
        var image = req.files[name]
        var stream = fs.createReadStream(image.path)
        var path = generateId() + '-' + image.name
        imageNames.push(path)
        cdn.putStream(stream, path, {'Content-Length': image.size, 'x-amz-acl': 'public-read'}, function (err, res) {if (err) throw err})
      }
      return imageNames
    }
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
          id: generateId(),
          name: item
        }
      })

      var party = {
        id: generateId(),
        schema: 'party',
        name: body.name,
        address: body.address,
        host: session.user.id,
        images: body.images,
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
