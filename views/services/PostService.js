// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview a service for storing posts.
 * Keep in mind that Services are not models. They are utilities to use inside of screens.
 */
 
goog.provide('sml.services.PostService')

goog.require('goog.array')
goog.require('obv.shell.SafePubSub')

/**
 * @extends {obv.shell.SafePubSub}
 * @constructor
 */
sml.services.PostService = function () {
  goog.base(this)

  /**
   * @private {obv.shell.RequestService}
   */
  this._request = new obv.shell.RequestService()
}
goog.inherits(sml.services.PostService, obv.shell.SafePubSub)


/**
 * Topics that the post service dispatches and that can be subscribed to.
 * @enum {string}
 */
sml.services.PostService.Topics = {
  CREATE: 'create',
  UPDATE: 'update',
  REMOVE: 'remove'
}

/**
 * Returns a random id.
 * @returns {string} id
 */
sml.services.PostService.prototype.uuid = function () {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
}
