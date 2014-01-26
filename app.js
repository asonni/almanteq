/* 
 * app.js
 * 
 * Our base app code, including Express configs
 */
var express = require('express')
  , engine = require('ejs-locals')
  , app = express()
  , flash = require('connect-flash')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;

exports.init = function(port) {

    app.configure(function(){
        app.set('views', __dirname + '/almanteq/views');
        app.set('view engine', 'ejs');
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session({ secret: 'keyboard dog' }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(express.static(__dirname + '/almanteq/www'));
        app.use(app.router);
        app.enable("jsonp callback");
    });

/*    app.engine('ejs', engine);
*/
    app.configure('development', function(){
       app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
        // app.use(express.logger({ format: ':method :url' }));
    });

    app.configure('production', function(){
       app.use(express.errorHandler()); 
    });


    /*app.use( function(err, req, res, next) {
        res.render('500.ejs', { locals: { error: err }, status: 500 });
    });*/
    
    server = app.listen(port);

    console.log("Listening on port %d in %s mode", server.address().port, app.settings.env);

    return app;
}