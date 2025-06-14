import React from 'react';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0f11 0%, #1a2d2d 100%)',
        color: 'var(--text-light)',
        padding: '100px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Navbar />

      <button
        style={{
          marginTop: '20px',
          padding: '10px 30px',
          backgroundColor: 'var(--color-primary)',
          border: 'none',
          borderRadius: '6px',
          color: 'var(--background-dark)',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease',
          alignSelf: 'center',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = 'var(--color-primary)')
        }
        onClick={() => navigate('/submit-request')}
      >
        Submit a Request
      </button>

      <h1 style={{ marginTop: '40px', textAlign: 'center' }}>
        Welcome to the Dashboard
      </h1>
      <p style={{ textAlign: 'center' }}>
        This is your home page. More content will be coming soon.
      </p>
    </div>
  );
};

export default Home;