$(document).ready(function(){
	$("#signin").validate({
		rules: {
			username:{
				required:true,
				email:true
				
			},
			password:{
				required:true,
				minlength:6,
			},
		},
	});
	$("#retpass").validate({
		rules: {
			email:{
				required:true,
				email:true,
				remote:{
        			url: "/checkEmail",
        			type: "get",
        			dataType: "json",
        			dataFilter: function(data) {
          				return JSON.parse(data).valid !== true;
        			}
	            },
				
			},
		},
		messages: {
			email:{
				required:"يجب عدم ترك هذا الحقل فارغ",
				remote:"هذا المستخدم غير موجود لدينا يرجى التأكد من البريد الالكتروني المدخل",
				email:"يجب التحقق من صلاحية الأيميل المدخل"
			},
		}
	});

	$('body').on("click", ".confirmRetPass", function(){
		console.log("confirmRetPass");
		$("#retpass").submit();
	});

	$('body').on('submit', '#retpass', function(data) {
		var email = $("#retpass").serializeObject().email;
		console.log(email);
		$.get('/retPass/'+email).success(function(result) {
			if(result){
			  $('#retPassModal').modal('hide');
			  $('.top-right').notify({
				message: { text: 'لقد تم ارسال كلمة المرور إلى بريدك الألكتروني بنجاح'},
				fadeOut: { enabled: true, delay: 3000 }
			  }).show();
			} else {
				$('#retPassModal').modal('hide');
				$('.top-right').notify({
					type: 'danger',
					message: { text: 'هناك خطأ ما يرجى إعادة المحاولة في وقت آخر'},
					fadeOut: { enabled: true, delay: 3000 }
			  }).show();
			}
		});
		return false;

		/*$.post("/retPass", $("retpass").serializeObject(), function(data, textStatus, jqXHR){
			$('#myModal').modal('hide');
			redraw(data);
		});
		return false;*/
		/*console.log($("#retpass").serializeObject().email);
		return false;*/
	});
	$.fn.serializeObject = function()
	{
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};
});


