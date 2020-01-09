const express = require('express');
const router = express.Router();

const request = require('request');

const DARKSKY_API_KEY = "";

const FORECAST_URL = "https://api.darksky.net/forecast/" + DARKSKY_API_KEY;

router.get('*', (req, res) => {

  const city = req.query.city;
  let longitude = req.query.longitude;
  let latitude = req.query.latitude;

  let responseJson = {}
  responseJson['city'] = city;

  const url = FORECAST_URL + "/" + latitude + "," + longitude;
  request(url, (error, response, body) => {
    const obj = JSON.parse(body);
    if (obj['code'] == 400) res.status(500).send(body);
    else {
      responseJson['timezone'] = obj['timezone'];
      responseJson['temperature'] = Math.round(obj['currently']['temperature']);
      responseJson['icon'] = obj['currently']['icon'];
      responseJson['summary'] = obj['currently']['summary'];
      responseJson['humidity'] = Math.round(obj['currently']['humidity']*100);
      responseJson['pressure'] = obj['currently']['pressure'].toFixed(2);
      responseJson['windSpeed'] = obj['currently']['windSpeed'].toFixed(2);
      responseJson['visibility'] = obj['currently']['visibility'].toFixed(2);
      responseJson['cloudCover'] = Math.round(obj['currently']['cloudCover']*100);
      responseJson['ozone'] = obj['currently']['ozone'].toFixed(2);
      responseJson['precipitation:'] = obj['currently']['precipIntensity'].toFixed(2);

      responseJson['hourly'] = {};
      responseJson['hourly']['temperature'] = [];
      responseJson['hourly']['pressure'] = [];
      responseJson['hourly']['humidity'] = [];
      responseJson['hourly']['ozone'] = [];
      responseJson['hourly']['visibility'] = [];
      responseJson['hourly']['windSpeed'] = [];

      for (let i = 0; i < obj['hourly']['data'].length && i < 24; i++) {
        const hourData = obj['hourly']['data'][i];
        responseJson['hourly']['temperature'].push(Math.round(hourData['temperature']));
        responseJson['hourly']['pressure'].push(hourData['pressure'].toFixed(2));
        responseJson['hourly']['humidity'].push(Math.round(hourData['humidity']*100));
        responseJson['hourly']['ozone'].push(hourData['ozone'].toFixed(2));
        responseJson['hourly']['visibility'].push(hourData['visibility'].toFixed(2));
        responseJson['hourly']['windSpeed'].push(hourData['windSpeed'].toFixed(2));
      }

      responseJson['daily'] = {};
      responseJson['daily']['icon'] = obj['daily']['icon'];
      responseJson['daily']['summary'] = obj['daily']['summary'];
      responseJson['daily']['data'] = [];
      for (let i = 0; i < obj['daily']['data'].length; i++) {
        const dailyData = obj['daily']['data'][i];
        const dailyObj = {};
        dailyObj['time'] = dailyData['time'];
        dailyObj['temperatureLow'] = Math.round(dailyData['temperatureLow']);
        dailyObj['temperatureHigh'] = Math.round(dailyData['temperatureHigh']);
        responseJson['daily']['data'].push(dailyObj);
      }

      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(responseJson);
    }
  })
});

module.exports = router;
