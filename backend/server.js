import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Client, GatewayIntentBits } from 'discord.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const {
  DISCORD_CLIENT_ID: CLIENT_ID,
  DISCORD_CLIENT_SECRET: CLIENT_SECRET,
  DISCORD_REDIRECT_URI: REDIRECT_URI,
  DISCORD_BOT_TOKEN: BOT_TOKEN,
  DISCORD_GUILD_ID: GUILD_ID,
} = process.env;

const CHANNEL_ID = '1194366546278109305';

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !BOT_TOKEN || !GUILD_ID) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

(async () => {
  try {
    await discordClient.login(BOT_TOKEN);
    console.log('Discord bot logged in');
  } catch (err) {
    console.error('Discord bot failed to login:', err);
    process.exit(1);
  }
})();

app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// OAuth2 token exchange endpoint
app.post('/api/discord/exchange', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Authorization code is required' });

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.access_token) {
      return res.json({ access_token: tokenData.access_token });
    } else {
      console.error('Token exchange failed:', tokenData);
      return res.status(400).json({ error: 'Token exchange failed', details: tokenData });
    }
  } catch (err) {
    console.error('Exchange error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Discord user info + roles in guild
app.get('/api/discord/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid auth header' });

    const accessToken = authHeader.split(' ')[1];
    // Fetch user info from Discord OAuth2
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) return res.status(401).json({ error: 'Failed to fetch user' });
    const user = await userRes.json();

    // Fetch guild member using Discord API
    const memberRes = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${user.id}`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    if (!memberRes.ok) return res.status(404).json({ error: 'User not found in guild' });
    const member = await memberRes.json();

    // Get roles from Discord client cache (faster than API call)
    const guild = discordClient.guilds.cache.get(GUILD_ID);
    let allRoles = [];
    if (guild) {
      allRoles = guild.roles.cache.map(r => ({ id: r.id, name: r.name }));
    } else {
      // fallback: fetch roles via API
      const rolesRes = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/roles`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
      });
      allRoles = await rolesRes.json();
    }

    // Filter and clean roles for user
    const userRoles = member.roles
      .map(id => {
        const role = allRoles.find(r => r.id === id);
        if (role) {
          // Clean role name: remove non-printable ascii + trim
          return { id: role.id, name: role.name.replace(/[^\x20-\x7E]/g, '').trim() };
        }
        return { id, name: '(Unknown Role)' };
      })
      .filter(r => !/^[-_]{3,}/.test(r.name)); // Remove roles that start with --- or ___ (likely hidden roles)

    res.json({
      user,
      roles: userRoles.sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Assign roles to user
app.post('/api/discord/assign-roles', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid auth header' });

  const accessToken = authHeader.split(' ')[1];
  const { roles } = req.body;

  if (!Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({ error: 'No roles provided' });
  }

  try {
    // Fetch user info
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) return res.status(401).json({ error: 'Failed to fetch user' });

    const user = await userRes.json();
    const userId = user.id;

    // Assign roles sequentially
    for (const roleId of roles) {
      const resRole = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${userId}/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      });

      if (!resRole.ok) {
        const text = await resRole.text();
        console.error(`❌ Failed to assign role ${roleId} to user ${userId}:`, resRole.status, text);
        return res.status(resRole.status).json({
          error: `Failed to assign role ${roleId}`,
          status: resRole.status,
          details: text,
        });
      }
    }

    res.json({ message: 'Roles assigned successfully' });
  } catch (err) {
    console.error('Error assigning roles:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove role from user
app.post('/api/discord/remove-role', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid auth header' });

  const accessToken = authHeader.split(' ')[1];
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ error: 'Role ID is required' });
  }

  try {
    // Fetch user info using OAuth token
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) return res.status(401).json({ error: 'Failed to fetch user' });
    const user = await userRes.json();
    const userId = user.id;

    // Remove role from guild member
    const resRole = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${userId}/roles/${role}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    });

    if (!resRole.ok) {
      const text = await resRole.text();
      console.error(`❌ Failed to remove role ${role} from user ${userId}:`, resRole.status, text);
      return res.status(resRole.status).json({
        error: `Failed to remove role ${role}`,
        status: resRole.status,
        details: text,
      });
    }

    res.json({ message: 'Role removed successfully' });
  } catch (err) {
    console.error('Error removing role:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Leadership Application Handler (send embed message)
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

app.post('/api/applications/leadership', leadershipApplicationHandler);
app.post('/api/submit-leadership-app', (req, res) => {
  req.body.leadershipPosition = req.body.position;
  leadershipApplicationHandler(req, res);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
