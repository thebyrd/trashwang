// Copyright 2013 Str8 Fire Industries

/**
 * @fileoverview screen for login, for people who already have accounts
 */

goog.provide('str8.screens.LoginScreen')

goog.require('obv.shell.PrerenderedScreen')
goog.require('obv.shell.ij')
goog.require('obv.shell.action')
goog.require('obv.shell.action.Scope')
goog.require('obv.shell.CachePolicy')
goog.require('templates.users')

/**
 * @param {!obv.shell.Services} services
 * @param {Object.<string>} params
 * @param {!Object} data Navigation data.
 * @extends {obv.shell.PrerenderedScreen}
 * @constructor
 */
str8.screens.LoginScreen = function (services, params, data) {
  goog.base(this, services)

  /**
   * @private {obv.shell.Services}
   */
  this._services = services
}
goog.inherits(str8.screens.LoginScreen, obv.shell.PrerenderedScreen)

/** @override */
str8.screens.LoginScreen.prototype.cachePolicy = obv.shell.CachePolicy.INFINITELY_CACHE

/** @override */
str8.screens.LoginScreen.prototype.createDom = function () {
  this.el.innerHTML = obv.shell.ij.render(templates.users.login, {})
  this.decorate()
}

