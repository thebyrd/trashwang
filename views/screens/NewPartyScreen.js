// Copyright 2013 Str8 Fire Industries

/**
 * @fileoverview screen for a list of parties
 */
goog.provide('str8.screens.NewPartyScreen')

goog.require('obv.shell.PrerenderedScreen')
goog.require('obv.shell.ij')
goog.require('obv.shell.action')
goog.require('obv.shell.action.Scope')
goog.require('obv.shell.CachePolicy')
goog.require('goog.dom.classes')
goog.require('templates.parties')

/**
 * @param {!obv.shell.Services} services
 * @param {Object.<string>} params
 * @param {!Object} data Navigation data.
 * @extends {obv.shell.PrerenderedScreen}
 * @constructor
 */
str8.screens.NewPartyScreen = function (services, params, data) {
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
   * @private {Array.<string>}
   */
  this._images = []

  /**
   * @private {Element}
   */
  this._itemsList = document.getElementsByClassName('list')[0]

  /**
   * @private {Array.<string>}
   */
  this._items = []

  /**
   * @private {Array.<string>}
   */
  this._placeholders = ['what do you need to rage?', 'anything else?', 'you can think of more!']
}
goog.inherits(str8.screens.NewPartyScreen, obv.shell.PrerenderedScreen)

/** @override */
str8.screens.NewPartyScreen.prototype.cachePolicy = obv.shell.CachePolicy.NEVER_CACHE

/** @override */
str8.screens.NewPartyScreen.prototype.createDom = function () {
  this.el.innerHTML = obv.shell.ij.render(templates.parties.newParty, {})
  this.decorate()
}

/** @override */
str8.screens.NewPartyScreen.prototype.decorate = function (){
   obv.shell.action.scope(this.el)
                  .on('add-image', this._addImage, this)
                  .on('add-item', this._addItem, this)
                  .on('remove-item', this._removeItem, this)
                  .on('create-party', this._createParty, this)
}

str8.screens.NewPartyScreen.prototype._addItem = function (e) {
  var input = this.el.getElementsByClassName('new-item-input')[0]
  var item = input.value
  if (item) {
    this._items.push(item)
    input.value = ''
    input.placeholder = this._placeholders[Math.floor(Math.random()*this._placeholders.length)]
    var li = document.createElement('li')
    li.innerHTML = item + '<a class="button-negative" data-action="remove-item">remove</a>'
    this._itemsList.appendChild(li)
  }
}

str8.screens.NewPartyScreen.prototype._removeItem = function (e) {
  goog.dom.removeNode(e.target.parentNode)
}

str8.screens.NewPartyScreen.prototype._addImage = function () {
  var fileInput = this.el.getElementsByClassName('camera-input')[0]
  fileInput.click()
  var self = this
  fileInput.onchange = function (event) {
    var file = event.target.files[0]
    self._images.push(file)
    if (file) {
      var sliderEl = document.getElementsByClassName('eventual-slider')[0]
      var src = URL.createObjectURL(file)
      sliderEl.className = 'slider'

      var child  = document.createElement('li')
      child.innerHTML = '<img src="' + src + '">'

      var ul = sliderEl.firstChild
      ul.firstChild ? ul.insertBefore(child, ul.firstChild) : ul.appendChild(child)
    }
  }
}

str8.screens.NewPartyScreen.prototype._createParty = function (e) {
  var self = this

  var fd = new FormData()
  for (var i = 0, image; image = this._images[i]; i++)
      fd.append(i + '-' + image.name, image)

  var xhr = new XMLHttpRequest()
  xhr.open('POST', '/_/upload?apiv=1', true)
  xhr.onload = function (data) {
    var response = JSON.parse(/** @type {string} */(xhr.response))
    if (response.success) {
      var payload = {
        items: self._items,
        name: document.querySelector('[name="name"]').value,
        address: document.querySelector('[name="address"]').value,
        images: response.payload
      }
      self._request.post('/parties?apiv=1', payload, {json: true})
      .addCallback(function (response) {
        self._services.get('app').navigate('parties/' + response.id)
      })
      .addErrback(function (err) {
        throw err
      })
    } else {
      throw new Error(response.message)
    }
  }
  xhr.send(fd) // upload an image
}
