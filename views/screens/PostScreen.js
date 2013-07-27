// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview screen for displaying posts.
 */
 
goog.provide('sml.screens.PostScreen')

goog.require('obv.shell.PrerenderedScreen')
goog.require('obv.shell.ij')
goog.require('templates.posts')

/**
 * @param {!obv.shell.Services} services
 * @param {Object.<string>} params
 * @param {!Object} data Navigation data.
 * @extends {obv.shell.PrerenderedScreen}
 * @constructor
 */
sml.screens.PostScreen = function (services, params, data) {
  goog.base(this, services)

  /**
   * @private {obv.shell.Services}
   */
  this._services = services

  /**
   * The posts database id, as seen in the URL.
   * @private {string}
   */
  this._id = params['postId']

  /**
   * @private {obv.shell.App}
   */
  this._app = services.get('app')

  /**
   * Dialog Service
   */
  this._dialog = services.get('dialog')

  /**
   * Array of listeners to track (and unlisten, on deactivate).
   * @type {Array.<obv.shell.dom.Listener>}
   * @private
   */
  this._listeners = []
}
goog.inherits(sml.screens.PostScreen, obv.shell.PrerenderedScreen)

/** @override */
sml.screens.PostScreen.prototype.createDom = function () {
  var data = this._services.get('posts').getPost(this._id)
  this.el.innerHTML = obv.shell.ij.render(templates.posts.show, data)
}