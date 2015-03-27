var player = new Player('../sounds/sounds-882-solemn.mp3.mp3');
var _ = require('./underscore.js');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

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
		var quantity = 1;


		// Create a server instance, and chain the listen function to it
		// The function passed to net.createServer() becomes the event handler for the 'connection' event
		// The sock object the callback function receives UNIQUE for each connection
		net.createServer(function(sock) {
		    
			var numbers = [];
			var number = 0;
		    // We have a connection - a socket object is assigned to the connection automatically
		    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
		    
		    // Add a 'data' event handler to this instance of socket
		    sock.on('data', function(data) {
		        
		        console.log('DATA ' + sock.remoteAddress + ': ' + data);
		        var message = JSON.parse(data)
		        switch(message.Codigo){

		        	case '100':
		        		var json = {
		        			'Codigo': '101',
		        			'IDJuego': '231',
		        		};
		        		// var message = new Buffer(json);
				        sock.write(JSON.stringify(json));
				        break;

				    case '102':
				    	
	    		    	var countCard = message.NroCartones;
	    		    	var cards = [];
	    		    	for (var i = 0; i < countCard; i++) {				    		
	    	    			var card = []
	    	    			var min, max = 0;
	    		    		for (var j = 1; j <= 5; j++) {
	    		    			var row = []
	    		    			min = max + 1
	    		    			max = 15 * j;
	    		    			var count = 0
    			    			while(count < 5) {
    			    				var number = getRandomInt(min, max);
    			    				if( !(_.contains(row,number)) ){
    				    				row.push(number);
    				    				count += 1;
    			    				};
    			    			};
	    		    			card.push(row)
	    		    			if (j == 3){
	    		    				row[2] = null
	    		    			}
	    		    			// console.log(row)
	    		    		};
	    		    		cards.push({
	    		    			'IDCarton': i,
	    	    				'Numeros': card,
	    		    		})
	    		    	};
	    		    	var json = {
	    		    		'Codigo':'103',
	    		    		'cartones': cards
	    		    	};	

				    	sock.write(JSON.stringify(json));

				    	break;

		        	default:
		        }
		        // Write the data back to the socket, the client will receive it as data from the server
		        
		    });

			setInterval(function(){

				// console.log(numbers);
				do{

					number = getRandomInt(1,75);

				}while(_.contains(numbers,number));


				numbers.push(number);
				// console.log(numbers);

				json = {
					'Codigo':'308',
					'NroJugada':quantity,
					'Numero':number,
					'IDJuego':'4'
				};

				quantity = quantity + 1;

				sock.write(JSON.stringify(json));
				console.log("Numero:"+json.Numero);

				// network.serverUDP(json, port);		
			},3000)
		    
		    // Add a 'close' event handler to this instance of socket
		    sock.on('close', function(data) {
		        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
		    });
		    
		}).listen(PORT, HOST);
};

tcp('127.0.0.1', 10022);

// Envio cada segundo el broadcast con la partida
var json = {
	'Codigo': 105,	
	'ip': '127.0.0.1',
	'sala': '1',
	'maxPersonas': '4',
	'maxCartones': '3'	
};
setInterval(function(){
	var message = new Buffer(JSON.stringify(json));
	network.serverUDP(json, 10022);	
	console.log('envipo')	;
},5000)

