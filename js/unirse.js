
var IPes = [];

var conexionInicio = function(ip, port){

	var HOST = ip;
	var PORT = port;

	var client = new network.net.Socket();

	var json = {

		'code':'100',
		'ip':ip,
		'cliente':'carlitosTQM',

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
	// console.log("Mensaje = " + message) 
	mensaje = JSON.parse(message);

	if( mensaje.code == '105' ){

		if( ! (_.contains(IPes,mensaje.contenido.ip)) ){

			var html = '<div class="col-xs-6 col-md-3">';
			html = html + '<a href="#" class="thumbnail">';
			html = html + '<h3>'+ mensaje.contenido.sala +'</h3>';
			html = html + '<p> IP: ' + mensaje.contenido.ip + '<p>';
			html = html + '<p> Máximo Cartones: ' + mensaje.contenido.maxCartones + '</p>';
			html = html + '<button type="button" class="btn btn-success btn-sm btn-join"';
			html = html + 'data-ip=' + mensaje.contenido.ip;
			html = html + '>Unirse</button></a></div>';

			$("#content-partidas").append(html);

			IPes.push(mensaje.contenido.ip);

			$(".btn-join").on("click",function (){

				conexionInicio($(this).data("ip"), 10022);

			});
		}
		// console.log(mensaje);
	}	

});



network.udp.bind(41234);
