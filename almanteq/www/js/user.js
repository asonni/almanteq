$(document).ready(function(){

	function editUser() {
		$.fn.editable.defaults.mode = 'popup';
    	//enable / disable
 		$('#enable').click(function() {
     		$('#user .editable').editable('toggleDisabled');
 		});
 		$('#name').editable({
         	url: '/editUser',
         	type: 'text',
         	pk: 1,
         	name: 'name',
         	title: 'الإسم',
         	disabled: true
  	});
    $('#email').editable({
          url: '/editUser',
          type: 'text',
          pk: 1,
          name: 'email',
          title: 'البريد الإلكتروني',
          disabled: true
    });
		$('#password').editable({
         	url: '/editUser',
         	type: 'password',
         	pk: 1,
         	name: 'password',
         	title: 'كلمة المرور',
         	disabled: true
  	});
   }
	
	function getUser1(){
		$.get('/getUserData', function(user) {
				$.draw({"user":user}, "user1-template", "#user1-target");
				editUser();
		});
	}

  function getUser(){
    $.get('/getUser').success(function(user){
      $.draw({"name":user}, "user-template", "#user-target");
    });
  }
	
	getUser1();
  getUser();
	//defaults


});