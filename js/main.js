global.myIP = function(){
	var os = require('os');

	try{
		if(os.platform() === 'darwin'){
			var ifaces = os.networkInterfaces();
			return ifaces.en1[1].address;
		}
	}catch(err){
		console.log(err);
	}

}(); // Closure que retorna la IP que se posee

// global.ip es el IP que se usará cuando sea un servidor
// globa.myIP es el IP que se usará cuando sea un cliente
global.ip = global.myIP;