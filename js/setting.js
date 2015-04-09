global.portUPD 			= 10022;
global.portTCP 			= 10022;
global.portMulticast 	= 5554;
global.ipBroadcast 		= '255.255.255.255';
global.ipMulticast 		= '239.1.2.3';

$('#submit').on('click',function(){
	global.portUPD 			= $("#puertoUDP").text();
	global.portTCP 			= $("#puertoTCP").text();
	global.ipBroadcast 		= $('#ipBroadcast').text();
	global.ipMulticast 		= $('#ipMulticast').text();
	global.portMulticast 	= $('#portMulticast').text();
});

