var      boardNumber = ''; //Cantidad de cartones que el cliente quiere
var  arregloCartones = []; // Arreglo de objetos que permite manejar los cartones del usuario
var matrizReferencia = []; // Matrices que ayudan a verificar los aciertos

var net    =        require('net');
var _      = require('underscore');
var auxCliente;

//Objeto que contiene a los templates
var templates = {
	'board' :  _.template( $('script.templateBoard').html() ),
	'number':        _.template( $('script.Numbers').html() )
};

var conexion = function(ip, port){

	var json =   {};
	var HOST =   ip;
	var PORT = port;
	var carton, message;
	var referenciaNroCartones = 0;

	var client = new net.Socket(); 
	auxCliente = client;


	client.connect(PORT, HOST, function(){

		//Cuando se cree la conexión solicitará 
		//el nro de cartones que el cliente desea	

		json = {
			'COD':102,
			'NROCARTONES':boardNumber
		};
		client.write(JSON.stringify(json));


		for( var i = 0; i < boardNumber; i++ ){
			matrizReferencia.push([[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0]]);
		}

		multicast('239.1.2.3', client);

	});

	client.on('data', function(data){

		try{
			message = JSON.parse(data);
		}catch(err){
			console.log(err); 
		}

		try{
			switch(message.COD){

				//Cuando recibe los cartones
				case 103:
					carton = message;
					$('#boards-content').append(templates.board(message));
			
					if( delete carton['COD'] )
						arregloCartones.push( carton );

					break;			

				default:
					break;

			}
		} catch(err){
			console.log(err); 
		}

	});

};

var multicast = function(ip, clienteTCP){

	var         dgram = 		  require('dgram');
	var        socket = dgram.createSocket('udp4');
	var multicastPort = 	  5554;
	 
	socket.bind(multicastPort, '0.0.0.0', function(){
		
		socket.setBroadcast(true);
		socket.setMulticastTTL(1);
		socket.addMembership(ip);

	});
	 
	socket.on("message", function(data, rinfo){

		try{
			// Se intenta convertir lo llegado a un json
			var message = JSON.parse(data);
			console.log(message);
		}catch(err){
			console.log(err);
		}

		try{
			//Intenta decidir qué hacer con el mensaje llegado
			switch(message.COD){

				//Cuando el servidor indique que se comenzó a jugar
				case 300:
					toastr.success('Comenzamos!','Info');
					break;
				//Cuando el servidor finaliza la partida
				case 301:
					toastr.error('Ha finalizado la partida');
					clienteTCP.destroy();
					break;

				//Cuando el servidor canta un número
				case 308:
					//Se agregan a la pantalla de juego el número
					//que acaba de llegar
					$('ul.nav.nav-pills').append(templates.number(message));
					$("."+message.NUMERO).addClass("info");
					//Se verifica el número llegado con los cartones
					verificarNumeroLlegado( parseInt(message.NUMERO,10) );
					verificarCarton(clienteTCP, arregloCartones);

					break;

				default:
				/* --- */
				break;

			}
		} catch(err){
			// Ocurrió algún error 
			// Por lo general ocurre cuando se quiere acceder 
			// a un Key que no está en el json
			console.log(err);
		}
	});

};


var verificarNumeroLlegado = function(numeroCantado){

	var    posicion;
	var      carton;
	var matrizCeros;

	for (i in arregloCartones){
		carton = arregloCartones[i].NUMEROS;
		for (j in carton){
			posicion = _.indexOf(carton[j], numeroCantado);
			if (posicion  != -1){
				matrizReferencia[i][j][posicion] = 1;
			}
		}
	}

};

var verificarCarton = function(clienteTCP, arregloObjCartones){

	var    matrizBinaria = [];
	var             json = {};
	var objBingoCompleto = {};


	for (var i = 0; i < arregloObjCartones.length; i++){

		matrizBinaria = matrizReferencia[i];
		/// Se envia la matriz binaria que corresponde para verificar
		objBingoCompleto = bingoAlgunaGanancia(matrizBinaria, i); 

		//Si esta completo el carton
		//se le envía un mensaje al server de que se tiene
		//cartón lleno
		if (objBingoCompleto.verificacion){ 

			json = {
				'COD':306,
				'IDJUEGO':global.IDJuego,
				'IDCARTON':arregloObjCartones[i].IDCARTON,
				'NUMEROS':arregloObjCartones[i].NUMEROS,
				'ACIERTOS':objBingoCompleto.arrayAciertos
			}; 
			clienteTCP.write(JSON.stringify(json)); 
		}
	}
};

var bingoAlgunaGanancia = function(matrizBinaria, numeroCarton){

	//Si esta lleno
	var verificacionCompleto =  1;
	//Objeto que retornará con los datos del carton
	var   objetoVerificacion = {}; 
	//Array que estará en el objeto para retornar
	var        arrayAciertos = []; 

	//Verifica si la matriz binaria esta llena de 1
	for (i in matrizBinaria){
		verificacionCompleto = verificacionCompleto && !( _.contains( matrizBinaria[i], 0 ) );
	}

	// Si esta llena
	if (verificacionCompleto){ 
		for ( i in matrizBinaria ){
			for (j in matrizBinaria[i]){
				arrayAciertos.push(arregloCartones[numeroCarton].NUMEROS[i][j]);
			}
		}
		//Recorre todo el carton para agregar en un arreglo los aciertos (todos)

		objetoVerificacion = {

			'verificacion':verificacionCompleto,
			'arrayAciertos': arrayAciertos

		};
	}
	return objetoVerificacion; 
};