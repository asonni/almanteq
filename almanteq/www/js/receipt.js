$(document).ready(function(){

     
  function getReceipt(){
    var obj ={
      id : $.tp.id,
      cid : $.tp.uid
    }
    obj = JSON.stringify(obj);
    $.get('/action/getReceipt/'+obj, function(receipt) {
        $.draw({"receipt":receipt[0][0],"customer":receipt[1][0]}, "receipt-template", "#receipt-target");
        console.log(receipt);
    });
  }
   
  
   
  getReceipt();

 });

