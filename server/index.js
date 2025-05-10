const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  FRONTEND_URI,
} = process.env;

app.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email', 'streaming', 'user-read-playback-state', 'user-modify-playback-state'];
  const authUrl = 'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scopes.join(' '),
      redirect_uri: REDIRECT_URI,
    }).toString();
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.redirect(`${FRONTEND_URI}?access_token=${tokenRes.data.access_token}`);
  } catch (err) {
    res.send('Error retrieving access token');
  }
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));
