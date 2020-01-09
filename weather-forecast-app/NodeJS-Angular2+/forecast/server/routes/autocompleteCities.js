const express = require('express');
const router = express.Router();

const request = require('request');

const GOOGLE_API_KEY = "";

const AUTOCOMPLETE_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

router.get('*', (req, res)=>{
  let autocompleteRequest = {
    url: AUTOCOMPLETE_URL,
    method: 'GET',
    qs: {
      input: req.query.input,
      types: '(cities)',
      language: 'en',
      key: GOOGLE_API_KEY
    }
  }

  request(autocompleteRequest, (error, response, body) => {
    const obj = JSON.parse(body);
    const json = {};
    json['city'] = [];
    json['description'] = [];
    for(let i=0; i<obj['predictions'].length && i<5; i++)
    {
        json['city'].push(obj['predictions'][i]['structured_formatting']['main_text']);
        json['description'].push(obj['predictions'][i]['description']);
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(json);
  })

});

module.exports = router;
