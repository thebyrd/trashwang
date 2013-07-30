// Copyright 2013 Str8 Fire Industries

/**
 * @fileoverview UI Component for managing coffin
 */
goog.provide('str8.ui.SiteNav')

goog.require('obv.shell.dom')

/**
 * @constructor 
 */
str8.ui.SiteNav = function () {

  /**
   * @private {Function}
   */
  this._touchEnd

  /**
   * start of X scroll pos
   * @private {number}
   */
  this._xStart

  /**
   * start of Y scroll pos
   * @private {number}
   */
  this._yStart

  /**
   * direction of scroll
   * @private {string}
   */
  this._direction

  /**
   * movement offset
   * @private {number}
   */
  this._xMovement = 0

  /**
   * end scroll position
   * @private {number}
   */
  this._xEnd = 0

  /**
   * percent ofscroll offset to trigger close/open action
   * @private {number}
   */
  this._fraction = 3/10

  /**
   * window size cache
   * @private {number}
   */
  this._windowSize = window.innerWidth

  /**
   * is coffin open
   * @private {boolean}
   */
  this._isOpen = false

  /**
   * page element
   * @private {Node}
   */
  this._page = document.getElementsByClassName('page')[0]

  /**
   * coffin element
   * @private {Node}
   */
  this._coffin = document.getElementsByClassName('coffin')[0]

  /**
   * test element
   * @private {Element}
   */
  this._skeletor = document.createElement('skeletor')

  /**
   * is this a touch device
   * @private {boolean}
   */
  this._isTouch = 'ontouchstart' in this._skeletor

  /**
   * transition end event names
   * @private {Object}
   */
  this._transitionEndEventNames = {
   'WebkitTransition': ['webkitTransitionEnd', 'webkitTransform', '-webkit-transform'],
   'MozTransition': ['transitionend', 'transform', 'transform'],
   'transition': ['transitionend', 'transform', 'transform']
  }

  /**
   * the transitionend event name
   * @private {string}
   */
  this._transitionEndEventName

  /**
   * the transition property
   * @private {string}
   */
  this._transitionProperty

  /**
   * transform property in js
   * @private {string}
   */
  this._transformProperty

  /**
   * transform property in css
   * @private {string}
   */
  this._transformCSSProperty

  /**
   * listener for transition end.
   * @private {obv.shell.dom.Listener}
   */
  this._transitionEndListener

  // define the property and event name
  for (var name in this._transitionEndEventNames) {
    if (this._skeletor.style[name] !== undefined) {
      this._transitionProperty = name
      this._transitionEndEventName = this._transitionEndEventNames[name][0]
      this._transformProperty = this._transitionEndEventNames[name][1]
      this._transformCSSProperty = this._transitionEndEventNames[name][2]
      break
    }
  }

  this._addListeners()
}

/**
 * Adds listenters to the site nav
 */
str8.ui.SiteNav.prototype._addListeners = function () {
  var self = this

  function isDescendant(parent, child) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
  }

  var slider = document.getElementsByClassName('slider')[0]  
  //window.addEventListener
  obv.shell.dom.listen(window, 'touchstart', function (e) {
    if (isDescendant(slider, e.target)) return
    // reset direction property
    self._direction = ''

    // reset xMovement to left/right position
    self._xMovement = self._isOpen ? 270 : 0

    // set touch start position for x axis
    self._xStart = e.touches[0].screenX

    // set touch start position for y axis
    self._yStart = e.touches[0].screenY
  })

  obv.shell.dom.listen(window, 'touchmove', function (e) {
    if (isDescendant(slider, e.target)) return
    // don't allow scrolling the page up and down when nav open
    if (self._direction == 'vertical' && self._isOpen) e.preventDefault();

    // if self._direction is vertical then exit
    if (self._direction == 'vertical') return;

    // calculate offsets to see if scroll direciton is vertical or horizontal
    var xOffset = Math.abs(e.touches[0].screenX - self._xStart);
    var yOffset = Math.abs(e.touches[0].screenY - self._yStart);

    // set self._direction based on offsets
    if (yOffset > xOffset) return self._direction = 'vertical';

    // the first time a horizontal move, set the pulling class
    if (self._direction != 'horizontal') self._coffin.classList.add('coffin-pulling');

    // if not vertical, than horizontal :P
    self._direction = 'horizontal';

    // prevent scrolls if horizontal
    e.preventDefault();

    // calcuate movement based on last scroll pos
    self._xMovement = e.touches[0].screenX - self._xStart + self._xEnd;

    // if xmovement is within valid range, scroll page
    if (self._xMovement <= 270 && self._xMovement >= 0) {
        self._translate3d(self._xMovement);
    }

  })

  obv.shell.dom.listen(window, 'touchend', (self._touchEnd = function (e) {
    if (isDescendant(slider, e.target)) return
    if (self._direction != 'horizontal') return

    
    var transitionEnd = function () {
      if (!self._isOpen) self._clearTransform()
      self._page.style[self._transitionProperty] = ''
      obv.shell.dom.unlisten(self._transitionEndListener)
      self._coffin.classList.remove('coffin-pulling')
      self._coffin.classList[self._isOpen ? 'add' : 'remove']('coffin-open')
    }

    self._xEnd = self._xMovement <= (self._isOpen ? (270 - (self._fraction * 270)) : self._fraction * 270) ? 0 : 270

    self._isOpen = self._xEnd === 270

    self._page.style[self._transitionProperty] = self._transformCSSProperty + ' .1s linear'

    self._translate3d(self._xEnd)

    this._transitionEndListener = obv.shell.dom.listen(self._page, self._transitionEndEventName, transitionEnd)

    if (self._xMovement == 270) transitionEnd()

  }))

  obv.shell.action.on('toggle-coffin', this._toggleCoffin, this)
}

str8.ui.SiteNav.prototype._translate3d  = function (i) {
  this._page.style[this._transformProperty] = 'translate3d(' + i + 'px,0,0)'
}

/**
 * clears the pages transform property style
 */
str8.ui.SiteNav.prototype._clearTransform = function () {
  this._page.style[this._transformProperty] = ''
}

/**
 * closes the drawer
 */
str8.ui.SiteNav.prototype._closeCoffin = function () {
  this._xMovement = -Infinity
  this._touchEnd()
}

/**
 * opens the drawer
 */
str8.ui.SiteNav.prototype._openCoffin = function () {
  this._xMovement = Infinity
  this._touchEnd()
}

/** 
 * toggles the drawer
 * @param {Event} e
 */
str8.ui.SiteNav.prototype._toggleCoffin = function (e) {
  this._direction = 'horizontal'
  this._isOpen ? this._closeCoffin() : this._openCoffin()
}
