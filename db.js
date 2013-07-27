var redis = require('redis')

function DB(options) {
  this.client = redis.createClient(options.host, options.port)
}

module.exports = DB
