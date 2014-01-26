var path           = require('path')
  , templatesDir   = path.resolve(__dirname, '.', 'templates')
  , emailTemplates = require('email-templates')
  , nodemailer     = require('nodemailer');

 // Prepare nodemailer transport object
var transport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    user: "almanteqtrading@gmail.com",
    pass: "tr0ngAlmanteq"
  }
});

exports.emailMgr = {
  /*register : function(email,token){
    this.send(email,token);
  },
  send : function(email,token) {
    emailTemplates(templatesDir, function(err, template) {

      if (err) {
        console.log(err);
      } else {

        // An example users object with formatted email function
        var locals = {
          email: email,
          url: {
            token: token,
            link: 'http://almanteq.com'
          }
        };

        // Send a single email
        template('registration', locals, function(err, html, text) {
          if (err) {
            console.log(err);
          } else {
            transport.sendMail({
              from: 'almanteq  <info@almanteq.com>',
              to: locals.email,
              subject: 'Welcom to Almanteq!',
              html: html,
              // generateTextFromHTML: true,
              text: text
            }, function(err, responseStatus) {
              if (err) {
                console.log(err);
              } else {
                console.log(responseStatus.message);
              }
            });
          }
        });

      }
    });  
  },*/
  activationNotify : function(email) {
    emailTemplates(templatesDir, function(err, template) {

      if (err) {
        console.log(err);
      } else {

        // An example users object with formatted email function
        var locals = {
          email: email,
          url: {
            link: 'http://almanteq.com'
          }
        };

        // Send a single email
        template('activation', locals, function(err, html, text) {
          if (err) {
            console.log(err);
          } else {
            transport.sendMail({
              from: 'Almanteq  <info@almanteq.com>',
              to: locals.email,
              subject: 'تم تفعيلك في منظومة المنطق للمبيعات',
              html: html,
              // generateTextFromHTML: true,
              text: text
            }, function(err, responseStatus) {
              if (err) {
                console.log(err);
              } else {
                console.log(responseStatus.message);
              }
            });
          }
        });

      }
    });  
  },
  sendPass : function(pass,email) {
    emailTemplates(templatesDir, function(err, template) {

      if (err) {
        console.log(err);
      } else {

        // An example users object with formatted email function
        var locals = {
          email: email,
          user: {
            email : email,
            pass : pass
          }
        };

        // Send a single email
        template('pass', locals, function(err, html, text) {
          if (err) {
            console.log(err);
          } else {
            transport.sendMail({
              from: 'Almanteq  <info@almanteq.com>',
              to: locals.email,
              subject: 'طلب إسترجاع كلمة المرور',
              html: html,
              // generateTextFromHTML: true,
              text: text
            }, function(err, responseStatus) {
              if (err) {
                console.log(err);
              } else {
                console.log(responseStatus.message);
              }
            });
          }
        });

      }
    });  
  },
}




