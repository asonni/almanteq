$(document).ready(function(){
  $.invoice={};
  $.objects={};
  $.subObjects={};
  $.objThemes={};
  $.subObjThemes={};
  $.flag=true;
  function preview(themes,objects){
   
    var templ = '',
      alt='<legend>Alternative Solutions :</legend>'+
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
      '<tbody>',
      regs = '',
      flag=false;

    for(var themeKey in themes){
      if(themes[themeKey].selected){
        if(themes[themeKey].name!=""){
          templ +='<tr class="warning">'+
          '<td colspan="7"> <b> '+themes[themeKey].name+' </b></td>'+
          '</tr>';
        }
        for (var objKey in objects){
          var specs = getSpecs(objects[objKey].system_iditem);
          var rowspan = specs.length+2;
          if(themes[themeKey].idtheme==objects[objKey].theme_idtheme){
            templ +='<tr>'+
              '<td>'+objects[objKey].productnum+'</td>'+
              '<td><p class="text-error pull-left">'+objects[objKey].brand+
              '</p><br>'+objects[objKey].system+'</td>'+
              '<td><p class="text-error">'+objects[objKey].iquantity+'</p></td>'+
              '<td rowspan='+rowspan+'>'+objects[objKey].warranty+'</td>'+
              '<td rowspan='+rowspan+'>'+objects[objKey].iprice+'</td>'+
              '<td rowspan='+rowspan+'>'+objects[objKey].discount+'</td>'+
              '<td rowspan='+rowspan+'>'+objects[objKey].itotalprice+'</td>'+ 
              '</tr>'+
              '<tr>'+
              '<td></td>'+
              '<td>'+objects[objKey].note+'</td>'+
              '<td></td>'+
              '</tr>';
              for(var i = 0 ; i < specs.length; i++ ) {
                templ +='<tr>'+
                '<td>'+specs[i].productn+'</td>'+
                '<td>'+specs[i].name+'</td>'+
                '<td>'+specs[i].squantity+'</td>'+
                '</tr>';
              }
          }

        }
      } else {
        flag=true;
        alt +='<tr class="warning">'+
          '<td colspan="7"> <b> '+themes[themeKey].name+' </b></td>'+
          '</tr>';
          console.log(objects);
        for (var objkey in objects){
          var specs2 = getSpecs(objects[objKey].system_iditem);
          var rowspan = specs2.length+2;
          if(themes[themeKey].idtheme==objects[objkey].theme_idtheme){
            alt +='<tr>'+
              '<td>'+objects[objKey].productnum+'</td>'+
              '<td><p class="text-error pull-left">'+objects[objKey].brand+
              '</p><br>'+objects[objKey].system+'</td>'+
              '<td><p class="text-error">'+objects[objKey].iquantity+'</p></td>'+
              '<td rowspan='+rowspan+'>'+objects[objKey].warranty+'</td>'+
              '<td rowspan='+rowspan+'>'+objects[objKey].iprice+'</td>'+
              '<td rowspan='+rowspan+'>'+objects[objKey].discount+'</td>'+
              '<td rowspan='+rowspan+'>'+objects[objKey].itotalprice+'</td>'+ 
              '</tr>'+
              '<tr>'+
              '<td></td>'+
              '<td>'+objects[objKey].note+'</td>'+
              '<td></td>'+
              '</tr>';
            for(var j = 0 ; j < specs2.length; j++ ) {
              alt +='<tr>'+
              '<td>'+specs2[j].productn+'</td>'+
              '<td>'+specs2[j].name+'</td>'+
              '<td>'+specs2[j].squantity+'</td>'+
              '</tr>';
            }
          }
        }
      }
    }
    alt+='</tbody>'+
      '</table>';
    if (flag){
      $('#alt').html(alt);
    } else {
      $('#alt').html(null);
    }


    regs += '<legend>ملاحظات :</legend>'+
    '<ul>'+
    '<li>هذا العرض بالدينار الليبي ساري لمدة '+$.invoice.expire+' يوم من تاريخه.</li>'+
    '<li>فترة التسليم: '+$.invoice.delivery+' أيام فقط من إستلام أمر التكليف.</li>'+
    '<li>يتم التكليف بالإشارة إلى إجمالي الفاتورة بعد حساب مصروفات الضرائب  إلا في حالة'+
    ' إعفاء الجهة من الضرائب فيتم الإشارة المجموع الفرعي مع ضرورة إرفاق قرار الإعفاء الضريبي مع التكليف</li>'+
    '<li>طريقة الدفع: 100% بعد الإستلام والفحص وقبل التركيب والتشغيل مع إمكانية خصم قيمة التركيب والتشغيل إلى ما بعد التركيب والتشغيل.</li>'+
    '<li>شركة المنطق هي الشريك التجاري والخدمي لشركة Fujitsu وتملك مركز صيانة متخصص ومعتمد من الشركة المصنعة.</li>'+
    '<li>في حالة الدفع بعملة أخرى الرجاء مراعاة سعر العملة حسب التالي وفقاً لسعر مصرف الجمهورية لتاريخ '+$('#oDate').val()+'.</li>'+
    '</ul>'+
    '<div dir =ltr>'+
    '1 USD ='+$.invoice.usrate+' LYD<br>'+
    '1 EUR ='+$.invoice.eurate+' LYD'+
    '</div>';

    
    $('#preview').html(templ);
    console.log($.invoice);
    if($.invoice.type =="FIRST"){
      $('#regs').html(regs);
    } else {
      $('#paymentinfo').show();
      $('#balanceinfo').show();
    }
    /*$('#regs').html(regs);*/
  }

  function getInvoice(){
      if($.tp.id){
        $.get('/action/getInvoice/'+$.tp.id, function(invoice) {
          //console.log(invoice)
          $.invoice = invoice[0][0];
          /*console.log(invoice);*/
          prevInvoice();
          console.log(invoice[1]);
          console.log(invoice[2]);
          preview(invoice[1],invoice[2]);
        });
      }
    }
    getInvoice();

    function setSystem(id,flag){
    $.get('/action/getSystem/'+id, function(system) {
      console.log(system[0]);
      if(flag){
        /*$.objects*/
      }
    });
  }

  function getSpecs(id)
    {
         var result = null;
         var scriptUrl = "/action/getSpecs/"+id;
         $.ajax({
            url: scriptUrl,
            type: 'get',
            dataType: 'JSON',
            async: false,
            success: function(data) {
                result = data;
            } 
         });
         return result;
    }

  function prevInvoice(){
    if($.invoice.type=="FIRST"){
      $('#invType').text("مبدئية");
    } else if ($.invoice.type=="FINAL"){
      $('#invType').text("نهائية");
    } else {
      $('#invType').text("ملغاة");
    }
    
    $('#idinvoice').text($.invoice.idinvoice);
    $('#invoiceDate').text(formDate($.invoice.date));
    $('#subtPr').text($.invoice.subtotal);
    $('#taxPr').text($.invoice.tax);
    $('#totalPr').text($.invoice.totalprice);
    $('#fullypaid').text($.invoice.paid);
    $('#fullyunpaid').text(parseFloat($.invoice.totalprice)-parseFloat($.invoice.paid));
    getCustomer($.invoice.customer_idcustomer);
    getBalance($.invoice.customer_idcustomer);

  }

  function getBalance(id){
    $.get('/action/getCustomer/'+id, function(customer) {
      var balance = customer[1][0].left - (customer[2][0].totalprice-customer[2][0].paid) - customer[3][0].pay + customer[4][0].recieve;
      $('#balance').text(balance);
    });
  }

  function getCustomer(id){
    $.get('/action/getCustName/'+id, function(name) {
      $('#toCustomer').text(name[0].name);
    });
  }

  function setThemes(themes,systems){
    for(var i=0;i<themes.length;i++){
      if(themes[i].selected){
        $.objThemes[themes[i].idtheme]={
          text : themes[i].name
        }
      } else {
        $.subObjThemes[themes[i].idtheme]={
          text : themes[i].name
        }
      }
    }
  }

  function formDate(date){
    if (date){
      date = new Date(date);
      var day = date.getDate()+1,
        month = date.getMonth()+1,
        year = date.getFullYear();
      return day+"-"+month+"-"+year;

    }else{
      return "";
    }
  }
  $('body').on('click', '#ownerLogo', function () {
    if($.flag){
      $('#balancetable').hide();
      $.flag=false;
    } else {
      $('#balancetable').show();
      $.flag=true;
    }
  });

});