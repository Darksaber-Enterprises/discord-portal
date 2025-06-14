import React, { useState } from 'react';
import Navbar from '../components/navbar';

const SubmitRequest = () => {
  const options = [
    {
      name: 'Rapid Response Force',
      description: 'A team deployed quickly to handle urgent incidents or emergencies.',
    },
    {
      name: 'Operational Security',
      description: 'Ensures protection of you and your Org members during your operations.',
    },
    {
      name: '3R (Rearm, Repair, Refuel)',
      description: 'Support services to rearm, fix, and refuel your ships to keep you going.',
    },
    {
      name: 'Cargo Transportation',
      description: 'Logistics service for moving cargo and supplies securely and efficiently.',
    },
    {
      name: 'Towing Services',
      description: 'Assistance with towing your ship safely to your desired location.',
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleOptionClick = (option) => {
    alert(`You selected: ${option}`);
    // future: navigate or open form
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0f11 0%, #1a2d2d 100%)',
        color: 'var(--text-light)',
        paddingTop: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingLeft: '20px',
        paddingRight: '20px',
        position: 'relative',
      }}
    >
      <Navbar />

      <h2 style={{ textAlign: 'center' }}>Select a Request Type</h2>
      <p style={{ textAlign: 'center' }}>Please choose one of the following:</p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginTop: '20px',
          position: 'relative',
        }}
      >
        {options.map(({ name, description }, index) => (
          <div
            key={name}
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button
              onClick={() => handleOptionClick(name)}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--background-dark)',
                border: 'none',
                borderRadius: '8px',
                padding: '15px 25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                minWidth: '200px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--color-primary)')
              }
            >
              {name}
            </button>

            {/* Tooltip */}
            {hoveredIndex === index && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',          // tooltip now appears below button
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: 'var(--text-light)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  width: '220px',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  boxShadow: '0 0 6px rgba(0, 0, 0, 0.6)',
                  zIndex: 10,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmitRequest;
