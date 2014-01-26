var mysqlMgr = require('./mysql').mysqlMgr,
    util=require('util');

exports.customerMgr = {
  addCustomer : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT INTO `customer` SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(result.insertId);
        }
      });
    });
  },

  editCustomer : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('UPDATE `customer` SET `'+body.name+'` = ? WHERE `idcustomer` = ?',  [body.value,body.pk],  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },

  getCustomers : function(limit,cb) {
    mysqlMgr.connect(function (conn){
      limit = parseInt(limit);
      conn.query('SELECT * FROM `customer` ORDER BY `idcustomer` DESC LIMIT '+limit+', 10',function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  queryCustomers : function(query,cb) {
    mysqlMgr.connect(function (conn){
      query = query.replace(/["']/g, "");
      conn.query('SELECT `name`,`idcustomer` FROM  `customer` WHERE  `name` LIKE  "%'+query+'%"',function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  getCustomer : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `customer` WHERE `idcustomer`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  getNames : function(cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT `idcustomer` AS value,`name` AS text, `creditor`, `debtor` FROM `customer` ORDER BY `idcustomer`',function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  getName : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT name FROM `customer` WHERE `idcustomer`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          console.log(result);
          cb(result);
        }
      });
    });
  },
}

