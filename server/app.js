const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
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

    const userInfo = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { display_name, avatar_url } = userInfo.data.data.user;

    await User.findOneAndUpdate(
      { open_id },
      { open_id, display_name, avatar_url, access_token },
      { upsert: true, new: true }
    );

    res.send('TikTok Login successful! 🎉');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Failed to exchange token');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});