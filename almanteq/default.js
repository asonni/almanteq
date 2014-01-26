var paperboy=require('paperboy'),
    util=require('util');

exports.defaultMgr = {
	handleDefault : function(req, res){
		var ip = req.connection.remoteAddress;
        paperboy
          .deliver("almanteq/www", req, res)
          .addHeader('Expires', 300)
          .addHeader('X-PaperRoute', 'Node')
          .before(function() {
          }.bind(this))
          .after(function(statCode) {
          }.bind(this))
          .error(function(statCode,msg) {
            res.writeHead(statCode, {'Content-Type': 'text/plain'});
            res.write("error: " + statCode);
            res.end();
            util.log("paperboy error: "+statCode + " " +msg);
          }.bind(this))
          .otherwise(function(err) {
            var statCode = 404;
            res.writeHead(statCode, {'Content-Type': 'text/plain'});
            res.write("error: " + statCode);
            res.end();
            util.log("paperboy error: "+statCode+" " +err);
          }.bind(this));
	},
  writeJson : function (result,res) {
    console.log("got hreho");
    var withCallback = JSON.stringify(result);
    res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(withCallback)
    })
    /*res.writeHead(200, {"Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });
    var withCallback = JSON.stringify(result);*/
    res.write(withCallback);
    res.end();
  }
}


