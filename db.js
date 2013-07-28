var redis = require('redis')

function DB(options) {
  this.client = redis.createClient(options.port, options.host)
}

module.exports = DB
