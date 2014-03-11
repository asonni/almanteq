var mysqlMgr = require('./mysql').mysqlMgr,
    util=require('util');

exports.offerMgr = {
  addOffer : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT INTO offer SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(result.insertId);
        }
      });
    });
  },

  editOffer : function(body,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('UPDATE `offer` SET `'+body.name+'` = ? WHERE `idoffer` = ?',  [body.value,body.pk],  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },

  getOffers : function(limit,cb) {
    mysqlMgr.connect(function (conn){
      limit = parseInt(limit);
      conn.query('SELECT * FROM `offer` ORDER BY `idoffer` DESC LIMIT '+limit+', 10',function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },

  getOffer : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `offer` WHERE `idoffer`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },
  getOfferN : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT `offern` FROM `offer` WHERE `idoffer`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result[0]);
        }
      });
    });
  },
  updateSystems : function(id) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT `rate`,`overallex`,`paidinlyd`,`retail`,`wholesale` FROM `offer` WHERE `idoffer`= ? ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          console.log(result[0]);
        }
      });
    });
  },

  updateOffer: function(body,flag,cb){
    mysqlMgr.connect(function (conn){
      conn.query('SELECT `rate`,`paidinf`,`overallex` FROM `offer` WHERE `idoffer`= ? ',body.offer_idoffer,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          var offer = result[0],
              rate = offer.rate,
              overall = offer.overallex,
              paidinlyd = 0,
              paidinf=offer.paidinf;
          if(flag){
            paidinf += parseFloat(body.totalprice);
            paidinlyd = paidinf*rate;
            paidinlyd = parseFloat(paidinlyd.toFixed(3));
            overall += paidinlyd;
          } else {
            paidinf -= parseFloat(body.totalprice);
            paidinlyd = paidinf*rate;
            paidinlyd = parseFloat(paidinlyd.toFixed(3));
            overall += paidinlyd;
          }
      
          conn.query('UPDATE `offer` SET `overall` = ?, `paidinf` = ?, `paidinlyd` = ? WHERE `idoffer` = ?',  [overall,paidinf,paidinlyd,body.offer_idoffer],  function(err, result) {
            if(err) {
              util.log(err);
            } else {
              var obj = {
                overall : overall,
                paidinf : paidinf,
                paidinlyd : paidinlyd
              }
              console.log(paidinf);
              cb(obj);
            }
          });
        }
      });
    });
  },

  activate : function(id,cb){
    console.log(id);
    mysqlMgr.connect(function (conn) {
      conn.query('UPDATE `offer` SET `status` = 1 WHERE `idoffer` = ?', id,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          cb(true);
        }
      });
    });
  },
  delOffer : function(id,cb){
    mysqlMgr.connect(function (conn) {
      conn.query('DELETE FROM `spec` WHERE `offer_idoffer` = ?; DELETE FROM `system` WHERE `offer_idoffer` = ?; DELETE FROM `file` WHERE `offer_idoffer` = ?; ', [id,id,id],  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          conn.query('DELETE FROM `offer` WHERE `idoffer` = ?', id,  function(err, result) {
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
  getCustOffers : function(id,cb) {
    mysqlMgr.connect(function (conn){
      conn.query('SELECT * FROM `offer` WHERE `customer_idcustomer` = ? ORDER BY `idoffer` DESC ',id,function(err,result) {
        if(err) {
        util.log("mysql lib err "+err);
        } else {
          cb(result);
        }
      });
    });
  },

  
}

