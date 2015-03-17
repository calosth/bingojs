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
			'Codigo':'102',
			'NroCartones':boardNumber
		};

		client.write(JSON.stringify(json));

	});

	client.on('data', function(data){

		var message = JSON.parse(data);
		
		switch(message.Codigo){

			//Cuando recibe los cartones
			case '103':

				for(i in message.cartones)
					$('#boards-content').append(templates.board(message.cartones[i]));
				
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

		switch(message.Codigo){

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
