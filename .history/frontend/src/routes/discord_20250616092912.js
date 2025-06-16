// routes/discord.js
// Express route that retrieves Discord user info from Discord API
// Requires authorization bearer token from client (Discord OAuth token)

const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/user', async (req, res) => {
  try {
    // Extract bearer token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Request user info from Discord API using OAuth token
    const response = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Send back Discord user info as JSON
    res.json(response.data);
  } catch (err) {
    // Log error and send generic failure response
    console.error('Discord API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch Discord user info' });
  }
});

module.exports = router;
