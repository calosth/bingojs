
$('#submit').on('click',function(){
	global.portUPD = $("#puertoUDP").text()
	global.portTCP = $("#puertoTCP").text()

	console.log(global.portUPD)
	console.log(global.portTCP)

})

