var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
var multicastPort = 5554;
 
// socket.addMembership(multicastAddress);
socket.bind(multicastPort, '0.0.0.0', function(){
	
	socket.setBroadcast(true);
	socket.setMulticastTTL(1);
	socket.addMembership('239.1.2.3');
	console.log('se creo');

});

socket.on('message', function(data, rinfo){

	var message = JSON.stringify(data);
	console.log(message);

});