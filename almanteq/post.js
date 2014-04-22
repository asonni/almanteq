var	url=require('url'),
    util=require('util'),
    defaultMgr=require('./default').defaultMgr,
    signUpMgr=require('./signup').signUpMgr,
    offerMgr=require('./offer').offerMgr,
    systemMgr=require('./system').systemMgr,
    specMgr=require('./spec').specMgr,
    branchMgr=require('./branch').branchMgr,
    fileMgr=require('./file').fileMgr,
    userMgr=require('./user').userMgr,
    invoiceMgr=require('./invoice').invoiceMgr,
    customerMgr= require('./customer').customerMgr,
    emailMgr=require('./sendmail').emailMgr,
    qs=require('querystring'),
    specList=[],
    obj={};

exports.postMgr = {
  post : function(req,res,user,cb){
    var body = this.getObj(req.body),
      base = req.url;
    util.log("POST "+JSON.stringify(req.url));
    switch(base){
      case "/signUp" :
        this.handleSignUp(req,res,body,cb);
        break;
      case "/addOffer" :
        this.handleAddOffer(req,res,body,cb);
        break;
      case "/addCustomer" :
        this.handleAddCustomer(req,res,body,cb);
        break;
      case "/addSystem" :
        this.handleAddSystem(req,res,body,user,cb);
        break;
      case "/addSpec" :
        this.handleAddSpec(req,res,body,cb);
        break;
      case "/addReceipt" :
        this.handleAddReceipt(req,res,body,user,cb);
        break;
      case "/addBranch" :
        this.handleAddBranch(req,res,body,cb);
        break;
      case "/editSpec" :
        this.handleEditSpec(req,res,body,cb);
        break;
      case "/editUser" :
        this.handleEditUser(req,res,body,cb);
        break;
      case "/editSystem" :
        this.handleEditSystem(req,res,body,cb);
        break;
      case "/editCustomer" :
        this.handleEditCustomer(req,res,body,cb);
        break;
      case "/editOffer" :
        this.handleEditOffer(req,res,body,cb);
        break;
      case "/editBranch" :
        this.handleEditBranch(req,res,body,cb);
        break;
      case "/activate" :
        this.handleActivate(req,res,body,cb);
        break;
      case "/upload" :
        this.handleUpload(req,res,body,cb);
        break;
      case "/makeInvoice" :
        this.handleMakeInvoice(req,res,body,user,cb);
        break;
      default:
        /*defaultMgr.handleDefault(req, res);*/
    }
  },
  handleSignUp : function(req,res,body,cb){
    userMgr.addUser(body,function(result){
      cb(result);
    })
  },
  handleUpload : function(req,res,body,cb){
    fileMgr.addFile(body, function (result){
      cb(result);
    });  
  },

  handleAddCustomer : function(req,res,body,cb) {
    customerMgr.addCustomer(body, function (result){
      body["idcustomer"]=result;
      cb(body);
    });
  },
  handleAddOffer : function(req,res,body,cb) {
    offerMgr.addOffer(body, function(result){
      if(result){
        offerMgr.getOffer(result, function(result){
          cb(result);
        });
      }
    });
  },
  handleAddSystem : function(req,res,body,user,cb) {
    //console.log(body);
    var id = null,
        flag = false;
    var specs = {},
        system = {
          system : body.system,
          productnum : body.productnum,
          class : body.class,
          barcode : body.barcode,
          brand : body.brand,
          branch_idbranch : body.branch_idbranch,
          itemprice : body.itemprice,
          quantity : body.quantity,
          left : body.quantity,
          totalprice : body.totalprice,
          note : body.note,
          offer_idoffer : body.offer_idoffer,
          selltype : body.selltype,
          sellprice : body.sellprice,
          user_iduser : user
        };

    specs = {
      productn : body.product,
      name : body.name,
      squantity : body.squantity
    }; 

    if(body.product instanceof Array) {
      flag = true;
    } 
    systemMgr.addSystem(system, function(result){
      if(result){
        id = result;
        system["iditem"]=id;
        if (flag){
          for (var i = 0; i < specs.productn.length; i++){
            if(specs.name[i]){
              var obj = {
                productn : specs.productn[i],
                name : specs.name[i],
                squantity : specs.squantity[i],
                system_iditem : id
              };
              specMgr.addSpec(obj, function (result){
              });
            }
          }
        } else {
          specs["system_iditem"] = id;
          specs["offer_idoffer"] = body.offer_idoffer;
          specMgr.addSpec(specs, function (result){
          });
        }
        offerMgr.updateOffer(system,true, function(result){
          offerMgr.updateSystems(system.offer_idoffer);
          system.result= result;
          cb(system);
        });
      }
    });
  },
  handleAddSpec : function(req,res,body,cb) {
    specMgr.addSpec(body, function (result){
      body["idspec"]=result;
      cb(body);
    });
  },
  handleAddBranch : function(req,res,body,cb) {
    branchMgr.addBranch(body, function (result){
      body["idbranch"]=result;
      cb(body);
    });
  },
  handleEditSpec : function(req,res,body,cb) {
    specMgr.editSpec(body, function (result){
      cb(result);
    });
  },
  handleEditUser : function(req,res,body,cb) {
    userMgr.editUser(body, function (result){
      cb(result);
    });
  },
  handleEditSystem : function(req,res,body,cb) {
    systemMgr.editSystem(body, function (result){
      cb(result);  
    });
  },
  handleEditOffer : function(req,res,body,cb) {
    offerMgr.editOffer(body, function (result){
      cb(result);
    });
  },
  handleEditBranch : function(req,res,body,cb) {
    branchMgr.editBranch(body, function (result){
      cb(result);
    });
  },
  handleEditCustomer : function(req,res,body,cb) {
    customerMgr.editCustomer(body, function (result){
      cb(result);
    });
  },
  handleAddReceipt : function(req,res,body,user,cb) {
    body["user_iduser"]=user;
    customerMgr.addReceipt(body, function (result){
      body["idreceipt"]=result;
      cb(body)
    });
  },
  handleMakeInvoice : function(req,res,body,user,cb) {
    var final = false;
    if (body.main.type =="FINAL") {
      final = true;
    }
    body.main["user_iduser"]=user;
    invoiceMgr.addInvoice(this.getObj(body.main),function(invoice_idinvoice){
      for(var themeKey in body.slctdTh){
        var val1=body.slctdTh[themeKey].val;
        var obj1={
          name : body.slctdTh[themeKey].text,
          selected : 1,
          invoice_idinvoice: invoice_idinvoice
        };
      
        invoiceMgr.addTheme(obj1,val1,function(theme_idtheme,tval){

          for (var objKey in body.slctdObjs){
            if (body.slctdObjs[objKey].theme == tval){
              var sysObj1 = {
                invoice_idinvoice : invoice_idinvoice,
                quantity : body.slctdObjs[objKey].quantity,
                price:body.slctdObjs[objKey].price,
                discount:body.slctdObjs[objKey].discount,
                totalprice:body.slctdObjs[objKey].totalprice,
                system_iditem:body.slctdObjs[objKey].system_iditem,
                warranty:body.slctdObjs[objKey].warranty,
                theme_idtheme:theme_idtheme
              };
              if(final){
                systemMgr.subSystem(body.slctdObjs[objKey].system_iditem,body.slctdObjs[objKey].quantity,function(result){
                  return true;
                });
              }
              invoiceMgr.addSystem(sysObj1,function(result){
                return true;
              });
            }
          }
          //
        });
      }
      if(body.sbslctdTh!=undefined) {
        for(var sbThemeKey in body.sbslctdTh){
          var val2=body.sbslctdTh[sbThemeKey].val;
          var obj2={
            name : body.sbslctdTh[sbThemeKey].text,
            selected : 0,
            invoice_idinvoice: invoice_idinvoice
          };
       
          invoiceMgr.addTheme(obj2,val2,function(theme_idtheme,tval2){
            for (var sbObjKey in body.sbslctdObjs){
              if (body.sbslctdObjs[sbObjKey].theme == tval2){
                var sysObj2 = {
                  invoice_idinvoice : invoice_idinvoice,
                  quantity : body.sbslctdObjs[sbObjKey].quantity,
                  price:body.sbslctdObjs[sbObjKey].price,
                  discount:body.sbslctdObjs[sbObjKey].discount,
                  totalprice:body.sbslctdObjs[sbObjKey].totalprice,
                  system_iditem:body.sbslctdObjs[sbObjKey].system_iditem,
                  warranty:body.slctdObjs[objKey].warranty,
                  theme_idtheme:theme_idtheme
                };
                invoiceMgr.addSystem(sysObj2,function(result){
                  return true;
                });
              }
            }
          });
        }
      }
    });
    cb(true); 
  },
   handleActivate: function(req,res,body,cb) {
    
  },
  getObj :function (obj) {
    var newObj={};
    for (var p in obj) {
      
      if(p!= "__proto__"){
        newObj[p]=obj[p];
     }
    }
    return newObj;
  },
}

