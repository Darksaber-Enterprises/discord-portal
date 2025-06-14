import React from 'react';
import Navbar from '../components/navbar';

const Resources = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0f11 0%, #1a2d2d 100%)',
        color: 'var(--text-light)',
        padding: '100px 20px 20px', // padding top for fixed navbar
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Navbar />
      <div style={{ maxWidth: 800, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Resources</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Welcome to the Resources page. Here you can find helpful links and documents.
        </p>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <a
              href="https://discord.com/developers/docs/intro"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
            >
              Discord Developer Docs
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <a
              href="https://reactjs.org/docs/getting-started.html"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
            >
              React Documentation
            </a>
          </li>
          <li>
            <a
              href="https://axios-http.com/docs/intro"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
            >
              Axios HTTP Client
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Resources;
