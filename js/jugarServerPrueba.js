var net = require('net');

var conexionTCP = function(){

	var message;

	net.createServer( function(socket){

		socket.on('data', function(data){
			try{
				message = JSON.parse(data);
			}catch(err){
				console.log(err);
			}

			try{

				console.log( message.COD );

			} catch(err){
				console.log(err);
			}
		});

	}).listen(global.ip, 10022);

}();

