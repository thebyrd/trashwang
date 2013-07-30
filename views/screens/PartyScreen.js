// Copyright 2013 Str8 Fire Industries

/**
 * @fileoverview screen for a party overview page
 */
goog.provide('str8.screens.PartyScreen')

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
str8.screens.PartyScreen = function (services, params, data) {
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
   * @private {string}
   */
  this._id = params['partyId']
}
goog.inherits(str8.screens.PartyScreen, obv.shell.PrerenderedScreen)

str8.screens.PartyScreen.prototype.cachePolicy = new obv.shell.CachePolicy.Expirable(1000 * 60) // 1 minute obv.shell.CachePolicy.INFINITELY_CACHE

/** @override */
str8.screens.PartyScreen.prototype.createDom = function () {
  this._request.get('/parties/' + this._id + '?apiv=1', {json: true})
    .addCallback(function (response) {
      this.el.innerHTML = obv.shell.ij.render(templates.parties.show, {party: response.party})
    }, this)
    .addErrback(function (err) {
      throw err
    })
}
