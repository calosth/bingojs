var dgram = require('dgram');
var client = dgram.createSocket('udp4');

// client.on('listening', function(){
// 	var address = client.address();
// 	console.log('UDP client Listening on ' + address.address+ ':' +address.port);
// });

client.on('message',function(message,remote){
	console.log(remote.address + ':' + remote.port + ' - ' + message);
});

client.bind(41234);
