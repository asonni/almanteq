var mysqlMgr = require('./mysql').mysqlMgr,
    util=require('util');

exports.specMgr = {
  addSpec : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT INTO spec SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(result.insertId);
        }
      });
    });
  },
  editSpec : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('UPDATE `spec` SET `'+body.name+'` = ? WHERE `idspec` = ?',  [body.value,body.pk],  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },
  getSpecs : function(id,limit,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `spec` WHERE system_iditem = ? ORDER BY `idspec`  DESC LIMIT ?',[id,limit],function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  delSpec : function(id,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('DELETE FROM `spec` WHERE `idspec` = ?', id,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },
}

