// callback.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Component that handles redirect from Discord OAuth and processes tokens
const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the URL hash fragment after OAuth redirect (e.g., #access_token=...)
    const hash = window.location.hash.substring(1); // Remove the '#' symbol
    const params = new URLSearchParams(hash);

    // Get the OAuth token values
    const accessToken = params.get('access_token');
    const tokenType = params.get('token_type');
    const expiresIn = params.get('expires_in');

    if (accessToken) {
      // Store OAuth tokens in localStorage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('token_type', tokenType);
      localStorage.setItem('expires_in', expiresIn);

      // Navigate to the home page after successful login
      navigate('/home');
    } else {
      console.error('No access token found in URL fragment.');
    }
  }, [navigate]);

  // Temporary message while processing login
  return <p>Logging in...</p>;
};

export default Callback;