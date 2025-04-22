const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/auth/tiktok/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('Authorization code missing');

  try {
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token', null, {
      params: {
        client_key: process.env.CLIENT_KEY,
        client_secret: process.env.CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, open_id } = response.data.data;
    console.log('Access Token:', access_token);
    console.log('Open ID:', open_id);

    res.send('TikTok Login successful! 🎉');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Failed to exchange token');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
