
var IPes = [];
var playerName = '';
var os = require('os');
var ifaces = os.networkInterfaces();
global.myIP = ifaces.en1[1].address;

var templates = {

	'available': _.template( $('script.availableTemplate').html() )

};

var conexionInicio = function(ip, port){

	var HOST = ip;
	var PORT = port;

	var client = new network.net.Socket();

	var json = {

		'COD':100,
		'IP':global.myIP,
		'CLIENTE':playerName,

	};

	global.IPserver = ip;

	var mensaje = JSON.stringify(json);
	
	client.connect(PORT, HOST, function() {

		client.write(mensaje);

	});

	client.on('data', function(data){

		var mensaje = JSON.parse(data);

		if(mensaje.COD == 101){

			// client.destroy();
			window.location.href = "jugarCliente.html";

		}

	});

};

network.udp.on('message',function(message,remote){

	mensaje = JSON.parse(message);

	if( mensaje.COD == 105 ){

		if( ! (_.contains(IPes,mensaje.IP)) ){

			$("#content-partidas").append( templates.available(mensaje) );

			IPes.push(mensaje.IP);

			$(".btn-join").on("click",function (){

				conexionInicio($(this).data("ip"), 10022);

			});
		}
	}

});


$('#aceptarNombre').on('click',function(){

	if(! ($('#nombre').val() == '') ){
		playerName = $('#nombre').val();
	}

});


network.udp.bind(10022);
