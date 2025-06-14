// navbar.js

import React from 'react';
import { NavLink } from 'react-router-dom';

// Functional component to render the navigation bar
const Navbar = () => {
  // Style for each navigation link
  const linkStyle = {
    padding: '10px 20px',
    color: 'var(--text-light)',
    textDecoration: 'none',
    fontWeight: 'bold',
  };

  // Style for the active navigation link
  const activeStyle = {
    color: 'var(--color-primary)',
  };

  // Navigation bar container with styling
  return (
    <nav
      style={{
        width: '100%',
        backgroundColor: 'var(--background-dark)',
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        padding: '15px 0',
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
      }}
    >
      {/* Navigation links to different routes */}
      <NavLink to="/home" style={linkStyle} activeStyle={activeStyle}>
        Home
      </NavLink>
      <NavLink to="/on-duty" style={linkStyle} activeStyle={activeStyle}>
        On-Duty
      </NavLink>
      <NavLink to="/resources" style={linkStyle} activeStyle={activeStyle}>
        Resources
      </NavLink>
      <NavLink to="/profile" style={linkStyle} activeStyle={activeStyle}>
        Profile
      </NavLink>
    </nav>
  );
};

export default Navbar;
