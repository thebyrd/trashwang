var assert = require('assert')
var fs = require('fs')
var schemas = {}
var files = fs.readdirSync('./schemas')
for (var i = 0, name; name = files[i]; i++)
  schemas[name.slice(0, -3)] = require('./schemas/'+name)

var DatabaseClient = require('./DatabaseClient')
var db = new DatabaseClient(schemas)

db.party("76215355008a")
.then(function (party) {
  assert.equals('800 market street', party.address, 'Party Address not set correctly')
  assert.equals('david.byrd11@gmail.com', party.host, 'Party Host not set correclty')
})
.fail(function (err) {
  throw err
})

db.user("david@someshit.io")
.then(function (user) {
  console.log('User ->', user)
  assert.equals('d', user.password, 'User password is not correct')
  assert.equals('david@someshit.io-Unknown.jpeg', user.img, 'User imgage is not correct')
})
.fail(function (err) {
  throw err
})

db.item("8c48ed4f32c0")
.then(function (item) {
  console.log('Item ->', item)
  assert.equals('Diet coke', item.name, 'Item name is not correct')
})
.fail(function (err) {
  throw err
})
