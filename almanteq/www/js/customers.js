$(document).ready(function(){
	$.limit=0;
	$.size=0;
	/*$('body').on("click", ".signup", function(){
		var str = $('form').serializeObject();
		console.log(str);
		
		//console.log(JSON.stringify($("form").serializeObject()));
		//return false;
		$("#signup").submit();
	});*/
	function redraw(customer){
		  var html = $.draw({"customer":customer}, "newCustomer-template");
			$(html).hide().prependTo("#scroll tbody").fadeIn("slow");	
		}

		
	$('body').on("click", ".confirmAddMsg", function(){
		console.log("confirmaddmsg");
		$("#addCustomer").submit();
	});

	$('body').on('submit', 'form', function(data) {
		console.log("form submitted");
		$.post("/addCustomer", $("form").serializeObject(), function(data, textStatus, jqXHR){
			
			$('#myModal').modal('hide');
			console.log(data);
			redraw(data);
		});
		return false;
	});

	function getCustomers(){
		$.get('/action/getCustomers/'+$.limit, function(customers) {
			if(customers instanceof Array){
				$.size= customers.length;
				$.draw({"customers":customers}, "customers-template", "#customers-target");
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
				    	getCustomers();
				    }
				});

				$('#next').on('click', function() {
					if($.size==10){
				    	$.limit+=10;
				    	getCustomers();
				    }
				});
			} else {
				getCustomers();
			}
		});
	}
	function getUser(){
		$.get('/getUser').success(function(user){
			$.draw({"name":user}, "user-template", "#user-target");
		});
	}

	getCustomers();
	getUser();
	
});