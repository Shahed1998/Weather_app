const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
require('dotenv').config();
const port = 3000;
const app = express();

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  const city_name = req.body.city_name;
  const api_key = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}&units=metric`;

  console.log(req.body);

  https.get(url, (response) => {
    console.log(response.statusCode);
    if (response.statusCode === 200) {
      response.on('data', (d) => {
        const result = JSON.parse(d);
        const weatherIcon = result.weather[0].icon;
        const temperature = result.main.temp;
        const cityName = result.name;
        const description = result.weather[0].description;
        const imgUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
        const imgDesc = `Weather icon`;
        //   console.log(result);

        res.write(
          `
        
        <title>Result</title>
        <style>
          *{
            font-size:150%;
          }
          body{
            background-color:#bee5d3;
            color:#ff4646;
            text-align:center;
            
          }
         
        </style>
        
       
        <h1>The temperature of ${cityName} is <br/>${temperature} degrees celsius</h1><br/>
        <img src="${imgUrl}" alt="${imgDesc}"/>
        <p>The weather is ${description}</p>

         <form action="/app.js" method="post">
              <button type="submit">Return to main page</button>
          </form>
    `
        );

        // res.write(`<img src="${imgUrl}" alt="${imgDesc}"/>`);
        res.send();
      });
    } else {
      res.sendFile(__dirname + '/failure.html');
    }
  });
});

app.post('/failure.html', (req, res) => {
  res.redirect('/');
});

app.post('/app.js', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || port, () => {
  console.log(`App running at port ${port}`);
});
