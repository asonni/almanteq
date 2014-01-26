$(document).ready(function(){
	$("#signup").validate({
		rules: {
			/*username: {
				required:true,
				minlength: 4,
				remote:{
        			url: "/checkUserName",
        			type: "get",
        			dataType: "json",
        			dataFilter: function(data) {
          				return JSON.parse(data).valid === true;
        			}
	            },
			},*/
			name:{
				required:true,
				minlength : 3
			},
			password:{
				required:true,
				minlength : 6
			},
			email:{
				required:true,
				email:true,
				remote:{
        			url: "/checkEmail",
        			type: "get",
        			dataType: "json",
        			dataFilter: function(data) {
          				return JSON.parse(data).valid === true;
        			}
	            },
			},
			/*password:{
				required:true,
				minlength:6,
			}*/
		},
		messages: {
			name:{
				required:"يجب عدم ترك هذا الحقل فارغ",
				minlength:"اقل شيء يجب ادخاله 3 حروف",
			},
			email:{
				required:"يجب عدم ترك هذا الحقل فارغ",
				remote:"هذا الايميل مستخدم يرجى استخدام ايميل آخر",
				email:"يجب التحقق من صلاحية الأيميل المدخل"
			},
			password:{
				required:"يجب عدم ترك هذا الحقل فارغ",
				minlength:"اقل شيء يجب ادخاله 6 حروف",
			},
		}
		
	});
	/*$('body').on("click", ".signup", function(){
		var str = $('form').serializeObject();
		console.log(str);
		
		//console.log(JSON.stringify($("form").serializeObject()));
		//return false;
		$("#signup").submit();
	});*/
	

	$('body').on('submit', 'form', function(data) {
		console.log("form submitted");
		$.post("/signUp", $("form").serializeObject(), function(data, textStatus, jqXHR){
			console.log("got here");
			console.log(data);
			$('#signup').hide();
			$('#signedup').show();
		});
		return false;
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