
var os = require('os');
var ifaces = os.networkInterfaces();

var port = 41234

$("#submit").on('click',function(){
	

	var nombrePartida = $("#nombrePartida").val()
	var maximoDePersonas = $("#maximoPersonas").val()
	var maximoDeCartones = $("#maximoCartones").val()

	var json = {
		'code': 105,
		'contenido': {
			'ip': ifaces.en1[1].address,
			'sala': nombrePartida,
		},
	}

	network.serverUDP(json,port);
});