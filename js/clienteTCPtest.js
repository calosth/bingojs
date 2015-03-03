

var dgram = require('dgram');
var network = {

	listMessage: [1,2,3],
	udp: dgram.createSocket('udp4'),
	net: require('net'),
	clientUDP: function(port){
		
		var dgram = require('dgram');
		var client = dgram.createSocket('udp4');



		client.on('listening', function(){
			var address = client.address();
			console.log('UDP client Listening on ' + address.address+ ':' +address.port);
		});

		client.on('message',function(message,remote){
			console.log(remote.address + ':' + remote.port + ' - ' + message);
			console.log(this)
		});

		client.bind(port);
	},

	serverUDP: function(json, port){
		var dgram = require('dgram');
		var server = dgram.createSocket('udp4');

		var PORT = port;
		var HOST = '255.255.255.255';
		var message = new Buffer(JSON.stringify(json));
		server.bind(function(){
			server.setBroadcast(true);
		});
		server.send(message, 0, message.length, PORT, HOST,	function(err, bytes){
			if(err) throw err;
			console.log('UDP message sent to ' + HOST + ' : ' + PORT);
			server.close();
		});	
	},

	clientTCP: function(json, ip, port){
		var net = require('net');

		var HOST = ip;
		var PORT = port;

		var client = new net.Socket();
		
		client.connect(PORT, HOST, function() {

		    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
		    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
		    client.write('I am Chuck Norris!');

		});

		// Add a 'data' event handler for the client socket
		// data is what the server sent to this socket
		client.on('data', function(data) {
		    
		    console.log('DATA: ' + data);
		    // Close the client socket completely
		    // client.destroy();
		    
		});

		// Add a 'close' event handler for the client socket
		client.on('close', function() {
		    console.log('Connection closed');
		});

	},
	serverTCP: function(json, ip, port){

		var HOST = ip;
		var PORT = port;

		// Create a server instance, and chain the listen function to it
		// The function passed to net.createServer() becomes the event handler for the 'connection' event
		// The sock object the callback function receives UNIQUE for each connection
		net.createServer(function(sock) {
		    
		    // We have a connection - a socket object is assigned to the connection automatically
		    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
		    
		    // Add a 'data' event handler to this instance of socket
		    sock.on('data', function(data) {
		        
		        console.log('DATA ' + sock.remoteAddress + ': ' + data);
		        // Write the data back to the socket, the client will receive it as data from the server
		        sock.write('You said "' + data + '"');
		        
		    });
		    
		    // Add a 'close' event handler to this instance of socket
		    sock.on('close', function(data) {
		        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
		    });
		    
		}).listen(PORT, HOST);

		console.log('Server listening on ' + HOST +':'+ PORT);
	}
};

function tcp(ip, port){
		var net = network.net
		var HOST = ip;
		var PORT = port;

		// Create a server instance, and chain the listen function to it
		// The function passed to net.createServer() becomes the event handler for the 'connection' event
		// The sock object the callback function receives UNIQUE for each connection
		net.createServer(function(sock) {
		    
		    // We have a connection - a socket object is assigned to the connection automatically
		    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
		    
		    // Add a 'data' event handler to this instance of socket
		    sock.on('data', function(data) {
		        
		        console.log('DATA ' + sock.remoteAddress + ': ' + data);
		        var message = JSON.parse(data)
		        switch(message.code){
		        	case '100':
		        		var json = {
		        			'code': '101',
		        			'IDJuego': '231',
		        		};
		        		// var message = new Buffer(json);
				        sock.write(JSON.stringify(json));
				        break;

				    case '102':
				    	
				    	var json = {
				    		'code':'103',
				    		'cartones': [

				    			{
				    				'IDCarton':'1',
				    				'Numeros': [[1,2,3,4,5],[6,7,8,9,1],[1,2,null,4,4],[5,2,4,1,4],[6,3,5,2,1]]
				    			},
				    			{
				    				'IDCarton':'2',
				    				'Numeros': [[1,2,3,4,5],[6,7,8,9,1],[1,2,null,4,4],[5,2,4,1,4],[6,3,5,2,1]]
				    			}

				    		]
				    	};

				    	sock.write(JSON.stringify(json));

				    	break;

		        	default:
		        }
		        // Write the data back to the socket, the client will receive it as data from the server
		        
		    });
		    
		    // Add a 'close' event handler to this instance of socket
		    sock.on('close', function(data) {
		        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
		    });
		    
		}).listen(PORT, HOST);
};

tcp('127.0.0.1', 10022);

// // Envio cada segundo el broadcast con la partida
// var json = {
// 	'code': 105,
// 	'contenido': {
// 		'ip': global.ip,
// 		'sala': global.infoJuego.nombrePartida,
// 		'maxPersonas': global.infoJuego.maximoDePersonas,
// 		'maxCartones': global.infoJuego.maximoDeCartones
// 	},
// };
// setInterval(function(){
// 	network.serverUDP(json, port);		
// },5000)
