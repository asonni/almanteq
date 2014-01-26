/************************************************************************/
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'dunstuff',
  database : 'almanteq',
  multipleStatements: true
});

var util = require("util");
/************************************************************************/
exports.mysqlMgr = {
  connect : function (callback){
  	callback(connection);

  },
  
}
