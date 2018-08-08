var Resources = require('../models/resourcesModel');

exports.index_page = function (req, res, next) {
  // Resources.
  //   find({}).
  //   select({ _id: 0, name: 0 }).  // 0 = filter out, 1 = filter in. --- https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
  //   // slice('value').
  //   populate({
  //     path:'values', 
  //     select:'value'}).
  //   exec().
  //   then((results) => {
  //     // if (err) return next(err);
  //     console.log(results);
      res.render('index', {
        // data: results,
        title: 'Recloser Simulator +db', // 
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
//     });
};
