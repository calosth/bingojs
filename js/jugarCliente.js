//Cantidad de cartones que el cliente quiere
var boardNumber = '';
var message;


var arregloCartones = []; // Arreglo de objetos que permite manejar los cartones del usuario
var matrizReferencia = []; // Matrices que ayudan a verificar los aciertos

var net = require('net');

var prueba = [];

//Objeto que contiene a los templates
var templates = {
	'board': _.template( $('script.templateBoard').html() ),
	'number':  _.template( $('script.Numbers').html() )
};

var conexion = function(ip, port){

	var json = {};
	var HOST = ip;
	var PORT = port;
	var carton;
	var client = new net.Socket();


	client.connect(PORT, HOST, function(){

		var zeros = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
		
		multicast('239.1.2.3');

		//Apenas se conecte solicitará la cantidad de cartones
		json = {
			'COD':'102',
			'NROCARTONES':boardNumber
		};

		client.write(JSON.stringify(json));

		for( var i = 0; i < boardNumber; i++ )
			matrizReferencia.push( zeros );

		// console.log( matrizReferencia.length );

	});

	client.on('data', function(data){


		message = JSON.parse( data );
				
		switch(message.COD){

			//Cuando recibe los cartones
			case '103':
				carton = message;

				console.log( message );
				$('#boards-content').append(templates.board(message));
		
				if( delete carton['COD'] )
					arregloCartones.push( carton );


				break;			

			default:

		}

	});

};

var multicast = function(ip){

	var dgram = require('dgram');
	var socket = dgram.createSocket('udp4');
	var multicastPort = 5554;
	 
	// socket.addMembership(multicastAddress);
	socket.bind(multicastPort, '0.0.0.0',function(){
		
		socket.setBroadcast(true);
		socket.setMulticastTTL(1);
		socket.addMembership(ip);

	});
	 
	socket.on("message", function ( data, rinfo ) {

		var message = JSON.parse(data);

		switch(message.COD){

			//Cuando el servidor indique que se comenzó a jugar
			case '300':

				$('modalComenzamos').modal('show').on('shown',function(){
					window.setTimeout(function(){
						$('modalComenzamos').modal('hide');
					}, 1500);
				});

				break;

			case '301':

				$('modalTermino').modal('show').on('shown',function(){
					window.setTimeout(function(){
						$('modalTermino').modal('hide');
					}, 1500);
				});

				window.location.href = 'index.html';

				break;

			//Cuando el servidor canta un número
			case '308':

				$('ul.nav.nav-pills').append(templates.number(message));
				$("."+message.NUMERO).addClass("info");

				// console.log( arregloCartones );

				verificarNumeroLlegado( parseInt(message.NUMERO,10) );

				// console.log( '-----------' );
				// for( i in matrizReferencia )
				// 	console.log( matrizReferencia[i] );

				break;

			default:

		}
	});

};

$('#aceptarNumero').on('click',function(){

	if(!($('#numero').val() == '')){
		boardNumber = $('#numero').val();
		conexion(global.IPserver, 10022);
	}
	else{
		$('#numero').parent().addClass("has-error");
	}

});

var verificarNumeroLlegado = function( numeroCantado ){

	var posicion;
	var carton;
	var matrizCeros;

	for( i in arregloCartones ){
		carton = arregloCartones[i].NUMEROS;
		for( j in carton ){
			posicion = _.indexOf( carton[j], numeroCantado );
			if( posicion  != -1 ){
				matrizReferencia[i][j][posicion] = 1;
			}
		}
	}

	console.log( '=============' );
	for (i in matrizReferencia)
		console.log( matrizReferencia[i] );

};






