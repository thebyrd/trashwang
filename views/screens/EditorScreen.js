// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview screen for editing/creating new posts
 */
 
goog.provide('sml.screens.EditorScreen')

goog.require('obv.shell.PrerenderedScreen')
goog.require('obv.shell.ij')
goog.require('obv.shell.action')
goog.require('obv.shell.action.Scope')
goog.require('sml.services.PostService')
goog.require('templates.posts')

/**
 * @param {!obv.shell.Services} services
 * @param {Object.<string>} params
 * @param {!Object} data Navigation data.
 * @extends {obv.shell.PrerenderedScreen}
 * @constructor
 */
sml.screens.EditorScreen = function (services, params, data) {
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
}
goog.inherits(sml.screens.EditorScreen, obv.shell.PrerenderedScreen)

/** @override */
sml.screens.EditorScreen.prototype.cachePolicy = obv.shell.CachePolicy.NEVER_CACHE

/** @override */
sml.screens.EditorScreen.prototype.createDom = function () {
  var data = this._services.get('posts').getPost(this._id)
  this.el.innerHTML = obv.shell.ij.render(templates.posts.edit, data)
  this.decorate()
}

/** @override */
sml.screens.EditorScreen.prototype.decorate = function () {
  obv.shell.action.scope(this.el).on('save-post', this._savePost, this)
}

/**
 * Gets data from editor form and creates or updates post
 * @param {Event} e
 * @private
 */
sml.screens.EditorScreen.prototype._savePost = function (e) {
  var post = {}
  var inputs = document.getElementsByClassName('field')
  for (var i = 0, input; input = inputs[i]; i++)
    post[input.name] = input.value

  var savedPost = this._services.get('posts').savePost(post)
  this._services.get('app').navigate('p/' + savedPost.id)
}
