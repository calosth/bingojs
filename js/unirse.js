
var IPes = [];
var playerName = '';

var templates = {

	'available': _.template( $('script.availableTemplate').html() )

};

var conexionInicio = function(ip, port){

	var HOST = ip;
	var PORT = port;

	var client = new network.net.Socket();

	var json = {

		'code':'100',
		'ip':ip,
		'cliente':playerName,

	};

	console.log(ip);
	global.IPserver = ip;

	var mensaje = JSON.stringify(json);
	
	client.connect(PORT, HOST, function() {

		client.write(mensaje);

	});

	client.on('data', function(data){

		var mensaje = JSON.parse(data);
		console.log(mensaje);

		if(mensaje.code == '101'){

			// client.destroy();
			window.location.href = "jugarCliente.html";

		}

	});

};

network.udp.on('message',function(message,remote){

	mensaje = JSON.parse(message);

	console.log(mensaje);

	if( mensaje.code == '105' ){

		if( ! (_.contains(IPes,mensaje.ip)) ){

			$("#content-partidas").append( templates.available(mensaje) );

			IPes.push(mensaje.ip);

			$(".btn-join").on("click",function (){

				conexionInicio($(this).data("ip"), 10022);

			});
		}
	}

});

var multicast = function(ip){

	// var HOST = ifaces.en1[1].address;
	var dgram = require('dgram');
	var client = dgram.createSocket('udp4');

	console.log('multicast');

	client.on('listening',function(){
		// client.setBroadcast(true);
		// client.setMulticastTTL(128);
		client.addMembership(ip,'192.168.0.104');
	});

	client.on('message',function(message,remote){
		var y = JSON.parse(message);

		console.log(y);
	});

	// client.bind(10022,ip);

};

multicast('230.185.192.108');

$('#aceptarNombre').on('click',function(){

	if(! ($('#nombre').val() == '') ){
		playerName = $('#nombre').val();
	}

});


network.udp.bind(10022);
