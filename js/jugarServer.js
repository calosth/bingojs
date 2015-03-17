// Assets
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var templates = {
	'number':  _.template( $('script.Numbers').html() )
};

var port = 10022;


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

				    	sock.write(JSON.stringify(json)); 	
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
var json1 = {
	'code': 105,
	'ip': global.ip,
	'sala': global.infoJuego.nombrePartida,
	'maxPersonas': global.infoJuego.maximoDePersonas,
	'maxCartones': global.infoJuego.maximoDeCartones,
};
var intervalSendBroadcast = setInterval(function(){
	network.serverUDP(json1, port, '255.255.255.255');		
},1000);

// Variable de ID de intervalo de jugada
var intervalCantarjugada
// Empezar Envio de cartones
$("#btn-empezar").on("click",function(){

	clearInterval(intervalSendBroadcast);

	var dgram = require('dgram');
	var server = dgram.createSocket('udp4');	 
	var multicastAddress = '239.1.2.3';
	var multicastPort = 5554;
	var quantity = 1;

	server.bind(multicastPort, '0.0.0.0',function(){
		server.addMembership(multicastAddress);
		server.setMulticastTTL(128);
		server.setBroadcast(true);
	});

	// Anunciando inicio de juego
	var json = {
			'code':'300',
			'IDJuego':4,									// <<<-----------
		};
    var message = new Buffer(JSON.stringify(json));
    server.send(message, 0, message.length, multicastPort, multicastAddress, function(err){
    	if (err) console.log(err);
	    console.log("Sent " + message + " to the wire...");
    });


	var numbers = [];
	var number;

	// Intervalo de tiempo que canta numeros
	intervalCantarjugada = setInterval(function(){

		do{
			number = getRandomInt(1,75);
		}while( _.contains(numbers,number) );
		numbers.push(number)
		var json = {
			'code':'308',
			'NroJugada':quantity,
			'Numero': number,
			'IDJuego':'4',									// <<<-----------
		};

		quantity = quantity + 1;
		$('ul.nav.nav-pills').append(templates.number(json));

	    var message = new Buffer(JSON.stringify(json));
	    server.send(message, 0, message.length, multicastPort, multicastAddress, function(err){
	    	if (err) console.log(err);
		    console.log("Sent " + message + " to the wire...");
	    });

	},3000);


});


$("#btn-FinalizarPartida").on('click',function(){
	clearInterval(intervalCantarjugada);
});


