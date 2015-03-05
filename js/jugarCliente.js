//Cantidad de cartones que el cliente quiere
var boardNumber = '';

//Objeto que contiene a los templates
var templates = {
	'board': _.template( $('script.templateBoard').html() ),
	'number':  _.template( $('script.Numbers').html() )
};

var conexion = function(ip, port){

	var json = {};
	var HOST = ip;
	var PORT = port;

	var client = new network.net.Socket();

	client.connect(PORT, HOST, function(){

		multicast('230.185.192.108');

		//Apenas se conecte solicitará la cantidad de cartones
		json = {
			'code':'102',
			'NroCartones':boardNumber
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
					$('#boards-content').append(templates.board(message.cartones[i]));
				
				break;

			//Cuando el servidor canta un número
			case '308':

				$('ul.nav.nav-pills').append(templates.number(message));
				$("."+message.Numero).addClass("info");

				break

			default:

		}

	});

};

var multicast = function(ip){

	// var HOST = ifaces.en1[1].address;

	network.udp.on('listening',function(){
		network.udp.setBroadcast(true);
		network.udp.setMulticastTTL(128);
		network.udp.addMembership(ip);
	});

	network.udp.on('message',function(message,remote){
		var y = JSON.parse(message);

		console.log(y);
	});

	network.udp.bind(41234);

};

$('#aceptarNumero').on('click',function(){

	if(!($('#numero').val() == '')){
		boardNumber = $('#numero').val();
		conexion(global.IPserver, 10022);
	}
	else{
		$('#numero').parent().addClass("has-error");
	}

});
