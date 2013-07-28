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


/* ----------------------------------
 * SLIDER v1.0.0
 * Licensed under The MIT License
 * Adapted from Brad Birdsall's swipe
 * http://opensource.org/licenses/MIT
 * ---------------------------------- */

var pageX;
var pageY;
var slider;
var deltaX;
var deltaY;
var offsetX;
var lastSlide;
var startTime;
var resistance;
var sliderWidth;
var slideNumber;
var isScrolling;
var scrollableArea;

var getSlider = function (target) {
  var i, sliders = document.querySelectorAll('.slider ul');
  for (; target && target !== document; target = target.parentNode) {
    for (i = sliders.length; i--;) { if (sliders[i] === target) return target; }
  }
}

var getScroll = function () {
  var translate3d = slider.style.webkitTransform.match(/translate3d\(([^,]*)/);
  return parseInt(translate3d ? translate3d[1] : 0)
};

var setSlideNumber = function (offset) {
  var round = offset ? (deltaX < 0 ? 'ceil' : 'floor') : 'round';
  slideNumber = Math[round](getScroll() / ( scrollableArea / slider.children.length) );
  slideNumber += offset;
  slideNumber = Math.min(slideNumber, 0);
  slideNumber = Math.max(-(slider.children.length - 1), slideNumber);
}

var onTouchStart = function (e) {
  slider = getSlider(e.target);

  if (!slider) return;

  var firstItem  = slider.querySelector('li');

  scrollableArea = firstItem.offsetWidth * slider.children.length;
  isScrolling    = undefined;
  sliderWidth    = slider.offsetWidth;
  resistance     = 1;
  lastSlide      = -(slider.children.length - 1);
  startTime      = +new Date;
  pageX          = e.touches[0].pageX;
  pageY          = e.touches[0].pageY;

  setSlideNumber(0);

  slider.style['-webkit-transition-duration'] = 0;
};

var onTouchMove = function (e) {
  if (e.touches.length > 1 || !slider) return; // Exit if a pinch || no slider

  deltaX = e.touches[0].pageX - pageX;
  deltaY = e.touches[0].pageY - pageY;
  pageX  = e.touches[0].pageX;
  pageY  = e.touches[0].pageY;

  if (typeof isScrolling == 'undefined') {
    isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
  }

  if (isScrolling) return;

  offsetX = (deltaX / resistance) + getScroll();

  e.preventDefault();

  resistance = slideNumber == 0         && deltaX > 0 ? (pageX / sliderWidth) + 1.25 :
               slideNumber == lastSlide && deltaX < 0 ? (Math.abs(pageX) / sliderWidth) + 1.25 : 1;

  slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
};

var onTouchEnd = function (e) {
  if (!slider || isScrolling) return;

  setSlideNumber(
    (+new Date) - startTime < 1000 && Math.abs(deltaX) > 15 ? (deltaX < 0 ? -1 : 1) : 0
  );

  offsetX = slideNumber * sliderWidth;

  slider.style['-webkit-transition-duration'] = '.2s';
  slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';

  e = new CustomEvent('slide', {
    detail: { slideNumber: Math.abs(slideNumber) },
    bubbles: true,
    cancelable: true
  });

  slider.parentNode.dispatchEvent(e);
};

window.addEventListener('touchstart', onTouchStart);
window.addEventListener('touchmove', onTouchMove);
window.addEventListener('touchend', onTouchEnd);




