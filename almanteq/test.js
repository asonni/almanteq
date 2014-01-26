var mysqlMgr = require('./mysql').mysqlMgr,
    util=require('util'),
    qs=require('querystring');

  /*function addSpec(body){
    mysqlMgr.connect(function (conn) {
      conn.query('INSERT INTO specs SET ?',  body,  function(err, result) {
        if(err) {
          util.log(err);
        } else {
          
          console.log(result);
          

        }
      });
    });
  }*/



/*addSystem(obj);
*/

/*var data = {
name: ["1111","22222","33333"],
productn: ["1111","22222","33333"],
squantity: ["1111","22222","33333"]
}

for (var i = 0; i < data.productn.length; i++){
  var obj = {
    productn : data.productn[i],
    name : data.name[i],
    squantity : data.squantity[i],
    system_iditem : 24

  };
  addSpec(obj);

}*/


/*
var obj = { '{\n  "system": {\n    "system": "dsff",\n    "barcode": "232",\n    "itemprice": "323",\n    "quantity": "23",\n    "totalprice": "2323",\n    "note": "232",\n    "offer_idoffer": "74"\n  },\n  "specs": {\n    "productn": [\n      "333",\n      "444"\n    ],\n    "name": [\n      "33",\n      "444"\n    ],\n    "squantity": [\n      "3333",\n      "4444"\n    ]\n  }\n}': '' };
var obj2 = { system: 'sfgasfs',
  barcode: 'fasfas',
  itemprice: 'fasfas',
  quantity: 'fasfas',
  totalprice: 'fasf',
  note: 'asfasfasf',
  count: '1',
  'product[]': [ 'asfasf', 'f44' ],
  'name[]': [ 'asfsafas', '44444' ],
  'squantity[]': [ 'fasfasfas', '4444' ],
  offer_idoffer: '76' }


//obj = qs.parse(obj2);
console.log(obj2["product[]"]);*/