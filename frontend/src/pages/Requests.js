// OnDuty.js

import React from 'react';
import Navbar from '../components/navbar';

// On-duty request management page
const OnDuty = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0f11 0%, #1a2d2d 100%)',
        color: 'var(--text-light)',
        padding: '100px 20px 20px', // Padding to offset fixed navbar
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Navbar />

      <h1 style={{ marginTop: '20px', textAlign: 'center' }}>On Duty</h1>
      <p style={{ textAlign: 'center' }}>
        Here you can manage your on-duty requests.
      </p>

      {/* Placeholder for on-duty content (e.g., forms, tables) */}
    </div>
  );
};

export default OnDuty;
