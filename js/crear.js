var infoJuego 	= {}
var os 			= require('os');
var ifaces 		= os.networkInterfaces();
global.ip 		= ifaces.en1[1].address;
var port = 41234;

$("#nombrePartida").on('click',function(){
	$('#nombrePartida').parent().removeClass("has-error");
});

$("#submit").on('click',function(){
	
	infoJuego.nombrePartida    = $("#nombrePartida").val();
	global.infoJuego = infoJuego;

	var json = {
		'COD': 105,
		'IP': global.ip,
		'SALA': global.infoJuego.nombrePartida,
	};

	console.log(json)

	if(infoJuego.nombrePartida==''){
		$("#nombrePartida").parent().addClass("has-error");
	} else {
		network.serverUDP(json, port, '255.255.255.255');		
	}	

});
