//Cantidad de cartones que el cliente quiere
var boardNumber = '';

//Objeto que contiene a los templates
var templates = {
	'board': _.template( $('script.templateBoard').html() ),
	'number':  _.template( $('script.Numbers').html() )
};

var conexion = function(ip, port){

	var json = {};
	var HOST = ip;
	var PORT = port;

	var client = new network.net.Socket();

	client.connect(PORT, HOST, function(){

		multicast('239.1.2.3');

		//Apenas se conecte solicitará la cantidad de cartones
		json = {
			'code':'102',
			'NroCartones':boardNumber
		};

		message = JSON.stringify(json);

		client.write(message);

	});

	client.on('data', function(data){

		var message = JSON.parse(data);
		
		switch(message.code){

			//Cuando recibe los cartones
			case '103':

				for(i in message.cartones)
					$('#boards-content').append(templates.board(message.cartones[i]));
				
				break;

			//Cuando el servidor canta un número
			case '308':

				$('ul.nav.nav-pills').append(templates.number(message));
				$("."+message.Numero).addClass("info");

				break

			default:

		}

	});

};

var multicast = function(ip){

	// var HOST = ifaces.en1[1].address;

	var dgram = require('dgram');
	var socket = dgram.createSocket('udp4');
	 
	// var multicastAddress = '239.1.2.3';
	var multicastPort = 5554;
	 
	// socket.addMembership(multicastAddress);
	socket.bind(multicastPort, '0.0.0.0',function(){
		
		socket.setBroadcast(true);
		socket.setMulticastTTL(1);
		socket.addMembership(ip);

	});
	 
	socket.on("message", function ( data, rinfo ) {
		var message = JSON.parse(data);
		console.log(message);

		switch(message.code){

			//Cuando el servidor canta un número
			case '308':

				$('ul.nav.nav-pills').append(templates.number(message));
				$("."+message.Numero).addClass("info");

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
