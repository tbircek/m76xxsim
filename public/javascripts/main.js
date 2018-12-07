// script.
// 		function getOption() {
	
// 			var bOptions = document.querySelector('input[name="bOptions"]:checked').value; 
// 			var aOptions =document.querySelector('input[name="aOptions"]:checked').value;
// 			// var breakerModel = document.querySelector('input[name="bOptions"]:checked').value + ', ' + document.querySelector('input[name="aOptions"]:checked').value;
// 			var breakerModel = bOptions + ', ' + aOptions;
// 			var startPosition = document.querySelector('input[name="startPositions"]:checked').value;
		
// 			var operationMode = document.querySelector('input[name="tripOptions"]:checked').value + ' ' + document.querySelector('input[name="closeOptions"]:checked').value;
		
// 			var aOperationDelay = document.querySelector('input[name="aOperationDelay"]').value;
// 			var bOperationDelay = document.querySelector('input[name="bOperationDelay"]').value;
		
// 			// var settings_controller = require('../controllers/labelsController');
			
		
// 			// formData.set('title', 'Recloser Simulator');
// 			// formData.set('author', 'T. Bircek');
// 			// formData.set('description', 'Recloser simulator for Protection relays.');
// 			// keywords: 'recloser, simulator, protection relays, 52a, 52b, trip, close',
// 			// ver: 'v2018.12.05',
// 			// inputLabels: ['Input 1:', 'Input 2:'],
// 			// input1Checked: [true, false, false],
// 			// input2Checked: [true, false, false, false],
// 			// outputLabels: ['Output 1:', 'Output 2:'],
// 			// output1Checked: [true, false],
// 			// output2Checked: [true, false],
// 			// aOptions: ['52a Phases ABC', '52a Phase A', 'General'],
// 			// bOptions: ['52b Phases ABC', '52b/69 Lockout ABC', '52b Phase A', 'General'],
// 			// tripOptions: ['Trip ABC', 'Trip A'],
// 			// closeOptions: ['Close ABC', 'Close A'],
// 			// startPosition: ['Close', 'Trip'],
// 			// submitButton: 'Update',
// 			// infoButton: 'Monitor',
// 			// defaultValues: [50, 75]
		
// 			// formData.set('breakerModel', breakerModel);
// 			// formData.set('operationMode', operationMode);
// 			// formData.set('aOperationDelay', aOperationDelay);
// 			// formData.set('bOperationDelay', bOperationDelay);
		
// 			console.log('script');
// 			console.log('breakerModel: ' + breakerModel);
// 			console.log('startPosition: ' + startPosition);
// 			console.log('operationMode: ' + operationMode);
// 			console.log('aOperationDelay: ' + aOperationDelay);
// 			console.log('bOperationDelay: ' + bOperationDelay);
		
// 			var myHeaders = new Headers();
// 			var myInit = {
// 				method: 'PUT',
// 				headers: myHeaders,
// 				mode: 'cors',
// 				cache: 'default'
// 			};
		
// 			var message = '?breakerModel=' + breakerModel + '&startPosition=' + startPosition + '&operationMode=' + operationMode + '&aOperationDelay=' + aOperationDelay + '&bOperationDelay=' + bOperationDelay;
		
// 			// var myRequest = new Request('?' + name + '=' + value, myInit);
// 			var myRequest = new Request(message, myInit);
		
// 			// fetch(myRequest);
// 			fetch(myRequest)
// 		// 		.then(function(response) {
// 		// 			return settings_controller.settings_update_put(req, res);
// 		// 		})
// 		// 		.then(function(myJson) {
// 		// 			console.log(JSON.stringify(myJson));
// 		// 		});
// 		// }
// 			// script(src='../public/javascripts/main.js')
			
// 			// script.
// 			// 	document.addEventListener('DOMContentLoaded', function(event) {
// 			// 		console.log('DOM fully loaded and parsed');
				
			
			
// 				// }));
				
// 			}