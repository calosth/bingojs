global.myIP = function(){
	var os = require('os');
	var ifaces = os.networkInterfaces();

	try{
		if (os.platform() === 'darwin'){
			return ifaces.en1[1].address;
		} else{
			var alias = 0;
			var ip;
			Object.keys(ifaces).forEach(function(ifname){

				ifaces[ifname].forEach(function(iface){

					if ('IPv4' !== iface.family || iface.internal !== false){
						return;
					}
					if (alias==0){
						ip = iface.address;
					}
					 alias++;

				});
			});
			return ip;
		}
	}catch(err){
		console.log(err);
	}


}(); 
// Closure que retorna la IP que se posee
// global.ip es el IP que se usará cuando sea un servidor
// globa.myIP es el IP que se usará cuando sea un cliente
console.log(global.myIP);
global.ip = global.myIP;
window.portUPD 			= 10022;
window.portTCP 			= 10022;
window.portMulticast 	= 5554;
window.ipBroadcast 		= '255.255.255.255';
window.ipMulticast 		= '239.1.2.3';
