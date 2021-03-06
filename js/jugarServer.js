var cards 	= []; 											// Array de objetos de cartones enviados
var players = []; 											// Array de objetos de jugadores en partida
var numbers = []; 											// Array de numeros enviados
var idCount = 0;											// Numero de jugada *TEMP
// var portTCP = global.portTCP; 								// Puerto TCP 
// var portUDP = global.portUDP; 								// Puerto UDP
// var ipMulticast = global.ipMulticast;
// var ipBroadcast = global.ipBroadcast;
// var portMulticast = global.portMulticast;
var portTCP = 10022; 								// Puerto TCP 
var portUDP = 10022; 								// Puerto UDP
var ipMulticast = '239.1.2.3';
var ipBroadcast = '255.255.255.255';
var portMulticast = 5554;
var intervalCantarjugada; 									// ID de intervalo de cantar jugada
var intervalSendBroadcast;									// ID de intervalo de envio anunciar jugada
var md5 = require('MD5');			
var hashIP = md5(global.ip);								// Hash de IP del servidor
var net = require('net');
var templates = {
	'number':  _.template($('script.Numbers').html()),		// Templates de lista numeros cantados
	'players':  _.template($('script.Players').html())		// Templates de tabla de jugadores
};


var functionsAssets = {
	getRandomInt: function (min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},

	sleep: function (milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
				  break;
			}
		}
	}
}

// var tcp = function (ip, port){
// 	var HOST = ip;
// 	var PORT = port;


