var mysqlMgr = require('./mysql').mysqlMgr,
    util=require('util');

exports.fileMgr = {
  addFile : function(body,cb){
    console.log(body);
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT INTO file SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          console.log(result);
          cb(result.insertId);
        }
      });
    });
  },
  getFiles : function(id,limit,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `file` WHERE offer_idoffer = ? ORDER BY `idfile`  DESC LIMIT ?',[id,limit],function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  delFile : function(id,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('DELETE FROM `file` WHERE `idfile` = ?', id,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },
}

