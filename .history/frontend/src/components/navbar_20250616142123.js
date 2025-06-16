import React from 'react';
import { NavLink } from 'react-router-dom';
import colors from '../colors';

const Navbar = ({ hasAuthorizedRole }) => {
  console.log('Navbar hasAuthorizedRole:', hasAuthorizedRole);

  const linkStyle = {
    padding: '10px 20px',
    color: colors.textLight,
    textDecoration: 'none',
    fontWeight: 'bold',
  };

  const activeStyle = {
    color: colors.primary,
  };

  return (
    <nav
      style={{
        width: '100%',
        backgroundColor: colors.backgroundDark,
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
      <NavLink
        to="/home"
        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
      >
        Home
      </NavLink>

      {hasAuthorizedRole && (
        <>
          <NavLink
            to="/requests"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Requests
          </NavLink>
          <NavLink
            to="/resources"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Resources
          </NavLink>
        </>
      )}

      <NavLink
        to="/profile"
        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
      >
        Profile
      </NavLink>
    </nav>
  );
};

export default Navbar;