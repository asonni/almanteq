$(document).ready(function(){
  var offerd={};
  $.branch= {};
  $.branches={};
  $.customers= new Array();
  $.customer={};
  $("#myModal form").validate({
    rules: {
      quantity: {
        required:true,
        number:true
      },
      itemprice: {
        required:true,
        customnumeric : true
      },
      system: {
        required:true,
      },
      class: {
        required:true,
      },
    }
  });

  var $tabs = $('.tabbable li');
  $('#prevtab').on('click', function() {

      $tabs.filter('.active').prev('li').find('a[data-toggle="tab"]').tab('show');
  });

  $('#nexttab').on('click', function() {
      $tabs.filter('.active').next('li').find('a[data-toggle="tab"]').tab('show');
  });

  function updatePaid(paid){
    var left = parseFloat($('#overall').val()-paid);
    var obj = {
      pk : $.tp.id,
      name : 'paid',
      value : paid
    };
    $.post("/editOffer", obj, function(data, textStatus, jqXHR){
      $('#paid').text(paid);
      obj = {
        pk : $.tp.id,
        name : 'left',
        value : left
      };
      $.post("/editOffer", obj, function(data, textStatus, jqXHR){
        $('#left').text(left);
      });
    });
  }
  function redraw(systems){
    var html = $.draw({"systems":systems}, "newSystem-template");
    $(html).hide().prependTo("#systems tbody").fadeIn("slow");	
  }
 
  function editOffer() {
    $.fn.editable.defaults.mode = 'popup';
    	//enable / disable
     $('#enable').click(function() {
       $('#offerTable .editable').editable('toggleDisabled');
     });
     $('#offern').editable({
      url: '/editOffer',
      type: 'text',
      pk: 1,
      name: 'offern',
      title: 'Offer #',
      disabled: true,
      success: function (response,newValue){
        $('#offerLink').text(newValue);
      }

    });
     $('#sapordern').editable({
      url: '/editOffer',
      type: 'text',
      pk: 1,
      name: 'sapordern',
      title: 'SAP Order #',
      disabled: true
    });
     $('#ordern').editable({
      url: '/editOffer',
      type: 'text',
      pk: 1,
      name: 'ordern',
      title: 'Order #',
      disabled: true
    });
    $('#paid').editable({
      url: '/editOffer',
      type: 'text',
      pk: 1,
      name: 'paid',
      title: 'المدفوع',
      disabled: true,
      success: function(response,newValue){
        var left = parseFloat($('#overall').val()-newValue),
        obj = {
          pk : $.tp.id,
          name : 'left',
          value : left
        };
        $.post("/editOffer", obj, function(data, textStatus, jqXHR){
            $('#left').text(left);
        });
      }
    });
    
     
    $('#currency').editable({
      url: '/editOffer',
      prepend: "لم يتم الإختيار",
      disabled: true,
      source: [
      {value: "EUR", text: 'يورو'},
      {value: "USD", text: 'دولار'},
      {value: "LYD", text: 'دينار ليبي'},
      {value: "GBP", text: 'باوند'}
      ],
      validate: function(value) {
        if($.trim(value) == '') return 'يجب اختيار العملة';
      }
    });
    $('#payment').editable({
      url: '/editOffer',
      prepend: "لم يتم الإختيار",
      disabled: true,
      source: [
      {value: "CASH", text: 'نقداً'},
      {value: "ACCOUNT", text: 'على الحساب'},
      {value: "HALF", text: 'دفع جزء وباقي جزء'},
      ],
      validate: function(value) {
        if($.trim(value) == '') return 'يجب اختيار طريقة الدفع';
      }
    });
     $('#date').editable({
      url: '/editOffer',
      disabled: true
    });
     $('#note').editable({
      url: '/editOffer',
      type: 'textarea',
      pk: 1,
      name: 'note',
      title: 'الشرح',
      disabled: true
    });
     $('#producv').editable({
      url: '/editOffer',
      type: 'text',
      pk: 1,
      name: 'producv',
      title: 'Enter Product Version',
      disabled: true
    });

     $('#packagen').editable({
      url: '/editOffer',
      type: 'text',
      pk: 1,
      name: 'packagen',
      title: 'رقم الشحنة',
      disabled: true
    });
     $('#pdate').editable({
      url: '/editOffer',
      disabled: true
    });
     $('#source').editable({
      url: '/editOffer',
      prepend: "لم يتم الإختيار",
      disabled: true,
      source: [
      {value: "مصر", text: 'مصر'},
      {value: "تونس", text: 'تونس'},
      {value: "ليبيا", text: 'ليبيا'},
      {value: "المغرب", text: 'المغرب'},
      {value: "المانيا", text: 'المانيا'},
      {value: "امريكا", text: 'امريكا'},
      {value: "الاردن", text: 'الاردن'},
      {value: "فرنسا", text: 'فرنسا'},
      ],
    });
     $('#desc').editable({
      url: '/editOffer',
      type: 'text',
      pk: 1,
      name: 'desc',
      title: 'وصف الشحنة',
      disabled: true
    });
     $('#rate').editable({
        url: '/editOffer',
        type: 'text',
        pk: 1,
        name: 'rate',
        title: 'سعر الصرف',
        disabled: true,
        validate: function(value) {
          if($.trim(value) == '') return 'يجب ادخال سعر الصرف';
          if(!$.isNumeric(value)) return 'يجد ادخال رقم فقط';
        },
        success: function (response,newValue){
          var totalEx = parseFloat($('#overallex').val()),
          paidinlyd = parseFloat(newValue) * parseFloat($('#paidinf').val()),
          total=0;
          var obj = {
            pk : $.tp.id,
            name : 'paidinlyd',
            value : Math.round(paidinlyd,3)
          };
          $.post("/editOffer", obj, function(data, textStatus, jqXHR){
            $('#paidinlyd').val(Math.round(paidinlyd,3));
            total = totalEx + paidinlyd;
            obj = {
              pk : $.tp.id,
              name : 'overall',
              value : Math.round(total,3)
            };
            $.post("/editOffer", obj, function(data, textStatus, jqXHR){
              $('#overall').val(Math.round(total,3));
              updatePaid(Math.round(total,3));
            });
          });
        } 
    });
$('#customex').editable({
  url: '/editOffer',
  type: 'text',
  pk: 1,
  name: 'customex',
  title: 'مصاريف الجمارك',
  disabled: true,
  validate: function(value) {
    if($.trim(value) == '') return 'يجب ادخال سعر الصرف';
    if(!$.isNumeric(value)) return 'يجد ادخال رقم فقط';
  },
  success: function (response,newValue){
    var totalEx = parseFloat(newValue) + parseFloat($('#shipex').text()) + parseFloat($('#taxex').text())+parseFloat($('#otherex').text()),
    paidinlyd = parseFloat($('#paidinlyd').val()),
    total=0;
    var obj = {
      pk : $.tp.id,
      name : 'overallex',
      value : totalEx
    };
    $.post("/editOffer", obj, function(data, textStatus, jqXHR){
      $('#overallex').val(totalEx);
      total = totalEx + paidinlyd;
      obj = {
        pk : $.tp.id,
        name : 'overall',
        value : total
      };
      $.post("/editOffer", obj, function(data, textStatus, jqXHR){
        $('#overall').val(total);
      });
    });
  }

});
$('#shipex').editable({
  url: '/editOffer',
  type: 'text',
  pk: 1,
  name: 'shipex',
  title: 'مصاريف الشحن',
  disabled: true,
  validate: function(value) {
    if($.trim(value) == '') return 'يجب ادخال سعر الصرف';
    if(!$.isNumeric(value)) return 'يجد ادخال رقم فقط';
  },
  success: function (response,newValue){
    var totalEx = parseFloat(newValue) + parseFloat($('#customex').text()) + parseFloat($('#taxex').text())+parseFloat($('#otherex').text()),
    paidinlyd = parseFloat($('#paidinlyd').val()),
    total=0;
    var obj = {
      pk : $.tp.id,
      name : 'overallex',
      value : totalEx
    };
    $.post("/editOffer", obj, function(data, textStatus, jqXHR){
      $('#overallex').val(totalEx);
      total = totalEx + paidinlyd;
      obj = {
        pk : $.tp.id,
        name : 'overall',
        value : total
      };
      $.post("/editOffer", obj, function(data, textStatus, jqXHR){
        $('#overall').val(total);
      });
    });
  }
});
$('#taxex').editable({
  url: '/editOffer',
  type: 'text',
  pk: 1,
  name: 'taxex',
  title: 'مصاريف الضرائب',
  disabled: true,
  validate: function(value) {
    if($.trim(value) == '') return 'يجب ادخال سعر الصرف';
    if(!$.isNumeric(value)) return 'يجد ادخال رقم فقط';
  },
  success: function (response,newValue){
    var totalEx = parseFloat(newValue) + parseFloat($('#shipex').text()) + parseFloat($('#customex').text())+parseFloat($('#otherex').text()),
    paidinlyd = parseFloat($('#paidinlyd').val()),
    total=0;
    var obj = {
      pk : $.tp.id,
      name : 'overallex',
      value : totalEx
    };
    $.post("/editOffer", obj, function(data, textStatus, jqXHR){
      $('#overallex').val(totalEx);
      total = totalEx + paidinlyd;
      obj = {
        pk : $.tp.id,
        name : 'overall',
        value : total
      };
      $.post("/editOffer", obj, function(data, textStatus, jqXHR){
        $('#overall').val(total);
      });
    });
  }
});
$('#otherex').editable({
  url: '/editOffer',
  type: 'text',
  pk: 1,
  name: 'otherex',
  title: 'مصاريف اخرى',
  disabled: true,
  validate: function(value) {
    if($.trim(value) == '') return 'يجب ادخال سعر الصرف';
    if(!$.isNumeric(value)) return 'يجد ادخال رقم فقط';
  },
  success: function (response,newValue){
    var totalEx = parseFloat(newValue) + parseFloat($('#shipex').text()) + parseFloat($('#taxex').text())+parseFloat($('#customex').text()),
    paidinlyd = parseFloat($('#paidinlyd').val()),
    total=0;
    var obj = {
      pk : $.tp.id,
      name : 'overallex',
      value : totalEx
    };
    $.post("/editOffer", obj, function(data, textStatus, jqXHR){
      $('#overallex').val(totalEx);
      total = totalEx + paidinlyd;
      obj = {
        pk : $.tp.id,
        name : 'overall',
        value : total
      };
      $.post("/editOffer", obj, function(data, textStatus, jqXHR){
        $('#overall').val(total);
      });
    });
  }
});
  $('#retail').editable({
    url: '/editOffer',
    type: 'text',
    pk: 1,
    name: 'retail',
    title: 'نسبة الربح للقطاعي',
    disabled: true,
    source : getPercent()
  });
  $('#wholesale').editable({
    url: '/editOffer',
    type: 'text',
    pk: 1,
    name: 'wholesale',
    title: 'نسبة الربح للجملة',
    disabled: true,
    source : getPercent()
  });
}

  function getPercent(){
    var percentage = [];
    for (var i = 1; i <= 100 ; i++){
      percentage.push({value: i, text: '%'+i});
    }
    return percentage;
  }
	$('#quantity, #itemprice')  //  jQuery CSS selector grabs elements with the ID's "quantity" & "item_price"
      .on('change', function(e) {  //  jQuery 1.6+ replcement for .live (dynamically asigns event, see jQuery API)
      //  in this case, our event is "change" which works on inputs and selects to let us know when a value is changed
          //  below i use inline if statements to assure the values i get are "Real"
      var quan = $("#quantity").val() != "" ? parseFloat($("#quantity").val()) : 1,  //  Get quantity value
          price = $("#itemprice").val() != "" ? parseFloat($("#itemprice").val()) : 0;  //  Get price value
          console.log(quan+price);
      $('#totalprice').val(Math.round(price*quan,3)); // show total
  });

  

  function activated(){
      $('#offerTable .editable').editable({
        disabled : true
      });
      $('#enable').remove();
      $('#activateButton').remove();
/*          $('#flag').removeClass().addClass("labe label-success pull-right");
*/          $('.whenActive').remove();
  }
  $('body').on("click", ".confirmActivate", function(){
    console.log("confirmActivate");
    $.get('/action/activate/'+$.tp.id, function(result) {
      activated();
      $('#activateModal').modal('hide');
      getSystems();
      getOffer();
      $('.top-right').notify({
        message: { text: 'تمت عملية التفعيل بنجاح' },
        fadeOut: { enabled: true, delay: 3000 }
      }).show();
    });
    return false;
  });
      
      

      $('body').on("click", ".confirmDelFile", function(){
        console.log("confirmDelFile");
        $("#delFile").submit();
      });
      
      $('body').on('submit', '#delFile', function(data) {
        var fileId = $('#fileId').val();
        $.get('/action/delFile/'+fileId, function(result) {
          $('#delFileModal').modal('hide');
          $('#f'+fileId).remove();
          $('.top-right').notify({
            message: { text: 'تمت عملية المسح بنجاح' },
            fadeOut: { enabled: true, delay: 3000 }
          }).show();
        });
        return false;
      });

      $('body').on("click", ".confirmAddSystem", function(){
        console.log("confirmaddSystem");
        $("#addSystem").submit();
      });
      $('body').on('submit', '#addSystem', function(data) {
        obj = $("#addSystem").serializeObject();
        obj["offer_idoffer"]= $.tp.id;
        
        $.post("/addSystem", obj, function(data, textStatus, jqXHR){
         $('#myModal').modal('hide');
         //calc(obj.totalprice,true);
         redraw(data);
         $('#paidinf').val(data.result.paidinf);
         $('#paidinlyd').val(data.result.paidinlyd);
         updatePaid(data.result.overall);
         $('#overall').val(data.result.overall);
         //updateSys(data);// update all systems when add /delete or edit
         var idbranch = $('#branch_idbranch').val(),
             count= $.branches[idbranch].count+1;
         var eObj = {
              pk : idbranch,
              name : 'count',
              value : count
            };
            $.post("/editBranch", eObj, function(data1, textStatus, jqXHR){
              
              getBranches();
             
            });
   
       });
        return false;
      });

      $('body').on("click", ".confirmDelSys", function(){
        console.log("confirmDelSys");
        $("#delSys").submit();
      });
      
      $('body').on('submit', '#delSys', function(data) {
        var sysId = $('#sysId').val(),
        totalPrice = $('#totalPrice').val();
        $.get('/action/delSys/'+sysId, function(result) {
          $('#delSysModal').modal('hide');
          $('#s'+sysId).remove();
          $('#paidinf').val(result.paidinf);
          $('#paidinlyd').val(result.paidinlyd);
          updatePaid(result.overall);
          $('#overall').val(result.overall);
          $('.top-right').notify({
            message: { text: 'تمت عملية المسح بنجاح' },
            fadeOut: { enabled: true, delay: 3000 }
          }).show();
          var idbranch = $('#branch_idbranch').val(),
             count= $.branches[idbranch].count-1;
          var eObj = {
              pk : idbranch,
              name : 'count',
              value : count
            };
            $.post("/editBranch", eObj, function(data1, textStatus, jqXHR){
              
              getBranches();
             
            });
        });
        return false;
      });
      $('body').on("click", ".confirmArrival", function(){
        console.log("confirmArrival");
        $("#itemArrived").submit();
      });
            
      $('body').on('submit', '#itemArrived', function(data) {
        var sysId = $('#sysId2').val();
        $.get('/action/itemArrived/'+sysId, function(result) {
          $('#sysArrivedModal').modal('hide');
          $('#c'+sysId).html('<span class="label label-success"> <i class="icon-home"></i></span>');
          $('.top-right').notify({
            message: { text: 'تم وصول البند للمخازن بنجاح' },
            fadeOut: { enabled: true, delay: 3000 }
          }).show();
        });
        return false;
      });

      
      /////////////////////////////////////
      $('body').on("click", ".confirmAddBranch", function(){
        console.log("confirmaddBranch");
        $("#addBranch").submit();
      });
      $('body').on('submit', '#addBranch', function(data) {
        obj = $("#addBranch").serializeObject();
        $.post("/addBranch", obj, function(data, textStatus, jqXHR){
         
          $('#addBranchModal').modal('hide');
            var eObj = {
              pk : data.parent,
              name : 'haschild',
              value : 1
            };
            $.post("/editBranch", eObj, function(data1, textStatus, jqXHR){
              getBranches();
             
            });
       });
        return false;
      });
      /////////////////////////////////////
      /////////////////////////////////////
      $('body').on("click", ".confirmEditBranch", function(){
        console.log("confirmEditBranch");
        $("#editBranch").submit();
      });
      $('body').on('submit', '#editBranch', function(data) {
        obj = {
          pk : $('#eid').val(),
          name : 'name',
          value : $('#ename').val()
        };
        $.post("/editBranch", obj, function(data, textStatus, jqXHR){
          $('#editBranchModal').modal('hide');
          getBranches();
       });
        return false;
      });
      /////////////////////////////////////
       /////////////////////////////////////
      $('body').on("click", ".confirmDelBranch", function(){
        console.log("confirmDelBranch");
        $("#delBranch").submit();
      });
      $('body').on('submit', '#delBranch', function(data) {
        var did = $('#did').val(),
            parent = $('#dparent').val();

        $.branch[parent]--;
        console.log($.branch);
        if($.branch[parent]==0){
          var obj = {
            pk : parent,
            name : 'haschild',
            value : 0
          };
          $.post("/editBranch", obj, function(data, textStatus, jqXHR){
            
          });

        }
        $.get('/action/delBranch/'+did, function(result) {
          $('#delBranchModal').modal('hide');
          getBranches();
       });
        return false;
      });
      /////////////////////////////////////
      function setTree(){
          $('.tree li.parent_li > span').on('click', function (e) {
              var children = $(this).parent('li.parent_li').find(' > ul > li');
              if (children.is(":visible")) {
                  children.hide('fast');
                  $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
              } else {
                  children.show('fast');
                  $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
              }
              e.stopPropagation();
          });
      }

      /////////////////////////////////////
      function getBranches(){
        $('#ul0 li').remove();
        $.get('/action/getBranches/', function(branches) {
   
          if(branches) {
            console.log(branches);
            for(var i=0; i<branches.length;i++){
              if(typeof $.branch[branches[i].parent] == 'undefined'){
                $.branch[branches[i].parent] = 1;
              } else {
                $.branch[branches[i].parent]++;
              }
             $.branches[branches[i].idbranch]={
                count : branches[i].count,
                parent : branches[i].parent,
                haschild :branches[i].haschild, 
                name : branches[i].name};
              var html='',
                  icon='',
                  haschild='',
                  notroot='';
              
              html+= '<li id="p'+branches[i].idbranch+'">';
              if (branches[i].haschild){
                icon="icon-minus-sign";
                haschild='<ul id="ul'+branches[i].idbranch+'"></ul>';
              } else {
                if(i!=0 && (branches[i].count==0)) {
                  notroot ='&nbsp<a title="حذف الفرع" href="#delBranchModal" onClick=\'delLeaf("'+branches[i].name+'","'+branches[i].idbranch+'","'+branches[i].parent+'");return false;\' data-toggle="modal"><i class="icon-remove"></i></a>';
                }
                icon="icon-leaf";
              }
              if(i!=0){
                notroot+='&nbsp<a title="إضافة بند لهذا الفرع" href="#myModal" class="btn btn-mini btn-success" onClick=\'addSystem("'+branches[i].idbranch+'");return false;\' data-toggle="modal"><i class="icon-plus"></i></a>';
              }
              html+='<span><i id="ic'+branches[i].idbranch+'" class="'+icon+'"></i> '+branches[i].name+
                    '</span> &nbsp<a title="إضافة فرع جديد" href="#addBranchModal" onClick=\'addLeaf("'+branches[i].idbranch+'");return false;\' data-toggle="modal"><i class="icon-plus"></i></a>'+
                    '&nbsp<a title="تعديل اسم الفرع" href="#editBranchModal" onClick=\'editLeaf("'+branches[i].name+'","'+branches[i].idbranch+'");return false;\' data-toggle="modal"><i class="icon-edit"></i></a>'+
                    notroot+
                    haschild+'</li>';
              $(html).hide().appendTo("#ul"+branches[i].parent).fadeIn("slow");
            }
            console.log($.branches);
            $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
            setTree();
            /*$('.tree li ul > li').hide();*/

          }
        });
      }


      /////////////////////////////////////
      function getOffer(){
        if($.tp.id){
          $.get('/action/getOffer/'+$.tp.id, function(offer) {
            if(offer instanceof Array) { 
              $.draw({"offer":offer[0]}, "offer-template", "#offer-target");
              $('#oDate').val($.getDate());
              editOffer();
              getCust();
              offerd=offer[0];
              $('#offerLink').text(offer[0].offern);
            }
         });
       }
     }

    function getSystems(){
      if($.tp.id){
        $.get('/action/getSystems/'+$.tp.id, function(systems) {
          if(systems instanceof Array) {
            $.draw({"systems":systems,"status":offerd.status}, "systems-template", "#systems-target");
          }
        });
      }
    }
    function getFiles(){
      if($.tp.id){
        $("#fid").val($.tp.id);
        $.get('/action/getFiles/'+$.tp.id, function(files) {
          if(files instanceof Array) {
            $.draw({"files":files}, "files-template", "#files-target");
          } else {
            /*getSystems();*/
          /*location.reload();*/
          }
        });
      }
    }
    function getUser(){
      $.get('/getUser').success(function(user){
        $.draw({"name":user}, "user-template", "#user-target");
      });
    }


    function getCust() {
      $.get('/action/getCustomersNames', function (data) {
        for ( var  i = 0 ; i< data.length; i++){
          var k = new Object({value:data[i].value,text : data[i].text});
          $.customers.push(k);
          $.customer[data[i].value] = {
            text : data[i].text,
            creditor : data[i].creditor,
            debtor : data[i].debtor
          };
        }

        $('#customer_idcustomer').editable({
          url: '/editOffer',
          prepend: "لم يتم الإختيار",
          disabled: true,
          source: $.customers,
        });
        var idcustomer = $('#customer_idcustomer').text();
        if(idcustomer!="undefined"){
          console.log($.customer);
          $('#customer_idcustomer').text($.customer[idcustomer].text);
        }
       /* var custs = $('#customers');
        $(custs).select2({
          data : $.customers,
          width : "170px"
        });
        $(custs).select2('val','0');*/
      });
    }
    $('body').on("click", ".confirmAddCust", function(){
      console.log("confirmaddmsg");
      $("#addCustomer").submit();
    });

    $('body').on('submit', '#addCustomer', function(data) {
      $.post("/addCustomer", $("#addCustomer").serializeObject(), function(data, textStatus, jqXHR){
        $('#newCustModal').modal('hide');
        $('#customer_idcustomer').data('value',data.idcustomer);
        $('#customer_idcustomer').text(data.name);
        
        var o = new Object({value : data.idcustomer ,text : data.name});
        $.customers.push(o);
        var obj = {
          pk : $.tp.id,
          name : 'customer_idcustomer',
          value : data.idcustomer
        };
        $.post("/editOffer", obj, function(data, textStatus, jqXHR){
        });
      });
      return false;
    });
   
   getOffer();
   getSystems();
   getFiles();
   getUser();
   getBranches();

 });

