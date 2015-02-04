
var os = require('os');
var ifaces = os.networkInterfaces();

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
	
	var nombrePartida = $("#nombrePartida").val();
	var maximoDePersonas = $("#maximoPersonas").val();
	var maximoDeCartones = $("#maximoCartones").val();

	var json = {
		'code': 105,
		'contenido': {
			'ip': ifaces.en1[1].address,
			'sala': nombrePartida,
			'maxPersonas': maximoDePersonas,
			'maxCartones': maximoDeCartones
		},
	};

	if(nombrePartida==''){
		$("#nombrePartida").parent().addClass("has-error");
	}
	else if(maximoDePersonas==''){		
		$("#maximoPersonas").parent().addClass("has-error");
	}
	else if(maximoDeCartones==''){		
		$("#maximoCartones").parent().addClass("has-error");
	}
	else{
		network.serverUDP(json, port);		
	}	

});