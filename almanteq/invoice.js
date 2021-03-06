var mysqlMgr = require('./mysql').mysqlMgr,
    util=require('util');

exports.invoiceMgr = {
  addInvoice : function(body,cb){ 
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT INTO invoice SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(result.insertId);
        }
      });
    });
  },
  addTheme : function(body,val,cb){ 
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT INTO theme SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(result.insertId,val);
        }
      });
    });
  },
  addSystem : function(body,cb){ 
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT INTO isystem SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(result.insertId);
        }
      });
    });
  },
  getInvoices : function(limit,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT invoice.idinvoice, invoice.status,invoice.type, invoice.expire,invoice.date, customer.name as cname,user.name as uname  FROM `invoice` INNER JOIN customer ON invoice.customer_idcustomer = customer.idcustomer INNER JOIN user ON invoice.user_iduser = user.iduser ORDER BY invoice.idinvoice DESC LIMIT '+limit+', 10',function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  getCustomerInvoices : function(id,limit,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT invoice.idinvoice, invoice.status,invoice.type, invoice.expire,invoice.date,user.name as uname  FROM `invoice`  INNER JOIN user ON invoice.user_iduser = user.iduser WHERE invoice.customer_idcustomer = ? ORDER BY invoice.idinvoice DESC LIMIT '+limit+', 10',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  queryInvoices : function(query,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT invoice.idinvoice, invoice.status,invoice.type, invoice.expire,invoice.date, customer.name as cname,user.name as uname  FROM `invoice` INNER JOIN customer ON invoice.customer_idcustomer = customer.idcustomer INNER JOIN user ON invoice.user_iduser = user.iduser WHERE invoice.idinvoice = ? ',query,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },

  getInvoice : function(id,cb) {
    mysqlMgr.connect(function (conn){
      var isystem ="`isystem`.`idisystem`, `isystem`.`invoice_idinvoice`,"+
                   "`isystem`.`quantity` as iquantity, `isystem`.`price` as iprice, "+
                   "`isystem`.`totalprice` as itotalprice, `isystem`.`discount` as discount, `isystem`.`system_iditem`,`isystem`.`theme_idtheme`, `isystem`.`warranty`",
          system ="`system`.`iditem`, `system`.`system`,"+
                  "`system`.`productnum`, `system`.`brand`,"+
                  "`system`.`class`, `system`.`barcode`, `system`.`itemprice` as sprice,"+
                  "`system`.`quantity` as squantity, `system`.`totalprice` as stotalprice,"+
                  "`system`.`note`";
      conn.query('SELECT * FROM `invoice` WHERE `idinvoice` = ?; SELECT * FROM `theme` WHERE `invoice_idinvoice` = ?; SELECT '+isystem+','+system+'  FROM `isystem` INNER JOIN `system` ON `isystem`.`system_iditem` = `system`.`iditem` WHERE `isystem`.`invoice_idinvoice` = ? ',[id,id,id],function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  cancelInvoice : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT `type`,`status` FROM `invoice` WHERE `idinvoice` = ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          if (result[0].status=="ACTIVE"){
            if(result[0].type !="FIRST"){
              conn.query('SELECT `system_iditem`,`quantity` FROM `isystem` WHERE `invoice_idinvoice` = ? ',id,function(err,isystem) {
                if(err) {
                  util.log("mysql lib err "+err);
                } else {
                  for (var i=0;i<isystem.length;i++){
                    var iditem = isystem[i].system_iditem,
                        quantity = isystem[i].quantity;
                    conn.query('UPDATE `system` SET `left` = `left` + ? WHERE `iditem` = ?', [quantity,iditem],  function(err, result) {
                      if(err) {
                        util.log(err);
                      } else {

                        console.log(result);
                      }
                    });
                  }
                  conn.query('UPDATE `invoice` SET `status` = "CANCELED" WHERE `idinvoice` = ?', id,  function(err, result) {
                    if(err) {
                      util.log(err);
                    } else {
                      cb(true);
                    }
                  });
                }
              });
            } else {
              conn.query('UPDATE `invoice` SET `status` = "CANCELED" WHERE `idinvoice` = ?', id,  function(err, result) {
                if(err) {
                  util.log(err);
                } else {
                  cb(true);
                }
              });
            }
          } else {
            cb(true);
          }
        }
      });
    });
  },
  getUserRep : function(cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT  `user_iduser` as `id`, MONTH(`timestamp`) as `month`, COUNT(`user_iduser`) as `count`'+
                 'FROM  `invoice`'+
                /* 'WHERE MONTH(CURRENT_DATE()) = MONTH(`timestamp`) '+*/ 
                 'GROUP BY DAY(`timestamp`) ,`user_iduser`; SELECT DISTINCT '+
                 '(`user_iduser`) AS valueField ,`user`.`name` FROM  `invoice` ,  `user` '+
                  'WHERE `user`.`iduser` =  `invoice`.`user_iduser` ',function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },

}

