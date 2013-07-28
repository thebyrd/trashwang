// Copyright 2013 Str8 Fire Industries

/**
 * @fileoverview screen for a list of parties
 */
goog.provide('str8.screens.PartyListScreen')

goog.require('obv.shell.PrerenderedScreen')
goog.require('obv.shell.ij')
goog.require('obv.shell.action')
goog.require('obv.shell.action.Scope')
goog.require('obv.shell.CachePolicy')
goog.require('templates.parties')

/**
 * @param {!obv.shell.Services} services
 * @param {Object.<string>} params
 * @param {!Object} data Navigation data.
 * @extends {obv.shell.PrerenderedScreen}
 * @constructor
 */
str8.screens.PartyListScreen = function (services, params, data) {
  goog.base(this, services)

  /**
   * @private {obv.shell.Services}
   */
  this._services = services

  /**
   * @private obv.shell.RequestService
   */
  this._request = this._services.get('request')
}
goog.inherits(str8.screens.PartyListScreen, obv.shell.PrerenderedScreen)

str8.screens.PartyListScreen.prototype.cachePolicy = new obv.shell.CachePolicy.Expirable(1000 * 60) // 1 minute obv.shell.CachePolicy.INFINITELY_CACHE

/** @override */
str8.screens.PartyListScreen.prototype.createDom = function () {
  this._request.get('/parties?apiv=1', {json: true})
    .addCallback(function (response) {
      this.el.innerHTML = obv.shell.ij.render(templates.parties.index, {parties: response.parties})
    }, this)
    .addErrback(function (err) {
      throw err
    })
}
