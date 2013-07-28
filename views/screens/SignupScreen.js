// Copyright 2013 Str8 Fire Industries

/**
 * @fileoverview screen for selfie signup
 */

goog.provide('str8.screens.SignupScreen')

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
str8.screens.SignupScreen = function (services, params, data) {
  goog.base(this, services)

  /**
   * @private {obv.shell.Services}
   */
  this._services = services
}
goog.inherits(str8.screens.SignupScreen, obv.shell.PrerenderedScreen)

/** @override */
str8.screens.SignupScreen.prototype.cachePolicy = obv.shell.CachePolicy.INFINITELY_CACHE

/** @override */
str8.screens.SignupScreen.prototype.createDom = function () {
  this.el.innerHTML = obv.shell.ij.render(templates.users.signup, {})
  this.decorate()
}

/** @override */
str8.screens.SignupScreen.prototype.decorate = function () {
  obv.shell.action.scope(this.el)
      .on('open-camera', this._openCamera, this)
}

/**
 * Clicks the hidden input=file to queue camera/image
 */
str8.screens.SignupScreen.prototype._openCamera = function () {
  document.activeElement.blur()
  var cameraInput = this.el.getElementsByClassName('camera-input')[0]
  cameraInput.click()
  var curr = this
  cameraInput.onchange = function (event) {
    console.log('it changed')
    var files = event.target.files
    var file = files[0]
    if (file) {
      var submitButton = document.getElementById('new-user-submit')
      submitButton.click()
    }
  }
}
