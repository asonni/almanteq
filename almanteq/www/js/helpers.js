$(document).ready(function(){
	
	var templates = {};
	var url = $.url().param(),
		id = url.id,
		uid = url.uid;	
	$.tp = {
		url : url,
		id : id,
		uid : uid
	};
	//console.log($(location).attr('href').split('/')[5]);
	window.prettyPrint && prettyPrint();
	$('#dp3').datepicker();

	$.addTheme = function (data,temp){
		var f = templates[temp], 
			rendered = "";

		if (f){
			rendered = f(data);
			$(rendered).hide().prependTo("#allSystems tbody").fadeIn("slow");
		}
	 }

	$.draw = function (data,temp,target){
		var f = templates[temp], 
			rendered = "";

		if (f){
			rendered = f(data);
			if (!target){
				return rendered;
			}else{
				$(target).html(rendered);
			}
		}
	 }

	$(".tmpl").each(function(){
		templates[this.id] = Handlebars.compile(this.innerHTML);			
	});
	$.getDate = function (){
		var date = new Date();
		var day = date.getDate(),
			month = date.getMonth()+1,
			year = date.getFullYear();
		return year+"-"+month+"-"+day;
	}
	var funcs = {
		"formatTime" : function(date){
			if (date){
				date = new Date(date);
				var day = date.getDate()+1,
					month = date.getMonth()+1,
					year = date.getFullYear();
				return year+"-"+month+"-"+day;

			}else{
				return "";
			}
		},
		"formatCurrency" : function(currency){
			switch (currency){
				case "USD" :
					return "دولار";
					break;
				case "EUR" :
					return "يورو";
					break;
				case "LYD" :
					return "دينار ليبي";
					break;
				case "GBP" :
					return "باوند";
					break;
				default : 
					return "غير معروف";
			}
		},
		"formatPayment" : function(payment){
			switch (payment){
				case "CASH" :
					return "نقدا";
					break;
				case "ACCOUNT" :
					return "على الحساب";
					break;
				case "HALF" :
					return "دفع جزء وباقي جزء";
					break;
				default : 
					return "غير معروف";
			}
		},
		"customerType" : function(type){
			switch (type){
				case "CUSTOMER" :
					return "زبون";
					break;
				case "COMPANY" :
					return "شركة/مؤسسة حكومية";
					break;
			}
		},
		"totalPrice" : function(itemprice,quantity){
			return Math.round(itemprice*quantity,3);
		},
		"stringify" : function(obj){
			return JSON.stringify(obj);
		},
		"checkStatus" : function(months,date,status){
			if(status){
				return "warning";
			} else {
				var newDate = new Date(),
					valid = new Date(date);
					valid = new Date(date).setMonth(valid.getMonth()+months);
				if(newDate > valid)
					return "important";
				else 
					return "info";
			} 
		},
		"invoiceStatus" : function(type,status){
			if(status=="ACTIVE"){
				if (type=="FIRST") {
					return "info";
				} else {
					return "warning";
				}
			} else {
				return "important";
			} 
		},
		"invoiceTitle" : function(type,status){
			if(status=="ACTIVE"){
				if (type=="FIRST") {
					return "فاتورة مبدئية";
				} else {
					return "فاتورة نهائية";
				}
			} else {
				return "فاتورة ملغاة";
			} 
		},
		"invoiceType" : function(invoice){
			if(invoice=="FIRST"){
				return "مبدئية"
			} else {
				return "نهائية";
			} 
		},
	};

	var helpers = $.each(funcs, function(key, val){
		Handlebars.registerHelper(key, val);
	});

	$.fn.serializeObject = function()
	{
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	var _round = Math.round;
	Math.round = function(number, decimals /* optional, default 0 */)
	{
	  if (arguments.length == 1)
	    return _round(number);

	  var multiplier = Math.pow(10, decimals);
	  return _round(number * multiplier) / multiplier;
	}
});

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}
///////////////////////////////
$.validator.addMethod("customnumeric", function(value, element) {
        return $.isNumeric(value);
    }, "يجب ادخال عدد");
///////////////////////////////



var Alert = (function() {
    "use strict";

    var elem,
        hideHandler,
        that = {};

    that.init = function(options) {
        elem = $(options.selector);
    };

    that.show = function(text) {
        clearTimeout(hideHandler);

        elem.find("span").html(text);
        elem.fadeIn();

        hideHandler = setTimeout(function() {
            that.hide();
        }, 4000);
    };

    that.hide = function() {
        elem.fadeOut();
    };

    return that;
});




