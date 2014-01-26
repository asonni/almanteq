var mysqlMgr = require('./mysql').mysqlMgr,
    util=require('util');

exports.branchMgr = {
  addBranch : function(body,cb){ 
    mysqlMgr.connect(function (conn) {
      console.log(body);
      conn.query('INSERT INTO branch SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(result.insertId);
        }
      });
    });
  },
  getBranches : function(cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `branch` ORDER BY `idbranch` ',function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  editBranch : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('UPDATE `branch` SET `'+body.name+'` = ? WHERE `idbranch` = ?',  [body.value,body.pk],  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },
  
  delBranch : function(id,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('DELETE FROM `branch` WHERE `idbranch` = ?', id,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },
}

