$(document).ready(function(){
  $.objects={};
  $.subObjects={};
  $.objThemes={};
  $.subObjThemes={};
  $.total=0;
  $.subtotal=0;
  $.customer={};
  $.discount=0;
  $.customers = new Array();
  var all = {},
  count = 1;

  $('#left').tooltip();

  $.themes = {
    1 : {
      text : "",
      val : 1
    }
  };
  $.objThemes = {
    1 : {
      text : "",
      val : 1
    }
  };
  getCust();
  function getCust() {
    $.get('/action/getCustomersNames', function (data) {
      for ( var  i = 0 ; i< data.length; i++){
        var k = new Object({id:i,value : data[i].value ,
          text : data[i].text,creditor:data[i].creditor,
          debtor: data[i].debtor});
        $.customers.push(k);
        $.customer[data[i].value] = {
          creditor : data[i].creditor,
          debtor : data[i].debtor
        };
      }
      var custs = $('#customers');
      $(custs).select2({
        data : $.customers,
        width : "170px"
      });
      $(custs).select2('val','0');
      $.get('/action/getCustomer/'+ $.customers[0].value, function(customer) {
        var balance = customer[1][0].left - (customer[2][0].totalprice-customer[2][0].paid) - customer[3][0].pay + customer[4][0].recieve;
        $('#balance').val(balance);
      });
    });
  }
  
  var $tabs = $('.tabbable li');

  $('#prevtab').on('click', function() {
    $tabs.filter('.active').prev('li').find('a[data-toggle="tab"]').tab('show');
    preview();
  });

  $('#nexttab').on('click', function() {
    $tabs.filter('.active').next('li').find('a[data-toggle="tab"]').tab('show');
    preview();
  });
  $('#prevLink').click(function(){
    preview();
  });

  $('#make').click(function(){
    console.log($.objects);
  });

  $('#theme1').editable({
    type: 'text',
    pk: 'chosenSys1',
    name: 'theme1',
    title: 'اختر موضوع',
    success: function (response,newValue){
      $.themes["1"].text = newValue;
      $.objThemes["1"].text = newValue;
    }
  });

  $('#invoicetype').on('change', function() {
    if($("#invoicetype").val()==="FINAL"){
      $('#ifFinal').show();
      $('#regs').hide();
      $('#paymentinfo').show();
      $('#balanceinfo').show();
    } else {
      $('#ifFinal').hide();
      $('#regs').show();
      $('#paymentinfo').hide();
      $('#balanceinfo').hide();
    }
  });

  $('#customers').on('change', function() {
    console.log($("#customers").select2('data').id);
    $('#debtor').val($("#customers").select2('data').debtor);
    $('#creditor').val($("#customers").select2('data').creditor);
  });

  function calcTotal(){
    $.total=0,
    $.discount=0;
    $.subtotal=0;
    for (key in $.objects){
      $.discount+= 0.5 * Math.ceil(2.0*$.objects[key].discount);
      $.subtotal+=0.5 * Math.ceil(2.0*($.objects[key].price * $.objects[key].quantity));
      $.total+=0.5 * Math.ceil(2.0*($.objects[key].price * $.objects[key].quantity - $.objects[key].discount));
    }
  }

  function calcTax(flag) {
    calcTotal();
    var tax=$.total * 0.01;
    tax = 0.5 * Math.ceil(2.0*tax);
    tax = tax + 0.005 * tax;
    tax = 0.5 * Math.ceil(2.0*tax);
    $('#total1').val(0.5 * Math.ceil(2.0* $.subtotal));
    $('#totaldisc').val($.discount);
    if (flag || $("#ifTax").is(":checked") ) {
      $('#tax').val(tax);
      $('#overall').val(0.5 * Math.ceil(2.0* (tax+$.total)));
      $('#paid').val(0.5 * Math.ceil(2.0* (tax+$.total)));
      $('#fullypaid').text(0.5 * Math.ceil(2.0* (tax+$.total)));
    } else {
      $('#tax').val(0);
      $('#overall').val(0.5 * Math.ceil(2.0* ($.total)));
      $('#paid').val(0.5 * Math.ceil(2.0* ($.total)));
      $('#fullypaid').text(0.5 * Math.ceil(2.0* ($.total)));
    }
    $('#unpaid').val(0);
    $('#fullyunpaid').text(0);
  }

  $('#paid').on('input', function() {
    var dif = 0,
    x = 0,
    paid= parseFloat($('#paid').val()),
    overall = parseFloat($('#overall').val());
    $('#fullypaid').text(paid);
    if (paid < overall){
      dif = overall - paid;
      $('#unpaid').val(dif);
      $('#fullyunpaid').text(dif);

      
      /*$('#creditor').val()*/
    } else {
      $('#unpaid').val(0);
      $('#fullyunpaid').text(0);
    }
  });

  $("#ifTax").change(function() {
    if($(this).is(":checked")) {
      calcTax(true);
    } else {
      calcTax(false);
    }
  });

  function makeInvoice(){
    var invoiceObj = {
      type:$("#invoicetype").val(),
      note:$("#inote").val(),
      expire:$('#expire').val(),
      date:$('#oDate').val(),
      usrate:$('#usd').val(),
      eurate:$('#eur').val(),
      delivery:$('#delivery').val(),
      customer_idcustomer:$("#customers").select2('data').value,
      subtotal:$('#total1').val(),
      totaldiscount : $('#totaldisc').val(),
      tax:$('#tax').val(),
      totalprice:$('#overall').val(),
      paid:$('#paid').val(),
    },

    obj = {
      main:invoiceObj,
      slctdTh:$.objThemes,
      sbslctdTh:$.subObjThemes,
      slctdObjs:$.objects,
      sbslctdObjs:$.subObjects
    };
    $.post("/makeInvoice", obj, function(success, textStatus, jqXHR){
      if(success){
        window.location.replace('/sales');
      }
    });
    
  }

  function preview(){
    $('#invType').text($('#invoicetype option:selected').html());
    $('#toCustomer').text($("#customers").select2('data').text);
    $('#invoiceDate').text($('#oDate').val());
    var templ = '',
    regs = '';
    for(var themeKey in $.objThemes)
    {
      if($.objThemes[themeKey].text !=""){
        templ +='<tr class="warning">'+
        '<td colspan="7"> <b> '+$.objThemes[themeKey].text+' </b></td>'+
        '</tr>';
      }
      for (var objKey in $.objects) {
        var rowspan = $.objects[objKey].specs.length+2;
        if (objKey.toString().startsWith(themeKey.toString())){
          templ +='<tr>'+
          '<td>'+$.objects[objKey].productnum+'</td>'+
          '<td><p class="text-error pull-left">'+$.objects[objKey].brand+
          '</p><br>'+$.objects[objKey].system+'</td>'+
          '<td><p class="text-error">'+$.objects[objKey].quantity+'</p></td>'+
          '<td rowspan='+rowspan+'>'+$.objects[objKey].warranty+'</td>'+
          '<td rowspan='+rowspan+'>'+$.objects[objKey].price+'</td>'+
          '<td rowspan='+rowspan+'>'+$.objects[objKey].discount+'</td>'+
          '<td rowspan='+rowspan+'>'+$.objects[objKey].totalprice+'</td>'+ 
          '</tr>'+
          '<tr>'+
          '<td></td>'+
          '<td>'+$.objects[objKey].desc+'</td>'+
          '<td></td>'+
          '</tr>';
          for(var i = 0 ; i < $.objects[objKey].specs.length; i++ ) {
            templ +='<tr>'+
            '<td>'+$.objects[objKey].specs[i].productn+'</td>'+
            '<td>'+$.objects[objKey].specs[i].name+'</td>'+
            '<td>'+$.objects[objKey].specs[i].squantity+'</td>'+
            '</tr>';
          }
        }
      }
    }

    if (! $.isEmptyObject($.subObjThemes)){
      console.log($.subObjThemes);
      var alt= '';
      alt+="<legend>Alternative Solutions :</legend>"+
      '<table class="table table-condensed table-bordered">'+
      '<thead>'+
      '<th>Product-Number</th>'+
      '<th>Description</th>'+
      '<th>QTY</th>'+
      '<th>WTY</th>'+
      '<th>Unit Price</th>'+
      '<th>Discount</th>'+
      '<th>Total</th>'+
      '</thead>'+
      '<tbody>';
      for(var themeKey in $.subObjThemes){       
        alt +='<tr class="warning">'+
        '<td colspan="7"> <b> '+$.subObjThemes[themeKey].text+' </b></td>'+
        '</tr>';
        for (var objKey in $.subObjects) {
          var rowspan = $.subObjects[objKey].specs.length+2;
          if (objKey.toString().startsWith(themeKey.toString())){
            alt +='<tr><td colspan="6"></td></tr>'+
            '<tr>'+
            '<td>'+$.subObjects[objKey].productnum+'</td>'+
            '<td><p class="text-error pull-left">'+$.subObjects[objKey].brand+
            '</p><br>'+$.subObjects[objKey].system+'</td>'+
            '<td><p class="text-error">'+$.subObjects[objKey].quantity+'</p></td>'+
            '<td rowspan='+rowspan+'>'+$.subObjects[objKey].warranty+'</td>'+
            '<td rowspan='+rowspan+'>'+$.subObjects[objKey].price+'</td>'+
            '<td rowspan='+rowspan+'>'+$.subObjects[objKey].discount+'</td>'+
            '<td rowspan='+rowspan+'>'+$.subObjects[objKey].totalprice+'</td>'+ 
            '</tr>'+
            '<tr>'+
            '<td></td>'+
            '<td>'+$.subObjects[objKey].desc+'</td>'+
            '<td></td>'+
            '</tr>';
            for(var i = 0 ; i < $.subObjects[objKey].specs.length; i++ ) {
              alt +='<tr>'+
              '<td>'+$.subObjects[objKey].specs[i].productn+'</td>'+
              '<td>'+$.subObjects[objKey].specs[i].name+'</td>'+
              '<td>'+$.subObjects[objKey].specs[i].squantity+'</td>'+
              '</tr>';
            }
          }
        }
      }

      alt+='</tbody>'+
      '</table>';
      $('#alt').html(alt);
    } else {
      $('#alt').html(null);
    }

    regs += '<legend>ملاحظات :</legend>'+
    '<ul>'+
    '<li>هذا العرض بالدينار الليبي ساري لمدة '+$('#expire').val()+' يوم من تاريخه.</li>'+
    '<li>فترة التسليم: '+$('#delivery').val()+' أيام فقط من إستلام أمر التكليف.</li>'+
    '<li>يتم التكليف بالإشارة إلى إجمالي الفاتورة بعد حساب مصروفات الضرائب  إلا في حالة'+
    ' إعفاء الجهة من الضرائب فيتم الإشارة المجموع الفرعي مع ضرورة إرفاق قرار الإعفاء الضريبي مع التكليف</li>'+
    '<li>طريقة الدفع: 100% بعد الإستلام والفحص وقبل التركيب والتشغيل مع إمكانية خصم قيمة التركيب والتشغيل إلى ما بعد التركيب والتشغيل.</li>'+
    '<li>شركة المنطق هي الشريك التجاري والخدمي لشركة Fujitsu وتملك مركز صيانة متخصص ومعتمد من الشركة المصنعة.</li>'+
    '<li>في حالة الدفع بعملة أخرى الرجاء مراعاة سعر العملة حسب التالي وفقاً لسعر مصرف الجمهورية لتاريخ '+$('#oDate').val()+'.</li>'+
    '</ul>'+
    '<div dir =ltr>'+
    '1 USD ='+$('#usd').val()+' LYD<br>'+
    '1 EUR ='+$('#eur').val()+' LYD'+
    '</div>';

    $('#subtPr').text($('#total1').val());
    $('#discountPr').text($('#totaldisc').val());
    $('#taxPr').text($('#tax').val());
    $('#totalPr').text($('#overall').val());
    $('#preview').html(templ);
    $('#regs').html(regs);

    console.log($.objects);
    console.log($.subObjects);
  }

  $('body').on("click", ".newTheme", function(){
    count+=1;
    $.themes[count] = { text : "موضوع"+count,
    val : count};
    $.objThemes[count] = { text : "موضوع"+count,
    val : count}; 

    var newTheme = '<tr id="t'+count+'">'+
    '<td>'+
    ' <table id = "chosenSys'+count+'" class="table table-striped table-condensed table-bordered" >'+
    '  <legend><a href="#" id="theme'+count+'" data-type="text" data-pk="chosenSys'+count+'" data-value="'+count+'موضوع" data-url="" data-title="موضوع'+count+'"></a><a class="btn btn-danger btn-mini removeTheme pull-right" href="#removeThemeModal" onClick=\'removeTheme("'+count+'");return false;\' data-toggle="modal" ><i class="icon-remove"></i></a>'+
    '&nbsp&nbsp<input type="checkbox" checked value ="'+count+'" class="pull-left" id ="c'+count+'"></legend>'+
    ' <thead>'+
    '  <tr>'+
    '   <th>System</th>'+
    '  <th>الكمية</th>'+
    ' <th>السعر</th>'+
    '<th>الكلي</th>'+
    '<th>إزالة</th>'+
    '</tr>'+
    '</thead>'+
    '<tbody id="sys'+count+'">'+
    '</tbody>'+
    '</table>'+
    '</td>'+
    '</tr>'+
    '<script type"text/javascript">'+
    '$("#theme'+count+'").editable({'+
      'type: "text",'+
      'pk: "chosenSys'+count+'",'+
      'name: "theme'+count+'",'+
      'title: "اختر موضوع",'+
      'success: function (response,newValue){'+
        '$.themes["'+count+'"].text = newValue;'+
        'if($.objThemes["'+count+'"]!= undefined) {'+
          '$.objThemes["'+count+'"].text = newValue;'+
        '} else {'+
          '$.subObjThemes["'+count+'"].text = newValue;'+
        '}'+
      '}'+
    '});'+
    '$("#c'+count+'").change(function() {'+
      'if($(this).is(":checked")) {'+
        'for (var key in $.subObjects) {'+
          'if(key.toString().startsWith("'+count+'")){'+
            '$.objects[key]=$.subObjects[key];'+
            '$.total+=parseFloat($.subObjects[key].totalprice);'+
            '$.total = Math.round($.total,3);'+
            'delete $.subObjects[key];'+
          '}'+
        '}'+
        'calcTax();'+
        '$.objThemes["'+count+'"] = $.subObjThemes["'+count+'"].valueOf();'+
        'delete $.subObjThemes["'+count+'"];'+
        'console.log($.subObjThemes);'+
      '} else {'+
        'for (var key in $.objects) {'+
          'if(key.toString().startsWith("'+count+'")){'+
            '$.subObjects[key]=$.objects[key];'+
            '$.total-=parseFloat($.objects[key].totalprice);'+
            '$.total = Math.round($.total,3);'+
            'delete $.objects[key];'+
          '}'+
        '}'+
        'calcTax();'+
        '$.subObjThemes["'+count+'"] = $.objThemes["'+count+'"].valueOf();'+
        'delete $.objThemes["'+count+'"];'+
      '}'+
      '$("#total1").val($.total);'+
    '});'+
    '</script>';
    
    $(newTheme).hide().appendTo("#allSys").fadeIn("slow");

  });

$('body').on("click", ".invoice", function(){
  $('#theme')
  .find('option')
  .remove()
  .end();

  for(var key in $.themes)
  {
    var o = new Option($.themes[key].text, $.themes[key].val);
    $(o).html($.themes[key].text);
    $("#theme").append(o); 
  } 


  var sysId = $("#sysId").val();
  $.get('/action/getItemPrice/'+sysId, function (data) {
    if(data.selltype=="MANUAL"){
      $("#price").val(data.sellprice);
      $("#total").val(data.sellprice);
      $("#retailPrice").val(data.sellprice);
      $("#afterCostPrice").val(data.sellprice);
      $("#wholeSalePrice").val(data.sellprice);
    } else {
      $("#price").val(data.retail);
      $("#total").val(data.retail);
      $("#retailPrice").val(data.retail);
      $("#afterCostPrice").val(data.aftercost);
      $("#wholeSalePrice").val(data.wholesale);
    }
    if(data.instock) {
      $("#left").text(data.left); 
    } else {
      $("#left").text("غير متوفر بالمخزن");
    }

    if($("#invoicetype").val()==="FINAL"){
      if(!data.instock){
        $('#addSysButton').attr("disabled", true);
      }
    } else {
      $('#addSysButton').attr("disabled", false);
    }
  });
});
$('input:radio').change(function(){
  var disc = validateInput('#discount');
  if  ($("#retail").is(':checked')) {
    $("#price").val($("#retailPrice").val());
    $("#total").val(Math.round($("#retailPrice").val()*$("#quantity").val()-disc,3));
  } else if ($("#wholesale").is(':checked')) {
    $("#price").val($("#wholeSalePrice").val());
    $("#total").val(Math.round($("#wholeSalePrice").val()*$("#quantity").val()-disc,3));
  } else {
    $("#price").val($("#afterCostPrice").val());
    $("#total").val(Math.round($("#afterCostPrice").val()*$("#quantity").val()-disc,3));
  }
});



$('body').on("click", ".confirmAddInvoice", function(){
  function setObj(key,item) {
    obj[key] = item;
  }
  var html = "",
  obj = {},
  price = parseFloat($("#price").val()),
  discount = parseFloat($("#discount").val()),
  system = $("#system").val(),
  quantity = parseInt($("#quantity").val()),
  warranty = $("#warranty").val(),
  totalPrice = Math.round($("#total").val(),3),
  theme = $("#theme").val(),
  sysId = $("#sysId").val();

  if($.objects[theme+sysId] != undefined || $.subObjects[theme+sysId] != undefined) {
    $("#invoiceModal").modal('hide');
    $("#p"+theme+sysId).text(price);
    var newQuantity = quantity+parseInt($("#q"+theme+sysId).text()),
      newTotal = 0.5 * Math.ceil(2.0* (price*newQuantity-discount));
    $("#q"+theme+sysId).text(newQuantity);
    $("#d"+theme+sysId).text(discount);
    $("#t"+theme+sysId).text(newTotal);
    console.log($('#c'+theme).is(":checked")+"ok");
    if($('#c'+theme).is(":checked")||theme ==1){
      $.objects[theme+sysId].price = price;
      $.objects[theme+sysId].discount = discount;
      $.objects[theme+sysId].quantity = newQuantity;
      $.objects[theme+sysId].totalprice =  newTotal;

    } else {

      $.subObjects[theme+sysId].price = price;
      $.subObjects[theme+sysId].discount = discount;
      $.subObjects[theme+sysId].quantity = newQuantity;
      $.subObjects[theme+sysId].totalprice =  newTotal;
    }
    //$('#total1').val($.total);

  } else {


    html = '<tr id="i'+theme+sysId+'" >'+
    '<td>'+system+'</td>'+
    '<td id="q'+theme+sysId+'">'+quantity+'</td>'+
    '<td id="p'+theme+sysId+'">'+price+'</td>'+
    '<td id="d'+theme+sysId+'">'+discount+'</td>'+
    '<td id="t'+theme+sysId+'">'+totalPrice+'</td>'+
    '<td><a class="icon-remove remove" href="#removeModal" onClick=\'removeMe("'+system+'","'+theme+sysId+'");return false;\' data-toggle="modal" ></a></td>'+
    '</tr>';
    $("#invoiceModal").modal('hide');
    $(html).hide().prependTo("#sys"+theme).fadeIn("slow");
    obj= {
      system : system,
      system_iditem : sysId,
      price : price,
      discount : discount,
      quantity : quantity,
      warranty : warranty,
      totalprice : Math.round(totalPrice,3),
      theme : theme
    }

    if($('#c'+theme).is(":checked")||theme ==1){
      $.objects[theme+sysId] = obj;
      all[theme]=$.objects;
    } else {

      $.subObjects[theme+sysId] = obj;
    }

    $('#invoicetype').attr("disabled", true);
    $.draw({"systems":null}, "systems-template", "#systems-target");
    $.get('/action/getSystem/'+sysId, function (sysObj) {
      $.get('/action/getSpecs/'+sysId, function (specs) {
        setObj("specs",specs);
        setObj("desc",sysObj[0].note);
        setObj("productnum",sysObj[0].productnum);
        setObj("brand", sysObj[0].brand);
      });
    });
  }
  calcTax();
});

$('body').on("click", ".confirmRemoveSys", function(){
  var itemId = $('#itemId').val();
  console.log(itemId);
  $('#removeModal').modal('hide');
  $('#i'+itemId).remove();
  $.total-=parseFloat($.objects[itemId].totalprice);
  $.total = Math.round($.total,3);
  delete $.objects[itemId];
  if (jQuery.isEmptyObject($.objects)) {
    $('#invoicetype').attr("disabled", false);
  }
  //$('#total1').val($.total);
  calcTax();
});

$('body').on("click", ".confirmRemoveTheme", function(){
  var themeId = $('#themeId').val();
  for(var key in $.objects){
    if (key.toString().startsWith(themeId.toString())){
      $.total-=parseFloat($.objects[key].totalprice);

      delete $.objects[key];
      $('#i'+key).remove(); 
    }
  }
  $.total = Math.round($.total,3);
  //$('#total1').val($.total);
  $('#removeThemeModal').modal('hide');
  $('#t'+themeId).remove();
  delete $.themes[themeId];
  delete $.subObjThemes[themeId];
  delete $.objThemes[themeId];
  calcTax();
});

function validateInput(name){
  var val = parseFloat($(name).val());
  if(!val){
    val = 0;
  }
  return val
} 

$('#discount').on('input',function(){
  var disc = validateInput('#discount');
  $("#total").val(Math.round(($("#price").val()*$("#quantity").val()- disc),3));
});

$('#price').on('input',function(){
  var disc = validateInput('#discount');
  $("#total").val(Math.round(($("#price").val()*$("#quantity").val()-disc),3));
});
$('#quantity').on('input',function(){
  var disc = validateInput('#discount');
  $("#total").val(Math.round(($("#price").val()*$("#quantity").val()-disc),3));
});

$('#cust').on('input', function() {
  var query = $("#cust").val();
  console.log(query);
  if(query.length > 0) {
    $.get('/action/queryCustomers/'+query, function (data) {
      $.draw({"customers":data}, "customers-template", "#customers-target");
    });
  }
})

$('#sys').on('input', function() {
  var query = $("#sys").val();
  if(query.length >0) {
    $.get('/action/querySystems/'+query, function (data) {
      $.draw({"systems":data}, "systems-template", "#systems-target");
    });
  } else {
    $.draw({"systems":null}, "systems-template", "#systems-target");
  }
})

$('body').on("click", ".confirmAddCust", function(){
  console.log("confirmaddmsg");
  $("#addCustomer").submit();
});

$('body').on('submit', '#addCustomer', function(data) {
  $.post("/addCustomer", $("#addCustomer").serializeObject(), function(data, textStatus, jqXHR){
    $('#newCustModal').modal('hide');
    
    var o = new Object({id:$.customers.length,value : data.idcustomer ,text : data.name,creditor:data.creditor, debtor: data.debtor});
    var index = $.customers.push(o)-1;
    var custs = $('#customers');
    $(custs).select2({
      data : $.customers,
      width : "170px"
    });
    $(custs).select2('val',$.customers.length-1);
    console.log($.customers);
  });
  return false;
});

$('body').on("click", ".confirmMake", function(){
  console.log("confirmMake");
  makeInvoice();
  return false;
});

function getUser(){
  $.get('/getUser').success(function(user){
    $.draw({"name":user}, "user-template", "#user-target");
  });
}

function getUserType(){
  $.get('/getUserType').success(function(type){
    if(!type) {
      $("#afterCostDiv").hide();
    }
  });
}

getUser();
getUserType();

$('#oDate').val($.getDate());

});