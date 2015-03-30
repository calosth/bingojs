//Cantidad de cartones que el cliente quiere
var boardNumber = '';
var arregloCartones = []; // Arreglo de objetos que permite manejar los cartones del usuario
var matrizReferencia = []; // Matrices que ayudan a verificar los aciertos
var net = require('net');
// var Player = require('player');

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
	var message;

	client.connect(PORT, HOST, function(){

		

		//Apenas se conecte solicitará la cantidad de cartones
		json = {
			'COD':102,
			'NROCARTONES':boardNumber
		};

		client.write(JSON.stringify(json));

		for( var i = 0; i < boardNumber; i++ )
			matrizReferencia.push( [[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0]] );


		multicast('239.1.2.3', client);
	});

	client.on('data', function(data){


		message = JSON.parse( data );
				
		switch(message.COD){

			//Cuando recibe los cartones
			case 103:
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

var multicast = function(ip, clienteTCP){

	var dgram = require('dgram');
	var socket = dgram.createSocket('udp4');
	var multicastPort = 5554;
	var message;
	 
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
			case 300:

				toastr.success('Comenzamos!','Info');

				// for(i in arregloCartones)
					console.log( arregloCartones );

				break;

			case 301:

				$('#modalTermino').modal('show').on('shown',function(){

					window.setTimeout(function(){
						$('modalTermino').modal('hide');
					}, 1500);
				});

				window.location.href = 'index.html';

				break;

			//Cuando el servidor canta un número
			case 308:

				$('ul.nav.nav-pills').append(templates.number(message));
				$("."+message.NUMERO).addClass("info");
				// document.getElementById(sonidoLlegoNumero).play();

				// console.log( arregloCartones );

				verificarNumeroLlegado( parseInt(message.NUMERO,10) );
				verificarCarton( clienteTCP, arregloCartones );

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

};

var verificarCarton = function( clienteTCP, arregloObjCartones ){

	var matrizBinaria = [];
	var json = {};
	var objBingoCompleto = {};


	for( var i = 0; i < arregloObjCartones.length; i++ ){

		matrizBinaria = matrizReferencia[i];
		console.log('-------');
		console.log( arregloObjCartones[i] );

		/// Se envia la matriz binaria que corresponde para verificar
		objBingoCompleto = bingoAlgunaGanancia(matrizBinaria, i); 

		//Si esta completo el carton
		if( objBingoCompleto.verificacion ){ 

			//Armo el objeto JSON
			json = {

				'COD':306,
				'IDJUEGO':global.IDJuego,
				'IDCARTON':arregloObjCartones[i].IDCARTON,
				'NUMEROS':arregloObjCartones[i].NUMEROS,
				'ACIERTOS':objBingoCompleto.arrayAciertos

			}; 

			//Envio el JSON
			clienteTCP.write( JSON.stringify( json ) ); 

		}

	}

};

var bingoAlgunaGanancia = function( matrizBinaria, numeroCarton ){

	//Si esta lleno
	var verificacionCompleto = 1;
	// var verificacionVertical = 1;
	//Objeto que retornará con los datos del carton
	var objetoVerificacion = {}; 
	//Array que estará en el objeto para retornar
	var arrayAciertos = []; 

	//Verifica si la matriz binaria esta llena de 1
	for( i in matrizBinaria )
		verificacionCompleto = verificacionCompleto && !( _.contains( matrizBinaria[i], 0 ) );

	// Si esta llena
	if(verificacionCompleto){ 
		for( i in matrizBinaria ){
			for(j in matrizBinaria[i]){
				arrayAciertos.push(arregloCartones[numeroCarton].NUMEROS[i][j]);
			}
		}
		//Recorre todo el carton para agregar en un arreglo los aciertos (todos)

		objetoVerificacion = {

			'verificacion':verificacionCompleto,
			'arrayAciertos': arrayAciertos

		};
	}
	// else{


	// 	for( i in matrizBinaria ){

	// 		if( !( _.contains( matrizBinaria[i], 0 ) ) ){
	// 			verificacionVertical = 1;
	// 		}

	// 	}

	// }
	
	//retorna el objeto 
	return objetoVerificacion; 

};






