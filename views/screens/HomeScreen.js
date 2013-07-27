// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview screen for the homepage.
 */
 
 goog.provide('sml.screens.HomeScreen')

 goog.require('obv.shell.PrerenderedScreen')
 goog.require('obv.shell.ij')
 goog.require('obv.shell.CachePolicy')
 goog.require('templates.posts')


/**
 * @param {!obv.shell.Services} services
 * @param {Object.<string>} params
 * @param {!Object} data Navigation data.
 * @extends {obv.shell.PrerenderedScreen}
 * @constructor
 */
sml.screens.HomeScreen = function (services, params, data) {
  goog.base(this, services)

  /**
   * @private {obv.shell.Services}
   */
  this._services = services

  /**
   * @private {obv.shell.RequestService}
   */
  this._request = this._services.get('request')

  /**
   * @private {sml.services.PostService}
   */
  this._postService = this._services.get('posts')

  /**
   * The posts database id, as seen in the URL.
   * @private {string}
   */
  this._id = params['postId']
}
goog.inherits(sml.screens.HomeScreen, obv.shell.PrerenderedScreen)

/** @override */
sml.screens.HomeScreen.prototype.createDom = function () {
  this._request.get('/', {asJson: true}).addCallback(this._render)
}


/** @override */
sml.screens.HomeScreen.prototype.cachePolicy = obv.shell.CachePolicy.NEVER_CACHE

/**
 * Renders Home Screen
 * @param {Object} data
 * @private
 */
sml.screens.HomeScreen.prototype._render = function (data) {
  var id = this._postService.uuid()
  this.el.innerHTML = obv.shell.ij.render(templates.posts.index, {posts: data, id: id})
}
