$(document).ready(function(){
  $.limit=0;
  $.size=0;
  
  function editCustomer() {
  		$.fn.editable.defaults.mode = 'popup';
      	//enable / disable
     		$('#enable').click(function() {
         		$('#user .editable').editable('toggleDisabled');
     		});
     		$('#name').editable({
             	url: '/editCustomer',
             	type: 'text',
             	pk: 1,
             	name: 'name',
             	title: 'الإسم',
             	disabled: true
      	});
        $('#type').editable({
        url: '/editCustomer',
        type: 'select',
        pk: 1,
        name: 'type',
        title: 'نوع الزبون',
        showbuttons: false,
        disabled: true,
        source: [
        {value: "CUSTOMER", text: 'زبون'},
        {value: "COMPANY", text: 'شركة/مؤسسة حكومية'},
        ],
        validate: function(value) {
          if($.trim(value) == '') return 'يجب اختيار العملة';
        }
      });
    		$('#rep').editable({
             	url: '/editCustomer',
             	type: 'text',
             	pk: 1,
             	name: 'rep',
             	title: 'اسم المندوب',
             	disabled: true
      	});
      	$('#email').editable({
             	url: '/editCustomer',
             	type: 'text',
             	pk: 1,
             	name: 'email',
             	title: 'البريد الالكتروني',
             	disabled: true,
      	});
      	$('#phone').editable({
             	url: '/editCustomer',
             	type: 'text',
             	pk: 1,
             	name: 'phone',
             	title: 'رقم الهاتف',
             	disabled: true,
      	});
        $('#creditor').editable({
              url: '/editCustomer',
              type: 'text',
              pk: 1,
              name: 'creditor',
              title: 'دائن بملغ وقدره',
              disabled: true,
        });
        $('#debtor').editable({
              url: '/editCustomer',
              type: 'text',
              pk: 1,
              name: 'debtor',
              title: 'مدين بملغ وقدره',
              disabled: true,
        });
      	$('#note').editable({
             	url: '/editCustomer',
             	type: 'textarea',
             	pk: 1,
             	name: 'note',
             	title: 'ملاخظات',
             	disabled: true
      	});
  	}

  $('body').on("click", ".confirmAddSpec", function(){
    console.log("confirmAddSpec");
    $("#addSpec").submit();
  });
  
  $('body').on('submit', '#addSpec', function(data) {
    obj = $("#addSpec").serializeObject();
    obj["Customer_iditem"]= $.tp.id;
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

  /*$('body').on("click", ".confirmDelSpec", function(){
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
*/
  function getCustomer(){
    console.log($.tp.id);
    if($.tp.id){
      $.get('/action/getCustomer/'+$.tp.id, function(customer) {
        console.log(customer[0]);
        if(customer instanceof Array) { 
          $.draw({"customer":customer[0]}, "customer-template", "#customer-target");
          editCustomer();
          
        } else {
          getCustomer();
        }
      });
    }
  }

  /*function getSpecs(){
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
  }*/
  function getUser(){
    $.get('/getUser').success(function(user){
      console.log("ok"+user);
      $.draw({"name":user}, "user-template", "#user-target");
    });
  }
  function getSales(){
    var obj = {
      id : $.tp.id,
      limit : $.limit,
    };
    obj = JSON.stringify(obj);
    $.get('/action/getCustomerSales/'+obj).success(function(sales) {
        if(sales instanceof Array){
          console.log(sales);
          
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
  
  getCustomer();
/*  getSpecs();
*/  getUser();
    getSales();
  //defaults

  });