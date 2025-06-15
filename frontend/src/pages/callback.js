// callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');

    console.log('🔍 Full redirect URL:', window.location.href);
    console.log('🔑 Parsed code:', code);

    if (!code) {
      console.error('❌ No code found in the URL');
      navigate('/');
      return;
    }

    (async () => {
      try {
        const response = await fetch('http://localhost:5000/api/discord/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        let data;
        try {
          data = await response.json();
        } catch (jsonErr) {
          console.error('❌ Failed to parse response JSON:', jsonErr);
          navigate('/');
          return;
        }

        if (!response.ok) {
          console.error('❌ Server returned error status:', response.status, data);
          navigate('/');
          return;
        }

        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          console.log('✅ Access token stored');
          navigate('/home');
        } else {
          console.error('❌ Token exchange failed, missing access token:', data);
          navigate('/');
        }
      } catch (err) {
        console.error('❌ Fetch error during token exchange:', err);
        navigate('/');
      }
    })();
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', color: '#eee' }}>
      <h2>Completing sign-in...</h2>
    </div>
  );
};

export default Callback;
