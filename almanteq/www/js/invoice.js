$(document).ready(function(){
	$.invoice={};
	$.objects={};
	$.subObjects={};
	$.objThemes={};
	$.subObjThemes={};
	function preview(themes,objects){
		/*$('#invType').text($('#invoicetype option:selected').html());
		$('#toCustomer').text($('#customers').text());
		$('#invoiceDate').text($('#oDate').val());*/
		var templ = '',
			alt='<legend>Alternative Solutions :</legend>'+
			'<table class="table table-condensed table-bordered">'+
			'<thead>'+
			'<th>Product-Number</th>'+
			'<th>Description</th>'+
			'<th>QTY</th>'+
			'<th>WTY</th>'+
			'<th>Unit Price</th>'+
			'<th>Total</th>'+
			'</thead>'+
			'<tbody>',
			regs = '',
			flag=false;

		for(var themeKey in themes){
			if(themes[themeKey].selected){
				if(themes[themeKey].name!=""){
					templ +='<tr class="warning">'+
					'<td colspan="6"> <b> '+themes[themeKey].name+' </b></td>'+
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
					'<td colspan="6"> <b> '+themes[themeKey].name+' </b></td>'+
					'</tr>';
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

		/*if (! $.isEmptyObject($.subObjThemes)){
			console.log($.subObjThemes);
			var alt= '';
			
			for(var themeKey in $.subObjThemes){			 
				alt +='<tr class="warning">'+
				'<td colspan="6"> <b> '+$.subObjThemes[themeKey].text+' </b></td>'+
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
		}*/

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

        	//setThemes(invoice[1],invoice[2]);
          /*for(var i=0;i<systems.length;i++){
          	getSystem(systems[i].system_iditem);
          	getSpecs(systems[i].system_iditem);
          }*/
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

	/*function getSpecs(id){
		var i = 1;
		$.get('/action/getSpecs/'+id, function(specs) {
			i=45;
		});
		console.log(i);
	}*/
	/*var res =getSpecs(69);
	console.log(res.length);*/

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
		getCustomer($.invoice.customer_idcustomer);

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

		/*for(var i=0;i<systems.length;i++){
			if($.objThemes[systems[i].theme_idtheme]!="undefined"){
				$.objects[systems[i].theme_idtheme+systems[i].system_iditem] = {
					price : systems[i].price,
					quantity: systems[i].quantity,
					totalprice:systems[i].totalprice
				}
				setSystem(systems[i].system_iditem,true);
			}
		}*/

		console.log($.objThemes);
		console.log($.subObjThemes);

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


});