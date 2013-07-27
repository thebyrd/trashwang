
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * Home Page
 * If use is logged in send them to the dashboard.
 * Otherwise send them to signup.
 */
app.get('/', function (req, res) {
  res.render('index')
  // res.redirect(req.session.authed ? '/dashboard' : '/signup')
})

/**
 * Sign Up
 * Users give their email and take a selfy.
 * The button that takes the picture also takes them to the next step
 */
app.get('/signup', function (req, res) {
  res.render('users/new')
})



app.get('/users', function (req, res) {

})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Spittin str8fire on port ' + app.get('port'));
});
