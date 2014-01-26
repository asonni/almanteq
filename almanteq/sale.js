var mysqlMgr = require('./mysql').mysqlMgr,
    util=require('util');

exports.saleMgr = {
  addSale : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT invoice sale SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },

  editSale : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('UPDATE `invoice` SET `'+body.name+'` = ? WHERE `idinvoice` = ?',  [body.value,body.pk],  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },

  getSales : function(limit,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `invoice` ORDER BY `idinvoice` DESC LIMIT ?',limit,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },

  getSale : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `invoice` WHERE `idinvoice`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },


  
}

