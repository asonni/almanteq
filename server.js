var http = require('http'),
	util=require('util'),
  getMgr = require('./almanteq/get').getMgr,
  postMgr=require('./almanteq/post').postMgr,
  offerMgr=require('./almanteq/offer').offerMgr,
  mysqlMgr = require('./almanteq/mysql').mysqlMgr,
  userMgr= require('./almanteq/user').userMgr,
   emailMgr=require('./almanteq/sendmail').emailMgr,
  qs=require('querystring'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  fs=require('fs'),
  nameDic = {};


function findById(id, fn) {
  userMgr.getUserById(id, function(user){
    if(user){
      fn(null, user);
    } else {
      fn(new Error('User ' + id + ' does not exist'));
    }
  });
}

function findByUsername(username, fn) {
  userMgr.getUser(username, function(user){
    if(user) {
      return fn(null, user);
    } else {
      return fn(null, null);
    }
  });
}
function setUser(SID, user){
  nameDic[SID] = {name : user.name,
                  type : user.type,
                  id : user.iduser};
}
function getUserName(SID){
  return nameDic[SID].name;
}
function getUserType(SID){
  return nameDic[SID].type;
}
function getUserId(SID){
  return nameDic[SID].id;
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.iduser);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'مستخدم غير معروف ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        if (user.type =="new") { return done(null, false, { message: 'مستخدم غير مؤهل' }); }
        return done(null, user);
      })
    });
  }
));

var app = require('./app').init(4000);

app.get('/', function(req,res){
  res.render('login');
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.flash('error') });
});
app.get('/errorlogin', function(req, res){
  res.render('errorlogin', { user: req.user, message: req.flash('error') });
});
app.get('/signup', function(req, res){
  res.render('signup');
});

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    userMgr.getUser(req.body.username, function (user){
      setUser(req.sessionID,user);
      res.redirect('/offers');
    });
  });

app.get('/checkEmail', function (req,res){
  getMgr.checkEmail(req,function (result){
      res.send(result);
  });
});
app.get('/getUser',ensureAuthenticated ,function (req,res){
  res.send(getUserName(req.sessionID));
});
app.get('/getUserData',ensureAuthenticated ,function (req,res){
  console.log("got here");
  userMgr.getUserById(getUserId(req.sessionID), function (user){
    res.send(user);
  });
});
app.get('/logout', function (req, res){
  req.logout();
  res.redirect('/login');
});

app.get('/offers',ensureAuthenticated, function(req, res){
  console.log(getUserName(req.sessionID));
  res.render('offers');
});
app.get('/sales',ensureAuthenticated, function(req, res){
  console.log(getUserName(req.sessionID));
  res.render('sales');
});
app.get('/newInvoice',ensureAuthenticated, function(req, res){
  console.log(getUserName(req.sessionID));
  res.render('newinvoice');
});
app.get('/customers',ensureAuthenticated, function(req, res){
  res.render('customers');
});
app.get('/stock',ensureAuthenticated, function(req, res){
  res.render('stock');
});

app.get('/users',ensureAuthenticated, function(req, res){
  if(getUserType(req.sessionID)!="user") {
    res.render('users');
  } else {
    res.render('offers');
  }
});
app.get('/getUserType',ensureAuthenticated, function(req, res){
  if(getUserType(req.sessionID)!="user") {
      res.send(true);
  } else {
    res.send(false);
  }
});

app.get('/user',ensureAuthenticated, function(req, res){
  res.render('user');
});

app.get('/action/:type/:id?', ensureAuthenticated, function(req,res){
  console.log(req.params);
  getMgr.get(req,res,function(results){
     res.contentType('application/json');
     res.send(results);
  });
});
app.get('/retPass/:email', function(req,res){
  console.log(req.params);
  userMgr.getPass(req.params.email,function (result){
      emailMgr.sendPass(result.password,req.params.email);
      res.send(true);
    });
});

app.post('/upload', ensureAuthenticated, function(req, res) {
   // files are now in the req.body object along with other form fields
   // files also get moved to the uploadDir specified
  //console.log(req.url);
  //console.log(req.files.file);

  if(req.files){
    var fileName = new Date().getTime(),
        ext = req.files.file.name.split('.').pop(),
        path = "/files/",
        type = req.files.file.type;
    req.body = {
       name : req.files.file.name,
       path : path+fileName+"."+ext,
       type : type,
       offer_idoffer : req.body.id
    };
    postMgr.post(req,res,getUserId(req.sessionID),function(results){
      fs.readFile(req.files.file.path, function (err, data) {
        console.log(fileName);
        var newPath = __dirname + "/almanteq/www/files/"+fileName+"."+ext;
        console.log(newPath);
        fs.writeFile(newPath, data, function (err) {
          res.redirect("back");
        });
      });

    });
  }
    
});

app.post('/signUp',function(req,res){
  postMgr.post(req,res,req.body,function(result){
    res.send(result);
  })
});



app.post('/*', ensureAuthenticated, function(req, res){
  postMgr.post(req,res,getUserId(req.sessionID),function(results){
     res.contentType('application/json');
     res.send(results);
  });
});

/* The 404 Route (ALWAYS Keep this as the last route) */
app.get('/*', function(req, res){
    res.render('login',{message:false});
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
