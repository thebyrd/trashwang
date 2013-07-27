module.exports = {
  /**
   * Home Page
   */
  index: function (builder) { // builder is graph.newBuilder('Post.index')
    return builder
      .builds('app.db')
      .builds('getHomePagePosts')
        .using('app.db', 'req.body')
      .builds('transformPosts')
        .using({'posts': 'getHomePagePosts'})
    .respond('templates.posts.index', 'transformPosts')      
  },

  /**
   * Show Post
   */
  show: function (builder) {
    return builder
      .builds('app.db')
      .builds('getPostById')
        .using('app.db', 'url.postId')
      .builds('transformPosts')
        .using('getPostById')
    .respond('templates.posts.show')
  },

  /**
   * New Post Form
   */
  new: function (builder) {
    return builder.respond('templates.posts.new')  
  },

  /**
   * Post Editor
   */
  edit: function (builder) {
    return builder
      .builds('app.db')
      .builds('getPostsById')
        .using('app.db', 'url.postId')
      .builds('transformPostsForEditor')
        .using('getPostsById')
    .respond('templates.posts.edit')
  }

  // /** 
  //  * Create a post
  //  */
  // create: function (builder) {
  //   return builder
  //     .builds('app.db')
  //     .builds('createPost')
  //       .using('app.db', 'req.body.title', 'req.body.authorId', 'req.body.body')
  //     .builds('postCreationRedirectUrl')
  //       .using('createPost')
  //   .redirect('postCreationRedirectUrl')
  // }
}
