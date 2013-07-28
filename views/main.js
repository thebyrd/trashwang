// Copyright 2012 The Obvious Corporation.

/**
 * The main entry point for the small web app.
 */

goog.provide('obv.main')

goog.require('goog.async.Deferred')

goog.require('str8.screens.SignupScreen')
goog.require('str8.screens.PartyListScreen')

goog.require('obv.shell.action')
goog.require('obv.shell')
goog.require('obv.shell.action')
goog.require('obv.shell.ActivityMonitor')
goog.require('obv.shell.App')
goog.require('obv.shell.RequestService')
goog.require('obv.shell.Services')
goog.require('obv.shell.ij')

//TODO (david) put this in the templates and make it relevant data

; (function () {
  var GLOBALS = {"baseUrl":"https://medium.com","buildLabel":"4888-cc64c93","contributeSoonUrl":"//medium.com/help-center/3b131d33f3fc","currentUser":{"userId":"5b68de9e9294","username":"davidbyrd11","isAuthenticated":true,"isBlocked":false,"name":"David Byrd","bio":"Intern @ Medium","imageId":"0*3jXz7S3DbStrHaEF.png","backgroundImageId":"0*jsfrItbfxFGCdqdj.jpeg","twitterScreenName":"davidbyrd11","twitterAvatar":"http://a0.twimg.com/profile_images/2916873136/9535a94b5a464758a25c777396fdda9e.png","createdAt":1345001608771,"updatedAt":1370399422030,"deactivatedAt":0,"lastPostCreatedAt":1374016228628,"lastViewedActivityAt":1374107799811,"upvotes":20,"unvotes":2,"loggedInReads":155,"loggedInRereads":94,"loggedInReadsUnique":55,"loggedOutReads":298,"loggedInViews":184,"loggedOutViews":427,"notesCreated":16,"followUpsCreated":0,"postsRead":733,"allowEmails":1,"allowNotes":1,"googleProfileId":"","flagInterstitialCollab":1,"id":"5b68de9e9294","type":"User","virtuals":{"bioHTML":"Intern @ Medium"}},"defaultPreviewImage":"//dnqgz544uhbo8.cloudfront.net/_/fp/img/default-preview-image.IsBK38jFAJBlWifMLO4z9g.png","deviceWidth":1200,"embedded":null,"facebookKey":"542599432471018","howToPostUrl":"//medium.com/about/5ab1de76e764","isAuthenticated":true,"language":"en-us","miroUrl":"https://d233eq3e3p3cv0.cloudfront.net","moduleUrls":{"base":"//dnqgz544uhbo8.cloudfront.net/_/fp/js/main-base.bundle.9lmZx-gLtM3QOdwiimVzwQ.js","notes":"//dnqgz544uhbo8.cloudfront.net/_/fp/js/main-notes.bundle.iQ_Q17J_fHaVQCu3f2CrSg.js","notes-mobile":"//dnqgz544uhbo8.cloudfront.net/_/fp/js/main-notes-mobile.bundle.cHZzoZc8qDUXgeCXT92elg.js","posters":"//dnqgz544uhbo8.cloudfront.net/_/fp/js/main-posters.bundle.exZYpZApwowguoHKkARRhw.js","creators":"//dnqgz544uhbo8.cloudfront.net/_/fp/js/main-creators.bundle.0DF5z2Ug9eFo3nHPLahXGA.js","settings":"//dnqgz544uhbo8.cloudfront.net/_/fp/js/main-settings.bundle.AEjg3z_AJxUc8Elt9AXdow.js","export":"//dnqgz544uhbo8.cloudfront.net/_/fp/js/main-export.bundle.McGX4lR9Tl6SAK2htuOCPg.js","stats":"//dnqgz544uhbo8.cloudfront.net/_/fp/js/main-stats.bundle.Q24usx3SndjRIwfcJBSR7g.js","tailor":"//dnqgz544uhbo8.cloudfront.net/_/fp/js/main-tailor.bundle.OMcMXiXJ_gRXClIK3gViwQ.js"},"postColumnWidth":700,"productName":"TrashWang","useragent":{"browser":"chrome","supportsEdit":true,"supportsInteract":true,"supportsView":true,"isMobile":false,"isTablet":false,"supportsFileAPI":true,"requiresBodyScroll":false},"variants":{"is_super_user":true,"can_invite_users":true,"allow_access":true,"allow_unauthenticated_access":true,"allow_non_whitelist_users":true,"allow_outgoing_email":true,"can_see_all_collections":true,"can_see_global_new_post_list":true,"policy_collection_slug":"policy","can_create_collection":true,"can_create_post":true,"can_edit_post":true,"can_delete_post":true,"can_infinite_scroll":true,"can_vote":true,"can_delete_account":true,"can_update_settings":true,"can_update_collection_settings":true,"can_export_data":true,"full_width_flex_template":true,"can_embed_media":true,"can_see_reading_time":true,"can_cross_post":true,"can_see_creator_dashboard":true,"can_see_all_creator_dashboards":true,"can_create_unlimited_collections":true,"can_see_recommended_posts":true,"enable_notes":true,"enable_mobile_notes":true,"can_write_activity":true,"can_view_activity":true,"enable_collaboration":true,"allow_test_auth":"disallow","can_generate_homepage":true,"can_schedule_posts":true,"enable_read_next":true,"enable_new_quotes":true,"enable_image_captions":true,"enable_image_layout":true,"can_view_tailor":true,"can_view_giftbox":true,"can_read_later":true,"can_view_best_of":true,"enable_authorship":true,"dont_track_user":true,"can_share_to_facebook":true,"filter_other_languages":true},"welcomeUrl":"//medium.com/about/9e53ca408c48"}
  obv.shell.ij.initialize(GLOBALS)

  // Create a new service registry (installed in dependency order).
  var services = window['__obv'] = new obv.shell.Services()
  var servicesRegistry = {
    // 'activity-monitor': new obv.shell.ActivityMonitor(),
    'request': new obv.shell.RequestService(),
    // 'image': new obv.data.ImageService(services),
    'app': new obv.shell.App('/', services, String(obv.shell.ij.get('productName')))
  }
  
  for (var service in servicesRegistry)
    services.add(service, servicesRegistry[service])

  // Two stage initialization for services.
  services.initialize()

  // Set up and initialize the application.
  var app = services.get('app')
                    .defineSurface('container')
                    .registerScreen('', str8.screens.SignupScreen)
                    .registerScreen('parties', str8.screens.PartyListScreen)

  // We perform a navigation to the initial path.  This should cause a screen to be
  // created which will bind to the pre-rendered DOM.
  var startLocation = location.pathname.substr(1) + location.hash
  var isInitialNav = true
  obv.shell.log('Initial navigation to "/' + startLocation + '"')
  app.init(startLocation)
      .addBoth(function () { isInitialNav = false })
      .addErrback(function (e) { obv.shell.error('Initial navigate failed', e) })

  // setup actions
  // obv.shell.action.on('navigate', function (action) {
  //   services.get('app').navigate(action.value)
  // })

})()
