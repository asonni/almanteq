
$(document).ready(function(){
	var templates = {};
	var url = $.url().param(),
		id = url.id,
		offerd={};
	$.tp = {
		url : url,
		id : id,
	};

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
/*	 
			0.000Z"…}
currency: "EUR"
customex: 100
date: "2013-01-29T00:00:00.000Z"
desc: "sd"
idoffer: 90
note: ""
offern: "121251"
ordern: "444454121"
otherex: 100
overall: 6080228
overallben: 0
overallex: 400
packagen: null
paidinf: 3039914
paidinlyd: 6079828
pdate: "2013-07-19T00:00:00.000Z"
producv: "26-01-2013 (Price list: January 2013)"
rate: 2
retail: 10
sapordern: "12111441"
shipex: 100
source: "مصر"
status: 1
taxex: 100
validity: 1
wholesale: 7
            */
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
		"priceInLYD" : function(price){
			return (Math.round(price * offerd.rate,2));
		},
		"itemCost" : function(price){
			return (Math.round((offerd.overallex/offerd.paidinlyd) * (offerd.rate * price),3));
		},
		"priceAfterCost" : function(price){
			return (Math.round((offerd.overallex/offerd.paidinlyd) * (offerd.rate * price)+(offerd.rate * price),3));
		},
		"totalAfterCost" : function(price,quantity){
			return (Math.round(((offerd.overallex/offerd.paidinlyd) * (offerd.rate * price)+(offerd.rate * price))*quantity,2));
		},
		"retailPrice" : function(price){
			price = Math.round((offerd.overallex/offerd.paidinlyd) * (offerd.rate * price)+(offerd.rate * price),3);
			price +=price * (offerd.retail/100);
			return (Math.round(price));
		},
		"retailPerc" : function(){
			return ("%"+offerd.retail);
		},
		"wholesalePrice" : function(price){
			price = Math.round((offerd.overallex/offerd.paidinlyd) * (offerd.rate * price)+(offerd.rate * price),3);
			price +=price * (offerd.wholesale/100);
			return (Math.round(price));
		},
		"wholesalePerc" : function(){
			return ("%"+offerd.wholesale);
		},
		"itemProphet" : function(price){
			var cost = Math.round((offerd.overallex/offerd.paidinlyd) * (offerd.rate * price)+(offerd.rate * price),3);
			var ratailPrice = cost + cost * (offerd.retail/100);
			return (Math.round(ratailPrice-cost,2));
		},
		"totalProphet" : function(price, quantity){
			var cost = Math.round((offerd.overallex/offerd.paidinlyd) * (offerd.rate * price)+(offerd.rate * price),3);
			var ratailPrice = cost + cost * (offerd.retail/100);
			return (Math.round((ratailPrice-cost)*quantity,2));
		},
		"totalItem" : function(price,quantity){
			price = Math.round((offerd.overallex/offerd.paidinlyd) * (offerd.rate * price)+(offerd.rate * price),3);
			price +=price * (offerd.retail/100);
			return (Math.round(price*quantity,2));
		},
		"totalWholesale" : function(price,quantity){
			price = Math.round((offerd.overallex/offerd.paidinlyd) * (offerd.rate * price)+(offerd.rate * price),3);
			price +=price * (offerd.wholesale/100);
			return (Math.round(price*quantity,2));
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
	}
	var helpers = $.each(funcs, function(key, val){
		Handlebars.registerHelper(key, val);
	});


	var _round = Math.round;
	Math.round = function(number, decimals /* optional, default 0 */)
	{
	  if (arguments.length == 1)
	    return _round(number);

	  var multiplier = Math.pow(10, decimals);
	  return _round(number * multiplier) / multiplier;
	}

	function getOffer(){
        if($.tp.id){
         $.get('/action/getOffer/'+$.tp.id, function(offer) {
          console.log(offer[0]);
          if(offer instanceof Array) {
          offerd = offer[0]; 
           $.draw({"offer":offer[0]}, "offer-template", "#offer-target");
         } else {
          /*getOffer();*/
         }
       });
       }
	}

	

	function getSystems(){
      if($.tp.id){
        $.get('/action/getSystems/'+$.tp.id, function(systems) {
          if(systems instanceof Array) {
          	console.log(systems);
            $.draw({"systems":systems}, "systems-template", "#systems-target");
            $("table").tablecloth({
	          theme: "paper",
	          striped: true,
	          sortable: true,
	          condensed: true
			});
          } else {
            /*getSystems();*/
          /*location.reload();*/
          }
        });
      }
    }
	getOffer();
	getSystems();
 });