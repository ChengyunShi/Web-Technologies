const express = require('express');
const router = express.Router();

const request = require('request');

const DARKSKY_API_KEY = "";

let FORECAST_URL = "https://api.darksky.net/forecast/"+DARKSKY_API_KEY;

router.get('*', (req, res)=>{

  const city = req.query.city;
  const longitude = req.query.longitude;
  const latitude = req.query.latitude;
  const time = req.query.time;

  let responseJson = {}
  responseJson['city'] = city;

  const url = FORECAST_URL + "/" + latitude + "," + longitude + "," + time;
  console.log(url);
  request(url, (error, response, body) => {
    const obj = JSON.parse(body);
    responseJson['temperature'] = obj['currently']['temperature'];
    responseJson['summary'] = obj['currently']['summary'];
    responseJson['icon'] = obj['currently']['icon'];
    responseJson['precipIntensity'] = obj['currently']['precipIntensity'];
    responseJson['precipProbability'] = obj['currently']['precipProbability'];
    responseJson['windSpeed'] = obj['currently']['windSpeed'];
    responseJson['humidity'] = obj['currently']['humidity'];
    responseJson['visibility'] = obj['currently']['visibility'];

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(responseJson);
  })

});

module.exports = router;
