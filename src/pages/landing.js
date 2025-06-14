// landing.js

import React from 'react';

// Environment variables for Discord OAuth setup
const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID;
const redirectUri = process.env.REACT_APP_DISCORD_REDIRECT_URI;

// Construct Discord OAuth URL
const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=identify`;

// Landing page component where users start and login via Discord
const Landing = () => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
    <h1>Welcome to the Darksaber Portal</h1>
    <a href={discordOAuthUrl} style={{ padding: '10px 20px', backgroundColor: '#2cb2b2', borderRadius: '5px', color: '#070605' }}>
      Login with Discord
    </a>
  </div>
);

export default Landing;