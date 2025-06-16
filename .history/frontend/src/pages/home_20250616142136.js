import React from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../colors';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.backgroundDark} 0%, ${colors.primaryDark} 100%)`,
        color: colors.textLight,
        padding: '100px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <button
        style={{
          marginTop: '20px',
          padding: '10px 30px',
          backgroundColor: colors.primary,
          border: 'none',
          borderRadius: '6px',
          color: colors.backgroundDark,
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease',
          alignSelf: 'center',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = colors.primaryDark)
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = colors.primary)
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