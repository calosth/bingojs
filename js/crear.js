
var infoJuego = {}


var os = require('os');
var ifaces = os.networkInterfaces();
global.ip = ifaces.en1[1].address
var port = 41234;

$("#nombrePartida").on('click',function(){
	$('#nombrePartida').parent().removeClass("has-error");
});
$("#maximoPersonas").on('click',function(){
	$('#maximoPersonas').parent().removeClass("has-error");
});
$("#maximoCartones").on('click',function(){
	$('#maximoCartones').parent().removeClass("has-error");
});

$("#submit").on('click',function(){
	
 
	infoJuego.nombrePartida    = $("#nombrePartida").val();
	infoJuego.maximoDePersonas = $("#maximoPersonas").val();
	infoJuego.maximoDeCartones = $("#maximoCartones").val();	
	global.infoJuego = infoJuego

	var json = {
		'code': 105,
		'ip': global.ip,
		'sala': global.infoJuego.nombrePartida,
		'maxPersonas': global.infoJuego.maximoDePersonas,
		'maxCartones': global.infoJuego.maximoDeCartones,

	};

	console.log(json)

	if(infoJuego.nombrePartida==''){
		$("#nombrePartida").parent().addClass("has-error");
	}
	else if(infoJuego.maximoDePersonas==''){		
		$("#maximoPersonas").parent().addClass("has-error");
	}
	else if(infoJuego.maximoDeCartones==''){		
		$("#maximoCartones").parent().addClass("has-error");
	}
	else{
		network.serverUDP(json, port, '255.255.255.255');		
	}	

});