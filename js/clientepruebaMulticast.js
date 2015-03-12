// var dgram = require('dgram');
// var client = dgram.createSocket('udp4');


// client.on('listening',function(){
// 	client.setBroadcast(true);
// 	client.setMulticastTTL(128);
// 	client.addMembership('230.185.192.108','192.168.0.103');
// 	console.log('multicast');
// });

// client.on('message',function(message,remote){
// 	// var y = JSON.parse(message);

// 	console.log(message);
// });

// client.bind(8088,'192.168.0.103');

var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
 
var testMessage = "[hello world] pid: ";
var multicastAddress = '239.1.2.3';
var multicastPort = 5554;
 
// socket.addMembership(multicastAddress);
socket.bind(multicastPort, '0.0.0.0',function(){
	
	socket.setBroadcast(true);
	socket.setMulticastTTL(128);
	socket.addMembership(multicastAddress);

});
 
socket.on("message", function ( data, rinfo ) {
	console.log("Message received from ", rinfo.address, " : ", data.toString());
});
 
// setInterval(function () {
// 	socket.send(new Buffer(testMessage), 
// 			0, 
// 			testMessage.length, 
// 			multicastPort, 
// 			multicastAddress, 
// 			function (err) {
// 				if (err) console.log(err);
				
// 				console.log("Message sent");
// 			}
// 	);
// }, 1000);