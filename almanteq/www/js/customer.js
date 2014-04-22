$(document).ready(function(){
  $.limit=0;
  $.size=0;
  $.olimit=0;
  $.osize=0;
  $.rlimit=0;
  $.rsize=0;



  $('body').on("click", ".confirmAddReciept", function(){
    console.log("reciept");
    $("#reciept").submit();
  });
  
  $('body').on('submit', '#reciept', function(data) {
    obj = $("#reciept").serializeObject();
    obj["customer_idcustomer"]= $.tp.id;
    $.post("/addReceipt", obj, function(data){
      $('#recieptModal').modal('hide');
      getCustomer();
    
    });
    return false;
  });
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
    $('#roof').editable({
      url: '/editCustomer',
      type: 'text',
      pk: 1,
      name: 'roof',
      title: 'سقف المبيعات',
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
     	title: 'ملاحظات',
     	disabled: true
  	});
  }
  function getCustomer(){
    if($.tp.id){
      $.get('/action/getCustomer/'+$.tp.id, function(customer) {
        var balance = customer[1][0].left - (customer[2][0].totalprice-customer[2][0].paid) - customer[3][0].pay + customer[4][0].recieve;
        if(customer instanceof Array) { 
          $.draw({"customer":customer[0][0],"balance": balance}, "customer-template", "#customer-target");
          editCustomer();
         
        } else {
          getCustomer();
        }
      });
    }
  }
  function getCustOffers(){
    if($.tp.id){
      var obj = {
        id : $.tp.id,
        limit : $.olimit,
      };
      obj = JSON.stringify(obj);
      $.get('/action/getCustOffers/'+obj, function(offers) {
        $.osize= offers.length;
        $.draw({"offers":offers}, "offers-template", "#offers-target");
        if($.osize < 10) {
            $('#onextli').addClass('disabled');
          } else {
            $('#onextli').removeClass('disabled');
          }
          if($.olimit ==0){
              $('#oprevli').addClass('disabled');
          } else {
            $('#oprevli').removeClass('disabled');
          }
          $('#oprev').on('click', function() {
              if($.olimit >= 10) {
                $.olimit-=10;
                getCustOffers();
              }
          });

          $('#onext').on('click', function() {
            if($.osize==10){
                $.olimit+=10;
                getCustOffers();
              }
          });
      });
    }
  }
  function getUser(){
    $.get('/getUser').success(function(user){
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
      }
    });
  }
  function getReceipts(){
    var obj = {
        id : $.tp.id,
        limit : $.rlimit,
      };
      obj = JSON.stringify(obj);
    $.get('/action/getReceipts/'+obj).success(function(receipts){
      $.rsize= receipts.length;
      $.draw({"receipts":receipts}, "receipts-template", "#receipts-target");
      if($.rsize < 10) {
            $('#rnextli').addClass('disabled');
          } else {
            $('#rnextli').removeClass('disabled');
          }
          if($.rlimit ==0){
              $('#rprevli').addClass('disabled');
          } else {
            $('#rprevli').removeClass('disabled');
          }
          $('#rprev').on('click', function() {
            if($.rlimit >= 10) {
              $.rlimit-=10;
              getReceipts();
            }
          });

          $('#rnext').on('click', function() {
            if($.rsize==10){
              $.rlimit+=10;
              getReceipts();
            }
          });
    });
  }
 
  getCustomer();
  getUser();
  getSales();
  getCustOffers();
  getReceipts();

});