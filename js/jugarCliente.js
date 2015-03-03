var quantity = '';

var conexion = function(ip, port){

	var json = {};
	var HOST = ip;
	var PORT = port;

	var client = new network.net.Socket();

	client.connect(PORT, HOST, function(){

		//Apenas se conecte solicitará la cantidad de cartones
		json = {
			'code':'102',
			'NroCartones':quantity
		};

		message = JSON.stringify(json);

		client.write(message);

	});

	client.on('data', function(data){

		var message = JSON.parse(data);
		
		switch(message.code){

			//Cuando recibe los cartones
			case '103':

				for(i in message.cartones)

					console.log(message.cartones[i].Numeros[1][1]);
				
				break;

			default:

		}

	});

};


$('#aceptarNumero').on('click',function(){

	if(!($('#numero').val() == '')){
		quantity = $('#numero').val();
		conexion('127.0.0.1', 10022);
	}
	else{
		$('#numero').parent().addClass("has-error");
	}

});
