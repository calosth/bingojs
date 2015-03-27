
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
var players = [];
var numbers = [];
var intervalCantarjugada
// Calcular Hash de IP del servidor
// var md5 = require('MD5');
// var hashIP = md5(global.ip);

var port = 10022; // <<< -- cambiar a configuracion global



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
	        try {
		        var message = JSON.parse(data)
		    }
		    catch (err){
		    	console.log("ERROR");
		    }
	        switch(message.COD){
	        	case 100:
	        		var json = {
	        			'COD': 101,
	        			'IDJUEGO': hashIP
	        		};
	        		// var message = new Buffer(json);
			        sock.write(JSON.stringify(json));
			        message.cards = []
			        players.push(message)
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
				    	
				    	// var idCarton = md5(card)
				    	var json = {
				    		'COD':103,
				    		'IDCARTON': idCarton,
				    		'NUMEROS': card
				    	};	



				    	sleep(50);

				    	var variable = JSON.stringify(json);
				    	sock.write(variable); 				    	
				    	
				    	// formatear json para almacenar
				    	if( delete json['COD'] )
					    	cards.push(json);

				    	// Guardar el carton del jugador
				    	for (var w in players){
					    	if(sock.remoteAddress == players[w].IP ){
						    		players[w].cards.push(json)
					    	}	
				    	}

			    	}

			    	break;

		    	case 306:
		    		var json = {
		    			'COD': 302,
		    			'IDJUEGO': hashIP
		    		};
		    		network.multicast(json);
		    		
		    		// Detener el canto de numeros 
		    		clearInterval(intervalCantarjugada);

		        	if(message.IDJUEGO == hashIP ){
		        		// recorrer los cartones que he enviado
		        		for (i in cards){ 
		        			if( cards[i].IDCARTON == message.IDCARTON ){
		        				
		        				
		        				// comprobar matriz
		        				var bingoAceptado = comprobarBingo(cards[i].NUMEROS, numbers);
		        				console.log(bingoAceptado);
		        				if(bingoAceptado){

		        					// Encontrar cliente ganador
		        					var client = ''
			        				for(var w in players){
			        					for(var j in players[w].cards){
				        					if(players[i].cards[j].IDCARTON == message.IDCARTON){
				        						client = players[i].CLIENTE
				        					}
				        				}
			        				} 
		        					// Hay ganador 
		        					var json = {
		        						'COD': 307,
		        						'IDJUEGO': hashIP,
		        						'TIPOBINGO': bingoAceptado,
		        						'CLIENTE': client
		        					};
		        					network.multicast(json);
		        					console.log("--------------------------------------------------------");
		        					console.log(json);
		        					console.log("--------------------------------------------------------");
		        				} else {
		        					// Hacer si el bingo no se acepto
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

		},1000);


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
};

function BingoAceptado(){
	// Bingo aceptado
	var json = {
			'COD': 307,
			'IPJUEGO': hashIP,
			'TIPOBINGO': 1,
			'CLIENTE': 'cliente'								// <<<-----------
		};
	network.multicast(json)
};


var comprobarBingo = function(card, numerosCantados){

	var matrizBinaria = [[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0]];

	// Marcar matriz matrizBinaria
	for (var i = 0; i < numerosCantados.length; i++){
		for( j in card ){
			posicion = _.indexOf( card[j], numerosCantados[i] );
			if( posicion  != -1 ){
				matrizBinaria[j][posicion] = 1;
			}
		}
	};

	var rowHorizontal = [];
	var rowDiagonalPrincipal = [];
	var rowDiagonalSecundaria = [];	
	//Si esta lleno
	var verificacion = 1; 

	//Verifica si la matriz binaria esta llena de 1
	for( i in matrizBinaria )
		verificacion = verificacion && !( _.contains( matrizBinaria[i], 0 ) );

	if(verificacion)
		return 1; // Carton llegno

	for(var item in matrizBinaria) {
		var rowVertical = [];
		
		// Verificacion horizontal
		if(!( _.contains( matrizBinaria[item], 0 )))
			return 2; //Bingo horizontal
		
		for(var j=0; j < 5; j++){

			// Comprobar bingo vertical
			if( matrizBinaria[j][item] == 1 )
				rowVertical.push(1);
			
			if (item == j){
				if( matrizBinaria[item][j] == 1 )
					rowDiagonalPrincipal.push(1);
			}

			if(item == ( (j-4) * -1)){
				if( matrizBinaria[item][j] == 1 )
					rowDiagonalSecundaria.push(1);
			}

		}
		// Verificacion vertical
		if(!( _.contains( rowVertical, 0 )) && rowVertical.length == 5 )
			return 3; // bingo vertical
	}


	// Verificacion diagonal
	if( ( !( _.contains( rowDiagonalPrincipal, 0 )) && rowDiagonalPrincipal.length == 5 ) || (!( _.contains( rowDiagonalSecundaria, 0 )) && rowDiagonalSecundaria.length == 5 ) ) 
		return 4; // bingo diagonal
	
	return false
}
