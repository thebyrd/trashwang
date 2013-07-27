// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview This file provides newer JS functionality to older browsers.  In general extending
 * native prototypes should be avoided, but in the case of these functions the spec is well defined
 * and stable.
 */

goog.provide('obv.shell.poly')

goog.require('goog.array')
goog.require('goog.object')


// Function.bind was introduced in JS 1.8.5 and is implemented in the latest versions of all browsers
// this polyfill is primarily targeted at FF3 and IE8. Also, phantomjs doesn't have bind for some reason.
if (!Function.prototype.bind) {
  Function.prototype.bind = function Function$bind(var_args) {
    var newArgs = Array.prototype.slice.call(arguments)
    newArgs.unshift(this)
    return goog.bind.apply(null, newArgs)
  }
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function Array$indexOf(var_args) {
    var newArgs = Array.prototype.slice.call(arguments)
    newArgs.unshift(this)
    return goog.array.indexOf.apply(null, newArgs)
  }
}

if (!Array.prototype.map) {
  Array.prototype.map = function Array$map(var_args) {
    var newArgs = Array.prototype.slice.call(arguments)
    newArgs.unshift(this)
    return goog.array.map.apply(null, newArgs)
  }
}

if (!Date.now) {
  Date.now = function () {
    return new Date().valueOf()
  }
}

if (!Array.isArray) {
  Array.isArray = goog.isArray
}

if (!Object.keys) {
  Object.keys = goog.object.getKeys
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function () {
  var lastTime = 0
  var vendors = ['ms', 'moz', 'webkit', 'o']
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
      || window[vendors[x] + 'CancelRequestAnimationFrame']
  }

  if (!window.requestAnimationFrame) {
    /**
     * @param {function (number)} callback
     * @param {Element=} element
     * @return {number}
     */
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16 - (currTime - lastTime))
      var id = window.setTimeout(function () { callback(NaN) }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }
  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) { clearTimeout(id) }
}())

window['URL'] = window['URL'] || window['webkitURL'] || window
