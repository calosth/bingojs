// Assets
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var port = 41234;


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
				    	var countCard = message.NroCartones;
				    	var cards = [];
				    	for (var i = 0; i < countCard; i++) {				    		
			    			var card = []
			    			var min, max = 0;
				    		for (var j = 1; j <= 5; j++) {
				    			var row = []
				    			min = max + 1
				    			max = 15 * j
				    			for (var k = 1; k <=5; k++) {
				    				var number = getRandomInt(min, max);
				    				row.push(number)
				    			};
				    			card.push(row)
				    			if (j == 3){
				    				row[2] = null
				    			}
				    			console.log(row)
				    		};
				    		cards.push({
				    			'IDCarton': i,
			    				'Numeros': card,
				    		})
				    	};
				    	var json = {
				    		'code':'103',
				    		'cartones': cards
				    	};			

				    	console.log(json.cartones)	    	
				    	break;
		        	default:
		        }
		        // Write the data back to the socket, the client will receive it as data from the server
		        
		    });
		    
		    // Add a 'close' event handler to this instance of socket
		    // sock.on('close', function(data) {
		    //     console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
		    // });
		    
		}).listen(PORT, HOST);
};

tcp(global.ip, 10022);

// Envio cada segundo el broadcast con la partida
var json = {
	'code': 105,
	'contenido': {
		'ip': global.ip,
		'sala': global.infoJuego.nombrePartida,
		'maxPersonas': global.infoJuego.maximoDePersonas,
		'maxCartones': global.infoJuego.maximoDeCartones,
	},
};
setInterval(function(){
	network.serverUDP(json, port);	
},1000)




