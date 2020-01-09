const express = require('express');
const router = express.Router();

const request = require('request');

const GOOGLE_API_KEY = "";

const SEARCH_ENGINE_ID = "";

const SEARCH_SEAL_URL = "https://www.googleapis.com/customsearch/v1";

router.get('*', (req, res)=>{

  let sealRequest = {
    url: SEARCH_SEAL_URL,
    method: 'GET',
    qs: {
      q: req.query.city,
      cx: SEARCH_ENGINE_ID,
      imgSize: 'large',
      imgType: 'news',
      num: 8,
      searchType: 'image',
      key: GOOGLE_API_KEY
    }
  }

  request(sealRequest, (error, response, body) => {
    const obj = JSON.parse(body);
    let responseJson = {};
    responseJson['photos'] = [];
    for(let i=0; i<obj['items'].length; i++)
    {
      responseJson['photos'].push(obj['items'][i]['link']);
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(responseJson);
  })

});

module.exports = router;
