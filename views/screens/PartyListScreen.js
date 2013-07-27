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
}
goog.inherits(str8.screens.PartyListScreen, obv.shell.PrerenderedScreen)

/** @override */
str8.screens.PartyListScreen.prototype.cachePolicy = new obv.shell.CachePolicy.CacheableForHistory(3600)

/** @override */
str8.screens.PartyListScreen.prototype.createDom = function () {

}

/** @override */
str8.screens.PartyListScreen.prototype.decorate = function () {
  
}
