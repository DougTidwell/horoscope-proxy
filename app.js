// app.js - Ominous horoscope service
// noinspection JSUnresolvedReference

let express = require('express');
let app = express();
let port = process.env.PORT || 3000;

let kafkaesqueHost = process.env.KAFKAESQUE_HOST || "http://localhost:3020";
let ominousHost = process.env.OMINOUS_HOST || "http://localhost:3021";
let optimisticHost = process.env.OPTIMISTIC_HOST || "http://localhost:3022";
let planetaryMotionHost = process.env.PLANETARY_MOTION_HOST || "http://localhost:3022";
let targetHost = kafkaesqueHost;

let restler = require('restler');

let getHoroscope = function(req, res){
  const caseNeutralSign = req.params.sign.toLowerCase();
  console.log(`  Proxy getting horoscope for ${req.params.sign}`);

  let selector = Math.floor(Math.random() * 4);
  switch (selector) {
    case 0:
      targetHost = kafkaesqueHost;
      break;
    case 1:
      targetHost = ominousHost;
      break;
    case 2:
      targetHost = optimisticHost;
      break;
    case 3:
      targetHost = planetaryMotionHost;
      break;
  }

  restler.get(targetHost + "/horoscope/" + caseNeutralSign)
      .on('complete', function (result){
        res.set({'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers':
              'Origin, X-Requested-With, Content-Type, Accept',
          'Cache-Control': 'no-cache, no-store, must-revalidate'})
          .json(result);
      });
};

let handleCors = function(req, res) {
  res.header('Access-Control-Allow-Origin', req.header('Origin'));
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers',
      'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
}

app.route('/horoscope/:sign')
    .get(getHoroscope)
    .options(handleCors);

app.listen(port);
console.log(`Astrological proxy running on port ${port}...`);