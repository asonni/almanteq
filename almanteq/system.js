var mysqlMgr = require('./mysql').mysqlMgr,
    mathjs = require('mathjs'),
    util=require('util'),
    math = mathjs();

exports.systemMgr = {
  addSystem : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT INTO system SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(result.insertId);
        }
      });
    });
  },
  editSystem : function(body,cb){
    var idoffer=0,
        sum=0;
    mysqlMgr.connect(function (conn) {
      conn.query('UPDATE `system` SET `'+body.name+'` = ? WHERE `iditem` = ?',  [body.value,body.pk],  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          if (body.name =="totalprice") {
            conn.query('SELECT `offer_idoffer` FROM `system` WHERE `iditem`= ? ',body.pk,function(err,result) {
              if(err) {
                util.log("mysql lib err "+err);
              } else {
                idoffer= result[0].offer_idoffer;
                conn.query('SELECT SUM(`totalprice`) as sum FROM `system` WHERE offer_idoffer = ? ',idoffer,function(err,result) {
                  if(err) {
                    util.log("mysql lib err "+err);
                  } else {
                    sum = result[0].sum;
                    conn.query('SELECT `rate`,`overallex` FROM `offer` WHERE idoffer = ? ',idoffer,function(err,result) {
                      if(err) {
                        util.log("mysql lib err "+err);
                      } else {
                        var paidinf = sum,
                            overall = 0,
                            rate = result[0].rate,
                            paidinlyd = paidinf * rate;
                            paidinlyd = parseFloat(paidinlyd.toFixed(3));
                            overall = parseFloat(result[0].overallex+paidinlyd);
                            
                        conn.query('UPDATE `offer` SET `overall` = ?, `paidinf` = ?, `paidinlyd` = ? WHERE `idoffer` = ?',  [overall,paidinf,paidinlyd,idoffer],  function(err, result) {
                          if(err) {
                            util.log(err);
                          } else {
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
          cb(true);
        }
      });
    });
  },

  getSystems : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `system` WHERE offer_idoffer = ? ORDER BY `iditem`  DESC ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },

  getStock : function(limit,cb) {
    mysqlMgr.connect(function (conn){
      limit = parseInt(limit);
      conn.query('SELECT * FROM `system` WHERE `instock` = 1 ORDER BY `iditem`  DESC LIMIT '+limit+', 10',function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },

  getSystem : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `system` WHERE `iditem`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  getTotalPrice : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT `totalprice`,`offer_idoffer` FROM `system` WHERE `iditem`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result[0]);
        }
      });
    });
  },

  delSys : function(id,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('DELETE FROM `spec` WHERE `system_iditem` = ?', id,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          conn.query('DELETE FROM `system` WHERE `iditem` = ?', id,  function(err, result) {
            if(err) {
              util.log(err);
            } else {
              cb(true);
            }
          });
        }
      });
    });
  },
  querySystems : function(query,cb) {
    mysqlMgr.connect(function (conn){
      query = query.replace(/["']/g, "");
      conn.query('SELECT * FROM  `system` WHERE  (`system` LIKE  "%'+query+'%") OR (`barcode` LIKE  "%'+query+'%") OR (`class` LIKE  "%'+query+'%") OR (`productnum` LIKE  "%'+query+'%")' ,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  activate : function(id,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('UPDATE `system` SET `status` = 1 WHERE `offer_idoffer` = ?', id,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },

  arrived : function(id,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('UPDATE `system` SET `instock` = 1 WHERE `iditem` = ?', id,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },
  subSystem : function(id,quantity,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('SELECT `quantity`,`left` from `system` WHERE `iditem` = ?', id,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          var left = result[0].left - quantity;
          conn.query('UPDATE `system` SET `left` = ? WHERE `iditem` = ?', [left,id],  function(err, result) {
            if(err) {
              util.log(err);
            } else {
              cb(true);
            }
          });
        }
      });
    });
  },
  getItemPrice : function(id,cb) {
    var idoffer=0,
        itemprice=0,
        overallex=0,
        paidinlyd=0,
        aftercost=0,
        selltype=null,
        sellprice=0,
        retail=0,
        wholesale=0,
        upper=0,
        retailPrice=0,
        wholesalePrice=0,
        instock,
        left=0,
        obj={};
    mysqlMgr.connect(function (conn){
      conn.query('SELECT `offer_idoffer`,`itemprice`,`instock`,`left`,`selltype`,`sellprice` FROM `system` WHERE `iditem`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          idoffer= result[0].offer_idoffer;
          itemprice = result[0].itemprice;
          instock = result[0].instock;
          left = result[0].left;
          selltype = result[0].selltype;
          sellprice = result[0].sellprice;
          console.log(selltype);

          conn.query('SELECT `rate`,`overallex`,`paidinlyd`,`retail`,`wholesale` FROM `offer` WHERE idoffer = ? ',idoffer,function(err,result) {
            if(err) {
              util.log("mysql lib err "+err);
            } else {
              rate = result[0].rate;
              paidinlyd = result[0].paidinlyd;
              overallex = result[0].overallex;
              retail = result[0].retail;
              wholesale = result[0].wholesale;
              upper = (overallex/paidinlyd)*(rate*itemprice)+(rate*itemprice);
              upper = parseFloat(upper.toFixed(3));
              retailPrice = upper + upper * (retail/100);
              wholesalePrice = upper + upper * (wholesale/100);
              aftercost = math.round(((overallex/paidinlyd)*(rate*itemprice)+(rate*itemprice)),3);
              obj.retail = math.round(retailPrice,3);
              obj.wholesale = math.round(wholesalePrice,3);
              obj.aftercost = aftercost;
              obj.instock = instock;
              obj.left = left;
              obj.sellprice = sellprice;
              obj.selltype = selltype;
              cb(obj);
            }
          });
        }
      });
    });
  },
}


/*return (Math.round((offerd.overallex/offerd.paidinlyd) * (offerd.rate * price)+(offerd.rate * price),3));*/

/*price = Math.round((offerd.overallex/offerd.paidinlyd) * (offerd.rate * price)+(offerd.rate * price),2);
      price +=price * (offerd.retail/100);*/