var defaultMgr =require('./default').defaultMgr,
	url=require('url'),
	util=require('util'),
	qs=require('querystring'),
    offerMgr=require('./offer').offerMgr,
    invoiceMgr=require('./invoice').invoiceMgr,
    systemMgr=require('./system').systemMgr,
    specMgr=require('./spec').specMgr,
    branchMgr=require('./branch').branchMgr,
    fileMgr=require('./file').fileMgr,
    userMgr=require('./user').userMgr,
    emailMgr=require('./sendmail').emailMgr,
    customerMgr= require('./customer').customerMgr;

exports.getMgr = {
  get : function(req,res,cb){
  	var action = req.params.type;
	if (action){
	  switch(action){
      case "getUsers" :
        this.handleGetUsers(req.params,res,cb);
        break;
      case "getBranches" :
        this.handleGetBranches(req.params,res,cb);
        break;
	  	case "getOffers" :
	      this.handleGetOffers(req.params,res,cb);
	      break;
      case "getSales" :
        this.handleGetSales(req.params,res,cb);
        break;
      case "getCustomerSales" :
        this.handleGetCustomerSales(req.params,res,cb);
        break;
	    case "getOffer" :
	      this.handleGetOffer(req.params,res,cb);
	      break;
      case "getInvoice" :
        this.handleGetInvoice(req.params,res,cb);
        break;
      case "getOfferN" :
        this.handleGetOfferN(req.params,res,cb);
        break;
	    case "getSystems" :
	      this.handleGetSystems(req.params,res,cb);
	      break;
      case "getStock" :
        this.handleGetStock(req.params,res,cb);
        break;
	    case "getSystem" :
	      this.handleGetSystem(req.params,res,cb);
	      break;  
	    case "getSpecs" :
	      this.handleGetSpecs(req.params,res,cb);
	      break;
	    case "delSpec" :
	      this.handleDelSpec(req.params,res,cb);
	      break;
      case "delBranch" :
        this.handleDelBranch(req.params,res,cb);
        break;
      case "delUser" :
        this.handleDelUser(req.params,res,cb);
        break;
      case "delSys" :
        this.handleDelSys(req.params,res,cb);
        break;
      case "delOffer" :
        this.handleDelOffer(req.params,res,cb);
        break;
      case "itemArrived" :
        this.handleItemArrived(req.params,res,cb);
        break;
      case "getFiles" :
        this.handleGetFiles(req.params,res,cb);
        break;
      case "delFile" :
        this.handleDelFile(req.params,res,cb);
        break;
      case "activate" :
        this.handleActivate(req.params,res,cb);
        break;
      case "activateUser" :
        this.handleActivateUser(req.params,res,cb);
        break;
      case "getCustomers" :
        this.handleGetCustomers(req.params,res,cb);
        break;
      case "getCustomersNames" :
        this.handleGetCustomersNames(req.params,res,cb);
        break;
      case "getCustomer" :
        this.handleGetCustomer(req.params,res,cb);
        break;
      case "getCustName" :
        this.handleGetCustName(req.params,res,cb);
        break;
      case "queryCustomers" :
        this.handleQueryCustomers(req.params,res,cb);
        break;
      case "querySystems" :
        this.handleQuerySystems(req.params,res,cb);
        break;
      case "getItemPrice" :
        this.handleGetItemPrice(req.params,res,cb);
        break;
      case "queryInvoices" :
        this.handleQueryInvoices(req.params,res,cb);
        break;
      case "cancelInvoice" :
        this.handleCancelInvoice(req.params,res,cb);
        break;
      case "getUserRep" :
        this.handlegetUserRep(req.params,res,cb);
        break;
      case "getCustOffers" :
        this.handleGetCustOffers(req.params,res,cb);
        break;
	    default:
		  /*defaultMgr.handleDefault(req, res);*/
	  }	
	}
	
  },
  handleUserName : function(req,res){
	console.log(req.username);
	defaultMgr.writeJson({"valid":true},res);
  },
  handleEmail : function(req,res){
	console.log(req.email);
	defaultMgr.writeJson({"valid":true},res);
  },
  handleGetUsers : function (req,res,cb){
    userMgr.getUsers(20,function (result){
      cb(result);
    });
  },
  handleActivateUser : function (req,res,cb){
    userMgr.activate(req.id,function (result){
      userMgr.getEmail(req.id,function (result){
        emailMgr.activationNotify(result.email);
        cb(result);
      });
    });
  },
  handleGetOffers : function (req,res,cb){
  	offerMgr.getOffers(req.id,function (result){
  	  cb(result);
  	});
  },
  handleGetSales : function (req,res,cb){
    invoiceMgr.getInvoices(req.id,function (result){
      cb(result);
    });
  },
  handleGetCustomerSales : function (req,res,cb){
    var obj = JSON.parse(req.id);
    invoiceMgr.getCustomerInvoices(obj.id,obj.limit,function (result){
      cb(result);
    });
  },

  handleGetOffer : function (req,res,cb){
  	offerMgr.getOffer(req.id,function (result){
  	  cb(result);
  	});
  },
  handleGetInvoice : function (req,res,cb){
    invoiceMgr.getInvoice(req.id,function (result){
      cb(result);
    });
  },
  handleGetOfferN : function (req,res,cb){
    offerMgr.getOfferN(req.id,function (result){
      cb(result);
    });
  },
  handleGetSystems : function (req,res,cb){
  	systemMgr.getSystems(req.id,function (result){
  	  cb(result);
  	});
  },
  handleGetStock : function (req,res,cb){
    systemMgr.getStock(req.id,function (result){
      cb(result);
    });
  },
  handleGetSystem : function (req,res,cb){
  	systemMgr.getSystem(req.id,function (result){
  	  cb(result);
  	});
  },
  handleGetSpecs : function (req,res,cb){
  	specMgr.getSpecs(req.id,100,function (result){
  	  cb(result);
  	});
  },
  handleGetBranches : function (req,res,cb){
    branchMgr.getBranches(function (result){
      cb(result);
    });
  },
  handleDelSpec : function (req,res,cb){
  	specMgr.delSpec(req.id,function (result){
  	  cb(result);
  	});
  },
  handleDelBranch : function (req,res,cb){
    branchMgr.delBranch(req.id,function (result){
      cb(result);
    });
  },
  handleDelUser : function (req,res,cb){
    userMgr.getType(req.id,function (result){
      if(result.type != "root"){
        userMgr.delUser(req.id,function (result){
          cb(result);
        });
      } else {
        cb(false);
      }
    });
    
  },
  handleDelSys : function (req,res,cb){
    systemMgr.getTotalPrice(req.id,function (result){
      offerMgr.updateOffer(result,false, function (result){
        /*offerMgr.updateSystems(result.offer_idoffer);*/
          systemMgr.delSys(req.id,function (res){
            cb(result);
          });
      });
    });
  },
  handleDelOffer : function (req,res,cb){
    offerMgr.delOffer(req.id,function (res){
      cb(res);
    });
  },
  handleItemArrived : function (req,res,cb){
    systemMgr.arrived(req.id,function (result){
      cb(result);
    });
  },
  handleGetFiles : function (req,res,cb){
    fileMgr.getFiles(req.id,20,function (result){
      cb(result);
    });
  },
  handleDelFile : function (req,res,cb){
    fileMgr.delFile(req.id,function (result){
      cb(result);
    });
  },
  handleActivate : function (req,res,cb){
    offerMgr.activate(req.id,function (result){
      systemMgr.activate(req.id,function (result){
        cb(result);
      });
    });
  },
  checkEmail : function(req,cb){
    userMgr.checkEmail(req.query.email,function(result){
      cb(result)
    });
  },
  handleGetCustomers : function (req,res,cb){
    customerMgr.getCustomers(req.id,function (result){
      cb(result);
    });
  },
  handleGetCustomersNames : function (req,res,cb){
    customerMgr.getNames(function (result){
      cb(result);
    });
  },  
  handleGetCustName : function (req,res,cb){
    customerMgr.getName(req.id,function (result){
      cb(result);
    });
  },  
  handleGetCustomer : function (req,res,cb){
    customerMgr.getCustomer(req.id,function (result){
      cb(result);
    });
  },
  handleQueryCustomers : function (req,res,cb){
    customerMgr.queryCustomers(req.id,function (result){
      cb(result);
    });
  },
  handleQuerySystems : function (req,res,cb){
    systemMgr.querySystems(req.id,function (result){
      cb(result);
    });
  },
  handleGetItemPrice : function (req,res,cb){
    systemMgr.getItemPrice(req.id,function (result){
      cb(result);
    });
  },
  handleQueryInvoices : function (req,res,cb){
    invoiceMgr.queryInvoices(req.id,function (result){
      cb(result);
    });
  },
  handleCancelInvoice : function (req,res,cb){
    invoiceMgr.cancelInvoice(req.id,function (result){
      cb(true);
    });
  },
  handlegetUserRep : function (req,res,cb){
    invoiceMgr.getUserRep(function (result){
      cb(result);
    });
  },
  handleGetCustOffers : function (req,res,cb){
    offerMgr.getCustOffers(req.id,function (result){
      cb(result);
    });
  },

}
