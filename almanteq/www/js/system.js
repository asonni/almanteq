$(document).ready(function(){

	function redraw(specs){
	  	var html = $.draw({"specs":specs}, "newSpec-template");
		  $(html).hide().prependTo("#specs tbody").fadeIn("slow");
      $.draw({"specs":specs}, "editSpecs2-template", "#editSpecs2-target");
	}

	function editSystem() {
		$.fn.editable.defaults.mode = 'popup';
    	//enable / disable
   		$('#enable').click(function() {
       		$('#user .editable').editable('toggleDisabled');
   		});
   		$('#system').editable({
           	url: '/editSystem',
           	type: 'text',
           	pk: 1,
           	name: 'system',
           	title: 'اسم البند',
           	disabled: true
    	});
      $('#brand').editable({
            url: '/editSystem',
            type: 'text',
            pk: 1,
            name: 'brand',
            title: 'الماركة',
            disabled: true
      });
      $('#class').editable({
            url: '/editSystem',
            type: 'text',
            pk: 1,
            name: 'class',
            title: 'الصنف او الاسم الحركي',
            disabled: true
      });
      $('#productnum').editable({
            url: '/editSystem',
            type: 'text',
            pk: 1,
            name: 'productnum',
            title: 'Enter product#',
            disabled: true
      });
  		$('#barcode').editable({
           	url: '/editSystem',
           	type: 'text',
           	pk: 1,
           	name: 'barcode',
           	title: 'Enter Barcode',
           	disabled: true
    	});
    	$('#itemprice').editable({
           	url: '/editSystem',
           	type: 'text',
           	pk: 1,
           	name: 'itemprice',
           	title: 'سعر البند',
           	disabled: true,
           	success: function (response,newValue){
           		var total = newValue * $('#quantity').text();
           		var obj = {
           			pk : $.tp.id,
           			name : 'totalprice',
           			value : total,
           		}
           		$.post("/editSystem", obj, function(data, textStatus, jqXHR){
  					    $('#totalquantity').val(total);
				      });
           	} 
    	});
    	$('#quantity').editable({
           	url: '/editSystem',
           	type: 'text',
           	pk: 1,
           	name: 'quantity',
           	title: 'الكمية',
           	disabled: true,
           	success: function (response,newValue){
           		var total = newValue * $('#itemprice').text();
           		var obj = {
           			pk : $.tp.id,
           			name : 'totalprice',
           			value : total,
           		}
             	$.post("/editSystem", obj, function(data, textStatus, jqXHR){
  					    $('#totalquantity').val(total);
                obj = {
                  pk : $.tp.id,
                  name : 'left',
                  value : newValue
                }
                $.post("/editSystem", obj, function(data, textStatus, jqXHR){
                  
                });
  				    });
           	}
    	});
    	$('#note').editable({
           	url: '/editSystem',
           	type: 'textarea',
           	pk: 1,
           	name: 'note',
           	title: 'الشرح',
           	disabled: true
    	});
	}
  
	$('body').on("click", ".confirmAddSpec", function(){
		console.log("confirmAddSpec");
		$("#addSpec").submit();
	});
	
	$('body').on('submit', '#addSpec', function(data) {
		obj = $("#addSpec").serializeObject();
		obj["system_iditem"]= $.tp.id;
    obj["offer_idoffer"]= $.tp.uid;
		$.post("/addSpec", obj, function(data, textStatus, jqXHR){
			$('#myModal').modal('hide');
			redraw(data);
       $('.top-right').notify({
          message: { text: 'تمت الإضافة بنجاح' },
          fadeOut: { enabled: true, delay: 3000 }
        }).show();
		});
		return false;
	});

  $('body').on("click", ".confirmDelSpec", function(){
    console.log("confirmDelSpec");
    $("#delSpec").submit();
  });
  
  $('body').on('submit', '#delSpec', function(data) {
    var specId = $('#specId').val();
    $.get('/action/delSpec/'+specId, function(result) {
      $('#delSpecModal').modal('hide');
      $('#s'+specId).remove();
       $('.top-right').notify({
          message: { text: 'تمت عملية المسح بنجاح' },
          fadeOut: { enabled: true, delay: 3000 }
        }).show();
    });
    return false;
  });

	function getSystem(){
		if($.tp.id){
			$.get('/action/getSystem/'+$.tp.id, function(system) {
				console.log(system[0]);
				if(system instanceof Array) { 
					$.draw({"system":system[0]}, "system-template", "#system-target");
					editSystem();
          $('#systemLink').text(system[0].system);
          $.get('/action/getOfferN/'+$.tp.uid,function(name){
            $('#offerLink').attr("href", "offer.html?id="+$.tp.uid);
            $('#offerLink').text(name.offern);
          });
					
				} else {
					getSystem();
				}
			});
		}
	}

	function getSpecs(){
		if($.tp.id){
			$.get('/action/getSpecs/'+$.tp.id, function(specs) {
				if(specs instanceof Array) {
					$.draw({"specs":specs}, "specs-template", "#specs-target");
					$.draw({"specs":specs}, "editSpecs-template", "#editSpecs-target");
					$('#enableSpecs').click(function() {
       		$('#specs .editable').editable('toggleDisabled');
   					});
				} else {
					getSpecs();
				}
			});
		}
	}
  function getUser(){
    $.get('/getUser').success(function(user){
      console.log("ok"+user);
      $.draw({"name":user}, "user-template", "#user-target");
    });
  }
	
	getSystem();
	getSpecs();
  getUser();
	//defaults


});