


network.udp.on('message',function(message,remote){
	console.log("Mensaje = " + message)
	$('#jaj').text(message)
});

network.udp.bind(41234);


// Envio cada segundo el broadcast con la partida
var json = {
	'code': 105,
	'contenido': {
		'ip': global.ip,
		'sala': global.infoJuego.nombrePartida,
		'maxPersonas': global.infoJuego.maximoDePersonas,
		'maxCartones': global.infoJuego.maximoDeCartones
	},
};
setInterval(function(){
	network.serverUDP(json, port);		
},1000)

var calls = []
