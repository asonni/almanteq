var mysqlMgr = require('./mysql').mysqlMgr,
    util=require('util');

exports.userMgr = {
  checkEmail : function(email,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('select `email` FROM `user` where `email` = ?', email,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          if(result[0]) {
            cb({valid:false});
          } else {
            cb({valid:true});
          }
        }
      });
    });
  },
  addUser : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT INTO `user` SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(body.email);
        }
      });
    });
  },
  getUser : function(email,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `user` WHERE `email`= ? ',email,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result[0]);
        }
      });
    });
  },
  getUsers : function(limit,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `user` ORDER BY `iduser` DESC LIMIT ?',limit,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  getUserById : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `user` WHERE `iduser`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result[0]);
        }
      });
    });
  },
  activate : function(id,cb){
    console.log(id);
    mysqlMgr.connect(function (conn) {
      conn.query('UPDATE `user` SET `active` = 1 , type = "user" WHERE `iduser` = ?', id,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },
  delUser : function(id,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('DELETE FROM `user` WHERE `iduser` = ?', id,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },
  getType: function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT `type` FROM `user` WHERE `iduser`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result[0]);
        }
      });
    });
  },
  getEmail: function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT `email` FROM `user` WHERE `iduser`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result[0]);
        }
      });
    });
  },
  getPass: function(email,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT `password` FROM `user` WHERE `email`= ? ',email,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result[0]);
        }
      });
    });
  },
  editUser : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('UPDATE `user` SET `'+body.name+'` = ? WHERE `iduser` = ?',  [body.value,body.pk],  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },
  getName : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT name FROM `user` WHERE `iduser`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
}

