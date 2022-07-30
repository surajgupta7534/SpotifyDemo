const express = require('express');
const bodyParser = require('body-parser');

let token;
const axios = require("axios");
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.set('views','views')

const getApiToken = () => {
    const ClientId = '9cb8dace997142adbcc3fdf04c1e2d61';
    const ClientSecret = 'bc9eda3f78fc4759ad5525585bc9f7bd';

    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(ClientId + ':' +ClientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      token = tokenResponse.data.access_token;
      console.log(token);
    });
}

app.set('view enigne', 'ejs');

app.get('/', (req, res) =>{
    getApiToken();
    res.sendFile('./index.html', {root: __dirname })
})

app.post('/search', (req, res)=> {
    let alltracks;

    const endpoint = "https://api.spotify.com/v1/recommendations";
    const artists = req.body.song;
    const danceability = encodeURIComponent('0.9');
    axios(`${endpoint}?seed_artists=${artists}&target_danceability=${danceability}`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    })
    .then(playlistRes => {
        alltracks = playlistRes.data.tracks;
    })
    setTimeout(() => {
      res.render('index.ejs',{
        tracks:alltracks
      })
    }, 5000);
})

app.listen(3000, ()=> console.log(`App listening on localhost:3000`));