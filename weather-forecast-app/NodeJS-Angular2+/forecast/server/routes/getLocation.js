const express = require('express');
const router = express.Router();

const request = require('request');

const GOOGLE_API_KEY = "";

let CURRENT_LOCATION_URL = "https://maps.googleapis.com/maps/api/geocode/json";


router.get('*', (req, res)=>{
  // const street = req.query.street;
  // const city = req.query.city;
  // const state = req.query.state;
  const address = req.query.address;

  let locationRequest = {
      url: CURRENT_LOCATION_URL,
      method: 'GET',
      qs:{
        address: "["+address+"]",
        key: GOOGLE_API_KEY
      }
  }
  request(locationRequest, (error, response, body) => {
      const obj = JSON.parse(body);
      if(obj['results'].length!=0) {
        let responseJson = {};
        responseJson['longitude'] = obj['results'][0]['geometry']['location']['lng'];
        responseJson['latitude'] = obj['results'][0]['geometry']['location']['lat'];
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(responseJson);
      }
      else {
        res.status(500).send(body);
      }
    })

});

module.exports = router;
