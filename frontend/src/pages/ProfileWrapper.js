import React, { useEffect, useState } from 'react';
import Profile from './profile';

export default function ProfileWrapper() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setError('No access token found. Please log in.');
      setLoading(false);
      return;
    }

    fetch('/api/discord/user', {
      headers: {
        Authorization: `Bearer ${token}`, // Fix template literal here
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return <Profile userData={userData} />;
}
