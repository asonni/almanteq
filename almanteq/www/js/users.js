$(document).ready(function(){

	$('body').on("click", ".confirmActivate", function(){
    	console.log("confirmActivate");
    	$("#activate").submit();
  	});
  
	$('body').on('submit', '#activate', function(data) {
		var userId = $('#userId').val();
		$.get('/action/activateUser/'+userId, function(result) {
		  $('#activateModal').modal('hide');
		  $('#a'+userId).html('<span class="label label-warning"><i class="icon-thumbs-up"></i></span>');
		   $('.top-right').notify({
		      message: { text: 'تم تفعيل المستخدم بنجاح' },
		      fadeOut: { enabled: true, delay: 3000 }
		    }).show();
		});
		return false;
	});
	$('body').on("click", ".confirmDelUser", function(){
	    console.log("confirmDelUser");
	    $("#delUser").submit();
  	});
  
	$('body').on('submit', '#delUser', function(data) {
		var userId = $('#userId2').val();
		$.get('/action/delUser/'+userId, function(result) {
			if(result){
			  $('#delUserModal').modal('hide');
			  $('#s'+userId).remove();
			  $('.top-right').notify({
				message: { text: 'تمت عملية الإلغاء بنجاح'},
				fadeOut: { enabled: true, delay: 3000 }
			  }).show();
			} else {
				$('#delUserModal').modal('hide');
				$('.top-right').notify({
					type: 'danger',
					message: { text: 'لا يمكن إلغاء مستخدم مسؤول'},
					fadeOut: { enabled: true, delay: 3000 }
			  }).show();
			}
		});
		return false;
	});
	function getUsers(){
		$.get('/action/getUsers').success(function(users) {
			console.log(users);
    	if(users instanceof Array){
				$.draw({"users":users}, "users-template", "#users-target");
			} else {
			}
		});
	}

	function getUser(){
		$.get('/getUser').success(function(user){
			$.draw({"name":user}, "user-template", "#user-target");
		});
	}
	

	getUsers();
	getUser();
	
	
});