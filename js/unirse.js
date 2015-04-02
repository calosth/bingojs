
var IPes = [];
var playerName = '';
var net = require('net');

var dgram = require('dgram');
var clienteUDP = dgram.createSocket('udp4');

global.myIP = function(){ 

	var os = require('os');
	var ifaces = os.networkInterfaces();
	return ifaces.en1[1].address;

 }();

console.log(global.myIP);


var templates = {
	'available': _.template( $('script.availableTemplate').html() )
};

var conexionInicio = function(ip, port){
	var HOST = ip;
	var PORT = port;

	var client = new net.Socket();

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

		try{ var mensaje = JSON.parse(data); }
		catch(err){ console.log(err); }

		try{
			if(mensaje.COD == 101){
				global.IDJuego = mensaje.IDJUEGO;
				window.location.href = "jugarCliente.html";
			}
		}catch(err){ console.log(err); }

	});
};

clienteUDP.on('message',function(message,remote){


	try{mensaje = JSON.parse(message);}
	catch(err){console.log(err);}

	try{
		if( mensaje.COD == 105 ){

			if( ! (_.contains(IPes,mensaje.IP)) ){

				$("#content-partidas").append( templates.available(mensaje) );
				IPes.push(mensaje.IP);
				$(".btn-join").on("click",function (){
					conexionInicio($(this).data("ip"), 10022);
				});
			}
		}
	}catch(err){console.log(err);}

});


$('#aceptarNombre').on('click',function(){

	if(! ($('#nombre').val() == '') ){
		playerName = $('#nombre').val();
	}

});


clienteUDP.bind(10022);
