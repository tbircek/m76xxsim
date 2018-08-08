var Resources = require('../models/labelsModel');

// // Process user changes.
// exports.settings_update = function (req, res) {
// 	res.send('<p>NOT IMPLEMENTED: Input: ' + req.params.control +
// 		'<p>NOT IMPLEMENTED: value: ' + req.params.value); // +
// 	// '<p>NOT IMPLEMENTED: bodyParser: ' + req.body);	
// };

// INDEX page.
exports.index = function (req, res, next) {
	
	// Resources.find(function (err, resources) {
	// 	if (err) {return next(err);}
	//  //	debug('requested data: ' + resources);
		res.render('index', {
			title: 'Recloser Simulator',
			author: 'Turgay Bircek',
			description: 'Recloser simulator for Beckwith Electric Protection relays.',
			keywords: 'recloser, simulator, protection relays, 52a, 52b, trip, close',
			ver: 'v2018.6.14',
			inputLabels: ['Input 1:', 'Input 2:'],
			outputLabels: ['Output 1:', 'Output 2:'],
			fiftyTwoAOptions: ['52a Phases ABC', '52a Phase A', 'General'],
			fiftyTwoBOptions: ['52b Phases ABC', '52b/69 Lockout ABC', '52b Phase A', 'General'],
			tripOptions: ['Trip ABC', 'Trip A'],
			closeOptions: ['Close ABC', 'Close A'],
			cbOptions: ['Close', 'Trip'],
			defaultValues: [0, 0, 10, 10]
		});
	// });
};

// // Display list of all Books.
// exports.book_list = function (req, res, next) {

// 	Book.find({}, 'title author')
// 		.populate('author')
// 		.exec(function (err, list_books) {
// 			if (err) { return next(err); }
// 			//Successful, so render
// 			res.render('book_list', { title: 'Book List', book_list: list_books });
// 		});

// };