$('#submit').on('click',function(){
	global.portUPD		= Number($("#puertoUDP").val());
	global.portTCP		= Number($("#puertoTCP").val());
	global.ipBroadcast	= $('#ipBroadcast').val();
	global.ipMulticast		= $('#ipMulticast').val();
	global.portMulticast	= Number($('#portMulticast').val());
});
