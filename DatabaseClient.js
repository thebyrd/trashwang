// Copyright 2013 Bowery Software LLC.

/**
 * @fileoverview a wrapper for dynamite that implements the bowery db api
 */
//TODO (david) inject app name as an env variable
var applicationName = 'trashwang'
var Dynamite = require('dynamite')

/**
 * Constructor for database client.
 * @param {Object} schemas
 * @constructor
 */
function DatabaseClient (schemas) {
  /**
   * @private {Client}
   */
  this._driver = new Dynamite.Client({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET
  })
  
  /**
   * @private {Object}
   */
  this._schemas = schemas

  /**
   * Define jquery style query methods.
   */
  for (var name in schemas)
    this[name] = this._request.bind(this, name)
}


/**
 * Base function for all requests to db
 * @param {string} name The name of the schema.
 * @param {string} id
 * @param {Object} obj
 */
DatabaseClient.prototype._request = function (name, id, obj) {
  if (obj) {
    obj.schema = name
    obj.id = id // TODO (david) make sure obj matches schema
    return this._driver.putItem(applicationName, obj).execute()
  } else if (id) {
    return this._driver.getItem(applicationName)
    .setHashKey('schema', name)
    .setRangeKey('id', id)
    .execute()
    .then(function (data) { //TODO (david) replace this function with something that casts it to the schema
      return data.result
    })
  } else {
    return this._driver.newQueryBuilder(applicationName)
    .setHashKey('schema', name)
    .execute()
    .then(function (data) {
      return data.result
    })
  }
}

module.exports = DatabaseClient