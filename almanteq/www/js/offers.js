$(document).ready(function(){
	$.limit=0;
	$.size=0;
	
	
	function redraw(offers){
		var html = $.draw({"offers":offers}, "newOffers-template");
		$(html).hide().prependTo("#scroll tbody").fadeIn("slow");	
	}

	function getValidity(){
		var options = [];
		for (var i = 1; i < 24 ; i++){
			options.push({value : i});
		}
		return options;
	}

	
	$('body').on("click", ".confirmAddMsg", function(){
		console.log("confirmaddmsg");
		$("#addOffer").submit();
	});

	$('body').on('submit', '#addOffer', function(data) {
		console.log($("form").serializeObject());
		$.post("/addOffer", $("form").serializeObject(), function(data, textStatus, jqXHR){
			$('#myModal').modal('hide');
			console.log(data);
			redraw(data);
		});
		return false;
	});

	$('body').on("click", ".confirmDelOffer", function(){
		$("#delOffer").submit();
	});
	
	$('body').on('submit', '#delOffer', function(data) {
		var offerId = $('#offerId').val();
		console.log(offerId);
		$.get('/action/delOffer/'+offerId, function(result) {
			$('#delOfferModal').modal('hide');
			$('#o'+offerId).remove();
			$('.top-right').notify({
				message: { text: 'تمت عملية المسح بنجاح' },
				fadeOut: { enabled: true, delay: 3000 }
			}).show();
		});
		return false;
	});

	function getOffers(){
		$.get('/action/getOffers/'+$.limit).success(function(offers) {
			if(offers instanceof Array){
				$.size= offers.length;
				$.draw({"offers":offers}, "offers-template", "#offers-target");
				$('#oDate').val($.getDate());
				$.draw({"months": getValidity()}, "valid-template", "#valid-target");
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
						getOffers();
					}
				});

				$('#next').on('click', function() {
					console.log("clicked");
					if($.size==10){
						$.limit+=10;
						getOffers();
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

	/*function getLikes(){
		$.get('http://graph.facebook.com/shenomenoshkoon').success(function(offers) {
			console.log(offers);
    	
		});
}*/



getOffers();
getUser();



});