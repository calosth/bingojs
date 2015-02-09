
var IPes = [];

network.udp.on('message',function(message,remote){
	// console.log("Mensaje = " + message) 
	mensaje = JSON.parse(message);

	if( mensaje.code == '105' ){

		if( ! (_.contains(IPes,mensaje.contenido.ip)) ){

			var html = '<div class="col-xs-6 col-md-3">';
			html = html + '<a href="#" class="thumbnail">';
			html = html + '<h3>'+ mensaje.contenido.sala +'</h3>';
			html = html + '<p> IP: ' + mensaje.contenido.ip + '<p>';
			html = html + '<p> Máximo Cartones: ' + mensaje.contenido.maxCartones + '</p>';
			html = html + '<button type="button" class="btn btn-success btn-sm">Unirse</button></a></div>';

			$("#content-partidas").append(html);

			IPes.push(mensaje.contenido.ip);

		}
		// console.log(mensaje);
	}

});

network.udp.bind(41234);
