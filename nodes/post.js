var Q = require('kew')

module.exports = {
  getHomePagePosts: function (db, body) {
    var defer = Q.defer()
    db.getAll('posts', defer.makeNodeResolver())
    return defer.promise
  },
  
  tranformPost: function (post) {
    return post
  },

  transformPosts: function (posts) {
    return {
      title: 'Small',
      posts: posts
    }
  },
  
  transformPostsForEditor: function (posts) {
    return posts
  },

  createPost: function (db, title, authorId, body) {

  },
  
  getPostById: function (db, id) {
    return {title: 'fun post'}
  },
  
  getPostsByIds: function (db, ids) {
    return [{title: 'fun post'}, {title: 'other post'}]
  },

  postCreationRedirectUrl: function (post) {
    return '/p/' + post.id
  }
}