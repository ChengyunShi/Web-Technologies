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
      q: req.query.state+' State Seal',
      cx: SEARCH_ENGINE_ID,
      imgSize: 'huge',
      imgType: 'news',
      num: 1,
      searchType: 'image',
      key: GOOGLE_API_KEY
    }
  }

  request(sealRequest, (error, response, body) => {
    const obj = JSON.parse(body);
    let responseJson = {};
    responseJson['seal'] = obj['items'][0]['link'];
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(responseJson);
  })

});

module.exports = router;
