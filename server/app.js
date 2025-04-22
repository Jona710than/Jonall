// server/app.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/api/auth/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token', null, {
      params: {
        client_key: process.env.CLIENT_KEY,
        client_secret: process.env.CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = response.data.data.access_token;
    res.send(`<h2>Login Successful! Your access token is: ${accessToken}</h2>`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('TikTok Login Failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
