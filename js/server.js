var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var PORT = 41234;
var HOST = '255.255.255.255';
var message = new Buffer('{hola:correlacorrela}');
server.bind(function(){
	server.setBroadcast(true);
});
server.send(message, 0, message.length, PORT, HOST,	function(err, bytes){
	if(err) throw err;
	console.log('UDP message sent to ' + HOST + ' : ' + PORT);
	server.close();
});