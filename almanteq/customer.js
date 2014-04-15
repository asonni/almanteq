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
      conn.query('SELECT * FROM `customer` WHERE `idcustomer`= ? ;'+
        ' SELECT SUM(`offer`.`left`) AS `left` FROM `offer` WHERE `offer`.`customer_idcustomer` = ?;'+
        ' SELECT  SUM(`invoice`.`totalprice`) as totalprice, SUM(`invoice`.`paid`) as paid from `invoice` WHERE `invoice`.`customer_idcustomer` = ?;'+
        ' SELECT  SUM(`receipt`.`amount`) as pay from `receipt` WHERE `receipt`.`type`="PAY" AND `receipt`.`customer_idcustomer`=?;'+
        ' SELECT  SUM(`receipt`.`amount`) as recieve from `receipt` WHERE `receipt`.`type`="RECIEVE" AND `receipt`.`customer_idcustomer`=?',[id,id,id,id,id],function(err,result) {
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

  addReceipt : function(body,cb){
    console.log(body);
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT INTO `receipt` SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          console.log(result.insertId);
          cb(result.insertId);
        }
      });
    });
  },
  getReceipts : function(id,limit,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `receipt` WHERE `customer_idcustomer` = ? ORDER BY `idreceipt`  DESC LIMIT ?, 10 ',[id,limit],function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  getReceipt : function(id,cid,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `receipt` WHERE `idreceipt` = ?; SELECT name FROM `customer` WHERE `idcustomer`= ?  ',[id,cid],function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
}