net.createServer(function(sock) {
        
    sock.on('data', function(data) {
        
        try {
	        var message = JSON.parse(data);
	    }
	    catch (err){
	    	console.log("ERROR");
	    }

	    try {
	        switch(message.COD){
	        	case 100:
	        		var json = {
	        			'COD': 101,
	        			'IDJUEGO': hashIP
	        		};
	        		// var message = new Buffer(json);
			        sock.write(JSON.stringify(json));
			        message.cards = [];
			        players.push(message);
			        // console.log(message);
			        // Rendereo al cliente en la interfaz
			        $('#players').html(templates.players(players));
			        break;
			    case 102:
			    	for (var i = 0; i < message.NROCARTONES; i++) {				    		
		    			var card = [];
		    			var min, max = 0;
			    		for (var j = 1; j <= 5; j++) {
			    			var row = [];
			    			min = max + 1;
			    			max = 15 * j;
			    			var count = 0;
			    			while(count < 5) {
			    				var number = functionsAssets.getRandomInt(min, max + 1);
			    				if(!(_.contains(row,number))){
				    				row.push(number);
				    				count += 1;
			    				};
			    			};
			    			card.push(row);
			    			if (j == 3){
			    				row[2] = 0;
			    			}
			
			    		};

				    	idCount = md5(card.toString());;

				    	var json = {
				    		'COD':103,
				    		'IDCARTON': String(idCount),
				    		'NUMEROS': card
				    	};	

				    	functionsAssets.sleep(200);
				    	sock.write(JSON.stringify(json)); 				    	
				    	
				    	// formatear json para almacenar
				    	if( delete json['COD'] )
					    	cards.push(json);

				    	// Guardar el carton del jugador
				    	for (var w = 0 ; w < players.length; w++) {
					    	if(sock.remoteAddress === players[w].IP ){
						    		players[w].cards.push(json)
					    	}	
				    	}

			    	}
			    	$('#players').html(templates.players(players));

			    	break;

		    	case 306:
		    		var json = {
		    			'COD': 302,
		    			'IDJUEGO': hashIP
		    		};
		    		network.multicast(json, ipMulticast, portMulticast);
		    		
		    		// Detener el canto de numeros 
		    		clearInterval(intervalCantarjugada);

		        	if(message.IDJUEGO == hashIP ){
		        		// recorrer los cartones que he enviado
        				// console.log(message.IDJUEGO);
		        		for (i in cards){ 
		        			if( cards[i].IDCARTON == message.IDCARTON ){
		        				
		        				
		        				// comprobar matriz
		        				var bingoAceptado = comprobarBingo(cards[i].NUMEROS, numbers);
		        				if(bingoAceptado){

		        					// Encontrar cliente ganador
		        					var client = ''
			        				for(var w in players){
			        					for(var j in players[w].cards){
				        					if(players[w].cards[j].IDCARTON == message.IDCARTON){
				        						client = players[w].CLIENTE
				        					}
				        				}
			        				} 
			        				toastr.success('Hay Ganador!, ' + client,'Info');
		        					// Hay ganador 
		        					var json = {
		        						'COD': 307,
		        						'IDJUEGO': hashIP,
		        						'TIPOBINGO': bingoAceptado,
		        						'CLIENTE': client
		        					};
		        					network.multicast(json,ipMulticast, portMulticast);
		        				} else {
		        					toastr.error('Bingo no aceptado, ' + client,'Info');
		        				}

		        			}
		        		}
		        	}
	        	default:
	        }
	    }
	    catch(err){
	    	toastr.error('Ha ocurrido un error con el cliente ' + sock.remoteAddress + ' '+ err,'Error');
	    	toastr.options.timeOut = 3000;
	    }
        // Write the data back to the socket, the client will receive it as data from the server
        
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('end', function(data) {
    //     console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    	console.log(data);
    	for (var w in players){
	    	if(sock.remoteAddress == players[w].IP ){
			    	players.slice(w,1);
	    	}	
    	}
    	$('#players').html(templates.players(players));	   

    	sock.destroy();

    });

	sock.on('error', function(err){
		if (err.code == 'EADDRINUSE') { 
			console.log('alguien se salio');
			sock.destroy();
		}
	});

    
}).listen(portTCP, global.ip);
// };

// Envio cada segundo el broadcast con la partida
var sendBroadcast = function() {
	var json = {
		'COD': 105,
		'IP': global.ip,
		'SALA': global.infoJuego.nombrePartida
	};
	intervalSendBroadcast = setInterval(function(){
		// console.log(portUDP);
		network.serverUDP(json, portUDP, ipBroadcast);	
	}, 1000);
}

var cantar = function (){

	// Empezar envio de cartones
	$('#btn-empezar').on('click',function(){
		
		var quantity = 1;	// cantidad de cartones enviados
		var number;			// numero a cantar
		// Anunciando inicio de juego
		var json = {
				'COD': 300,
				'IPJUEGO': hashIP									
			};

	    network.multicast(json, ipMulticast, portMulticast); // Enviar anuncio de inicio de juego

		$(this).addClass('disabled');
		$(this).off();
		
		clearInterval(intervalSendBroadcast); 


		intervalCantarjugada = setInterval(function(){

			if(numbers.length === 75)
				return

			do{
				number = functionsAssets.getRandomInt(1,76);
			}while( _.contains(numbers,number) );

			numbers.push(number)

			var json = {
				'COD':308,
				'IPJUEGO': hashIP,									
				'NROJUGADA':quantity,
				'NUMERO': number
			};

			quantity = quantity + 1;

			network.multicast(json, ipMulticast, portMulticast); // Envio del numero cantado

			$('ul.nav.nav-pills').append(templates.number(json)); // Refresco IU

		},1000);

	});


$("#btn-FinalizarPartida").on('click',function(){
		clearInterval(intervalCantarjugada);
		json = {
			'COD': 301,
			'IDJUEGO': hashIP
		};
		network.multicast(json, ipMulticast, portMulticast);
		window.location.href = "index.html";
	});

}

var BingoCantado = function (){
	// Bingo cantado
	var json = {
			'COD': 302,
			'IPJUEGO': hashIP
		};
	network.multicast(json, ipMulticast, portMulticast)
};

var BingoAceptado = function (){
	// Bingo aceptado
	var json = {
			'COD': 307,
			'IPJUEGO': hashIP,
			'TIPOBINGO': 1,
			'CLIENTE': 'cliente'
		};
	network.multicast(json, ipMulticast, portMulticast);
};

var comprobarBingo = function(card, numerosCantados){

	var rowHorizontal 			= [];
	var rowDiagonalPrincipal 	= [];
	var rowDiagonalSecundaria 	= [];	
	var verificacion 			= 1; 	//Si esta lleno
	var matrizBinaria 			= [[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0]];

	// Marcar matriz matrizBinaria
	for (var i = 0; i < numerosCantados.length; i++){
		for( j in card ){
			posicion = _.indexOf( card[j], numerosCantados[i] );
			if( posicion  != -1 ){
				matrizBinaria[j][posicion] = 1;
			}
		}
	};

	//Verifica si la matriz binaria esta llena de 1
	for(var i =0; i < 5; i++ )
		verificacion = verificacion && !( _.contains( matrizBinaria[i], 0 ) );

	if(verificacion)
		return 1; // Carton llegno

	for(var item in matrizBinaria) {
		var rowHorizontal = [];
		
		// Verificacion horizontal
		if(!( _.contains( matrizBinaria[item], 0 )))
			return 3; //Bingo horizontal
		
		for(var j=0; j < 5; j++){

			// Comprobar bingo vertical
			if( matrizBinaria[j][item] == 1 )
				rowHorizontal.push(1);
			
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
		if(!( _.contains( rowHorizontal, 0 )) && rowHorizontal.length == 5 )
			return 2; // bingo vertical
	}


	// Verificacion diagonal
	if( ( !( _.contains( rowDiagonalPrincipal, 0 )) && rowDiagonalPrincipal.length == 5 ) || (!( _.contains( rowDiagonalSecundaria, 0 )) && rowDiagonalSecundaria.length == 5 ) ) 
		return 4; // bingo diagonal
	
	return false
}

// tcp(global.ip, portTCP);
sendBroadcast();
cantar();
