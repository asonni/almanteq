$(document).ready(function(){
	$.limit=0;
	$.size=0;

	$('#cust').on('input', function() {
		var query = $("#cust").val();
		console.log(query);
		$.get('/action/queryCustomers/'+query, function (data) {
			$.draw({"customers":data}, "customers-template", "#customers-target");
		});
   	});

   	$('#sys').on('input', function() {
		var query = $("#sys").val();

		console.log(query);
		if(query.length >0) {
			$.get('/action/querySystems/'+query, function (data) {
				$.draw({"systems":data}, "systems-template", "#systems-target");
			});
		}
   	});
   	$('#sea').on('input', function() {
   		query= $('#sea').val();
   		if(query !=""){
	   		$.get('/action/queryInvoices/'+query).success(function(sales) {
	   			$.draw({"sales":sales}, "sales-template", "#sales-target");

	   		});
	   	} else {
	   		getSales();
	   	}
   	});

	/*$('.typeahead').typeahead({
	    source: function (query, process) {
	    	console.log(query);
	        return $.get('/action/queryCustomers/'+query, function (data) {
	        	console.log(data);
	            return process(data);
	        });
	    }
	});*/
	
	function redraw(sales){
		  var html = $.draw({"sales":sales}, "newSales-template");
			$(html).hide().prependTo("#scroll tbody").fadeIn("slow");	
		}

	function getSales(){
		$.get('/action/getSales/'+$.limit).success(function(sales) {
	    	if(sales instanceof Array){
					
					$.size= sales.length;
					$.draw({"sales":sales}, "sales-template", "#sales-target");
					if($.size < 10) {
						$('#nextli').addClass('disabled');
					} else {
						$('#nextli').removeClass('disabled');
					}
					if($.limit ==0){
					    $('#prevli').addClass('disabled');
					} else {
						$('#prevli').removeClass('disabled');
					}
					$('#prev').on('click', function() {
					    if($.limit >= 10) {
					    	$.limit-=10;
					    	getSales();
					    }
					});

					$('#next').on('click', function() {
						if($.size==10){
					    	$.limit+=10;
					    	getSales();
					    }
					});
			} else {
				/*getOffers();*/
			}
		});
	}

	function getUser(){
		$.get('/getUser').success(function(user){
			$.draw({"name":user}, "user-template", "#user-target");
		});
	}
/*
	$('body').on("click", ".confirmCancelInvoice", function(){
		console.log("canel");
		$("#cancelInvoice").submit();
	});*/
	
	$('body').on('click', '.confirmCancelInvoice', function(data) {
		console.log("submit");
		var invoiceId = $('#invoiceId').val();
		$.get('/action/cancelInvoice/'+invoiceId, function(result) {
			$('#cancelInvoiceModal').modal('hide');
			getSales();
			$('.top-right').notify({
				message: { text: 'تمت عملية الإلغاء بنجاح' },
				fadeOut: { enabled: true, delay: 3000 }
			}).show();
		});
		return false;
	});

	/*function getLikes(){
		$.get('http://graph.facebook.com/shenomenoshkoon').success(function(offers) {
			console.log(offers);
    	
		});
	}*/

	getSales();
	getUser();
	
	
});