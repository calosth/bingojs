
network.udp.on('message',function(message,remote){
	console.log("Mensaje = " + message)
	$('#jaj').text(message)
});

network.udp.bind(41234);