var crypto = require('crypto'),
    sendMailMgr = require('./sendmail').sendMailMgr,
    mysqlMgr = require('./mysql').mysqlMgr;

exports.signUpMgr = {
  initialSignUp : function(email){
  	this.getToken(function(token){
  	for(var i=0;i<10;i++){
	  	  mysqlMgr.connect(function(conn){
	  	  	conn.query('SELECT * from user', function(err, rows) {
	  	  		if(err)
	  	  			console.log(err);
	  	  		else 
	  	  			
	  	  		console.log(rows);
  
			});
	  	  });
  	}

  	  //sendMailMgr.register(email,token);
  	});
  },
  getToken : function (callback){
	crypto.randomBytes(24, function(ex, buf) {
	  var token = buf.toString('hex');
	  callback(token);
	});
  },
}

