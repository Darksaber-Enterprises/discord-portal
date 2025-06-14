import React from 'react';
import Navbar from '../components/navbar';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('discord_user'));
  const nickname = localStorage.getItem('discord_nickname'); // Your stored server nickname

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Your Profile</h2>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img 
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
              alt="avatar" 
              width={80} 
              style={{ borderRadius: '50%' }} 
            />
            <div>
              <p>
                <strong>Username:</strong> {nickname ? nickname : `${user.username}#${user.discriminator}`}
              </p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          </div>
        ) : <p>User not logged in.</p>}
      </div>
    </div>
  );
};

export default Profile;
