import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Client, GatewayIntentBits } from 'discord.js';

// Load .env from current folder (no '../.env')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const CHANNEL_ID = '1194366546278109305';

// Check for required environment variables
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !BOT_TOKEN || !GUILD_ID) {
  console.error('Missing environment variables');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Discord client init
const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

discordClient.login(BOT_TOKEN).then(() => {
  console.log('Discord bot logged in');
}).catch(err => {
  console.error('Discord bot failed to login:', err);
});

// Routes
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// OAuth2 Token exchange
app.post('/api/discord/exchange', async (req, res) => {
  const { code } = req.body;

  console.log('Received code for exchange:', code);

  if (!code) return res.status(400).json({ error: 'Authorization code is required' });

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    // scope removed here - not needed in token exchange
  });

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.access_token) {
      console.log('Token exchange successful');
      res.json({ access_token: tokenData.access_token });
    } else {
      console.error('Token exchange failed:', tokenData);
      res.status(400).json({ error: 'Token exchange failed', details: tokenData });
    }
  } catch (err) {
    console.error('Exchange error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch Discord user + roles
app.get('/api/discord/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid auth header' });

    const accessToken = authHeader.split(' ')[1];
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) return res.status(401).json({ error: 'Failed to fetch user' });
    const user = await userRes.json();

    const memberRes = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });

    if (!memberRes.ok) return res.status(404).json({ error: 'User not found in guild' });
    const member = await memberRes.json();

    const rolesRes = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/roles`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });

    const allRoles = await rolesRes.json();

    const userRoles = member.roles.map(id => {
      const role = allRoles.find(r => r.id === id);
      return role
        ? { id: role.id, name: role.name.replace(/[^\x20-\x7E]/g, '').trim() }
        : { id, name: '(Unknown Role)' };
    }).filter(r => !/^[-_]{3,}/.test(r.name));

    res.json({ user, roles: userRoles.sort((a, b) => a.name.localeCompare(b.name)) });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Extracted leadership application handler
async function leadershipApplicationHandler(req, res) {
  try {
    const { username, userId, avatarUrl, leadershipPosition, reason } = req.body;

    if (!username || !avatarUrl || !leadershipPosition || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const cleanUsername = username.split('#')[0];

    const embed = {
      title: `${cleanUsername}'s Leadership Application`,
      author: { name: 'Darksaber Portal Assistant' },
      thumbnail: { url: avatarUrl },
      color: 0x0077ff,
      fields: [
        { name: 'Leadership Position', value: leadershipPosition },
        { name: 'Reason', value: reason },
      ],
      timestamp: new Date(),
    };

    const discordRes = await fetch(`https://discord.com/api/channels/${CHANNEL_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.error('Failed to send message:', errText);
      return res.status(500).json({ error: 'Failed to send message to Discord' });
    }

    res.json({ message: 'Leadership application sent successfully' });
  } catch (err) {
    console.error('Error sending application:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Route uses extracted handler directly
app.post('/api/applications/leadership', leadershipApplicationHandler);

// Alias route calls handler after adjusting request body
app.post('/api/submit-leadership-app', (req, res) => {
  req.body.leadershipPosition = req.body.position;
  leadershipApplicationHandler(req, res);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
