$(document).ready(function(){
  $.limit=0;
  $.size=0;
     
  function getSystems(){
    $.get('/action/getStock/'+$.limit, function(systems) {
      if(systems instanceof Array) {
        $.size= systems.length;
        $.draw({"systems":systems}, "systems-template", "#systems-target");
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
              getSystems();
            }
        });

        $('#next').on('click', function() {
          if($.size==10){
              $.limit+=10;
              getSystems();
            }
        });
      } else {
   
      }
    });
  }
   
  function getUser(){
    $.get('/getUser').success(function(user){
      $.draw({"name":user}, "user-template", "#user-target");
    });
  }
   
  getSystems();
  getUser();

 });

