const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();

const currentWeather = require('./server/routes/currentWeather');
const autocompleteCities = require('./server/routes/autocompleteCities');
const getSeal = require('./server/routes/getSeal');
const getLocation = require('./server/routes/getLocation');
const dailyWeather = require('./server/routes/dailyWeather');
const getPhotos = require('./server/routes/getPhotos');

app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/forecast')));
app.use('/currentWeather', currentWeather);
app.use('/autocompleteCities', autocompleteCities);
app.use('/getSeal', getSeal);
app.use('/getLocation', getLocation);
app.use('/dailyWeather', dailyWeather);
app.use('/getPhotos', getPhotos);

app.get('*', (req, res)=>{

  res.sendFile(path.join(__dirname, 'dist/forecast/index.html'))

});

app.listen(8081, (req, res)=>{

});
