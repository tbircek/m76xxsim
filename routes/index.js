var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Recloser Simulator', 
                        author: 'Turgay Bircek',
                        description: 'Recloser simulator for Beckwith Electric Protection relays.',
                        keywords: 'recloser, simulator, protection relays, 52a, 52b, trip, close',
                        ver: 'v2018.6.6',
                        inputLabels: [ 'Input 1:', 'Input 2:' ],
                        outputLabels: [ 'Output 1:', 'Output 2:' ],
                        fiftyTwoAOptions: [ '52a Phases ABC', '52a Phase A', 'General' ],
                        fiftyTwoBOptions: [ '52b Phases ABC', '52b/69 Lockout ABC', '52b Phase A', 'General' ],
                        tripOptions: [ 'Trip ABC', 'Trip A' ],
                        closeOptions: [ 'Close ABC', 'Close A' ],
                        cbOptions: [ 'Close', 'Trip' ],
                        defaultValues: [ 0, 0, 10, 10 ]
                      });
});

module.exports = router;
