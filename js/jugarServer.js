
// Assets

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// Variable de cartones enviados
var cards = [];
var payers = [];
var numbers = [];
var intervalCantarjugada
// Calcular Hash de IP del servidor
var md5 = require('MD5');
var hashIP = md5(global.ip);

var port = 10022; // <<< -- cambiar a configuracion global

// var sound = require('sound.js')


var player = new Audio()
player.src = 'sounds-882-solemn.mp3';
player.play();


var templates = {
	'number':  _.template( $('script.Numbers').html() ),
	'players':  _.template( $('script.Players').html() )
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
		        switch(message.COD){
		        	case 100:
		        		var json = {
		        			'COD': 101,
		        			'IDJUEGO': hashIP
		        		};
		        		// var message = new Buffer(json);
				        sock.write(JSON.stringify(json));
				        message.cards = []
				        payers.push(message)
				        // Rendereo al cliente en la interfaz
				        // $('#players').append(templates.players(players));
				        break;
				    case 102:
				    	var countCard = message.NROCARTONES;
				    	for (var i = 0; i < countCard; i++) {				    		
			    			var card = [];
			    			var min, max = 0;
				    		for (var j = 1; j <= 5; j++) {
				    			var row = [];
				    			min = max + 1;
				    			max = 15 * j;
				    			var count = 0;
				    			while(count < 5) {
				    				var number = getRandomInt(min, max + 1);
				    				if( !(_.contains(row,number)) ){
					    				row.push(number);
					    				count += 1;
				    				};
				    			};
				    			card.push(row)
				    			if (j == 3){
				    				row[2] = 0;
				    			}
				
				    		};
					    	var json = {
					    		'COD':103,
					    		'IDCARTON': md5(card),
					    		'NUMEROS': card
					    	};	
					    	// console.log(json);
					    	// Guardar el carton del jugador
					    	for (int w=0; w < players.length, w++){
						    	if(sock.remoteAddress === players[w].IP ){
						    		players[w].cards = card
						    	}	
					    	}

					    	sleep(50);

					    	var variable = JSON.stringify(json);
					    	console.log(variable);
					    	sock.write(variable); 				    	
					    	
					    	// formatear json para almacenar
					    	if( delete json['COD'] )
						    	cards.push(json)


				    	}

				    	break;

			    	case 306:
			    		var json = {
			    			'COD': 302,
			    			'IDJUEGO': hashIP
			    		};
			    		network.multicast(json);
			    		
			    		clearInterval(intervalCantarjugada);

			        	if(message.IDJUEGO === hashIP ){
			        		// recorrer los cartones que he enviado
			        		for (card in cards){ 
			        			if( card.IDCARTON === message.IDCARTON ){
			        				// comprobar matriz
			        				$('#alert').removeClass('hidden');
			        				// Bingo acceptado
			        				if(true){
			        					var json = {
			        						'COD': 307,
			        						'IDJUEGO': hashIP,
			        						'TIPOBINGO': tipoBingo,
			        						'CLIENTE': cliente
			        					};
			        					network.multicast(json);
			        				}
			        			}
			        		}
			        	}
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

tcp(global.ip, port);


var intervalSendBroadcast
// Envio cada segundo el broadcast con la partida
function sendBroadcast() {
	var json1 = {
		'COD': 105,
		'IP': global.ip,
		'SALA': global.infoJuego.nombrePartida,
	};
	intervalSendBroadcast = setInterval(function(){
		network.serverUDP(json1, port, '255.255.255.255');		
	},1000);
}

sendBroadcast()

function cantar(){
	// Variable de ID de intervalo de jugada

	// Empezar Envio de cartones
	$("#btn-empezar").on("click",function(){

		clearInterval(intervalSendBroadcast);
		var quantity = 1;


		// Anunciando inicio de juego
		var json = {
				'COD': 300,
				'IPJUEGO': hashIP									// <<<-----------
			};
	    network.multicast(json);

		var number;

		// Intervalo de tiempo que canta numeros
		intervalCantarjugada = setInterval(function(){

			// if(numbers.length === 74)
				// return

			do{
				number = getRandomInt(1,76);
			}while( _.contains(numbers,number) );
			numbers.push(number)
			var json = {
				'COD':308,
				'IPJUEGO': hashIP,									// <<<-----------
				'NROJUGADA':quantity,
				'NUMERO': number
			};

			quantity = quantity + 1;
			network.multicast(json);
			$('ul.nav.nav-pills').append(templates.number(json));

		},500);


	});


	$("#btn-FinalizarPartida").on('click',function(){
		clearInterval(intervalCantarjugada);
		json = {
			'COD': 301,
			'IDJUEGO': hashIP
		};
		network.multicast(json);
		window.location.href = "index.html";
		// Implementa el envio en multicast de fin de juego
	});

}

cantar();

function BingoCantado(){
	// Bingo cantado
	var json = {
			'COD': 302,
			'IPJUEGO': hashIP									// <<<-----------
		};
	network.multicast(json)
}

function BingoAceptado(){
	// Bingo aceptado
	var json = {
			'COD': 307,
			'IPJUEGO': hashIP,
			'TIPOBINGO': 1,
			'CLIENTE': 'cliente'								// <<<-----------
		};
	network.multicast(json)
}