import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import colors from '../colors';

const LeadershipApplicationModal = ({ user, onClose, onShowPopup }) => {
  const [position, setPosition] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!position) {
      setError('Please select a leadership position.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide your reason.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/submit-leadership-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          avatarUrl: user.avatarUrl,
          position,
          reason,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit application.');

      // Instead of alert and navigation:
      onClose(); // close modal
      onShowPopup(); // show confirmation popup

      // You can still navigate after acknowledgment if you want:
      // navigate('/resources');

    } catch (err) {
      setError(err.message || 'Submission failed.');
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#222',
          padding: 24,
          borderRadius: 12,
          width: 360,
          color: '#eee',
          boxShadow: '0 0 15px rgba(0,0,0,0.9)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Leadership Application</h2>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Select Position:
          <select
            value={position}
            onChange={e => setPosition(e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              marginTop: 4,
              borderRadius: 6,
              border: '1px solid #555',
              backgroundColor: '#111',
              color: '#eee',
            }}
          >
            <option value="">-- Select a position --</option>
            <option value="Defender Corps Commander">Defender Corps Commander</option>
            <option value="Industrial Corps Commander">Industrial Corps Commander</option>
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Why do you believe you are best for this job?
          <textarea
            rows={4}
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              marginTop: 4,
              borderRadius: 6,
              border: '1px solid #555',
              backgroundColor: '#111',
              color: '#eee',
              resize: 'vertical',
            }}
          />
        </label>

        {error && <p style={{ color: 'tomato' }}>{error}</p>}

        <button
  onClick={handleSubmit}
  disabled={submitting}
  style={{
    marginTop: 16,
    width: '100%',
    padding: '16px 0',
    backgroundColor: colors.primaryLight,
    border: 'none',
    borderRadius: 10,
    color: colors.primaryDark,
    fontWeight: 'bold',
    fontSize: '1.2rem',
    cursor: submitting ? 'not-allowed' : 'pointer',
    boxShadow: submitting ? 'none' : `0 0 12px ${colors.primaryLight}`,
    opacity: submitting ? 0.6 : 1,
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  }}
  onMouseEnter={e => {
    if (!submitting) {
      e.currentTarget.style.backgroundColor = '#fff';
      e.currentTarget.style.boxShadow = `0 0 20px ${colors.primaryLight}`;
    }
  }}
  onMouseLeave={e => {
    if (!submitting) {
      e.currentTarget.style.backgroundColor = colors.primaryLight;
      e.currentTarget.style.boxShadow = `0 0 12px ${colors.primaryLight}`;
    }
  }}
>
  {submitting ? 'Submitting...' : 'Submit Application'}
</button>

      </div>
    </div>
  );
};

// New Popup component
const SubmissionPopup = ({ onAcknowledge }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 30,
      right: 30,
      backgroundColor: colors.primaryLight,
      color: colors.primaryDark,
      padding: '16px 24px',
      borderRadius: 8,
      boxShadow: '0 0 15px rgba(0,0,0,0.3)',
      animation: 'fadeIn 0.5s ease forwards',
      zIndex: 10000,
      minWidth: 280,
      textAlign: 'center',
      userSelect: 'none',
    }}>
      <p style={{ margin: '0 0 12px', fontWeight: 'bold' }}>
        Your application has been submitted to the Executives for review.
      </p>
      <button
        onClick={onAcknowledge}
        style={{
          padding: '8px 20px',
          backgroundColor: colors.primaryDark,
          color: colors.primaryLight,
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Acknowledge
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const ResourceBox = ({ title, color, children, isApplication, onLeadershipClick }) => {
  const applicationBg = '#f7f7f7';

  return (
    <div
      style={{
        backgroundColor: isApplication ? applicationBg : color,
        color: isApplication ? colors.primaryDark : '#fff',
        borderRadius: 12,
        padding: 24,
        width: 280,
        boxShadow: isApplication
          ? `0 0 15px ${colors.primaryLight}66`
          : `0 0 12px ${color}aa`,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minHeight: 140,
        boxSizing: 'border-box',
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: '1.6rem',
          fontWeight: 'bold',
          textAlign: 'center',
          letterSpacing: '0.05em',
          color: isApplication ? colors.primaryDark : '#fff',
        }}
      >
        {title.toUpperCase()}
      </h3>
      <div style={{ flexGrow: 1, fontSize: '1rem' }}>
        {isApplication ? (
          <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
            {React.Children.map(children.props.children, (child, i) => {
              if (child.props.children === 'Leadership Applications') {
                return (
                  <li
                    key={i}
                    style={{
                      backgroundColor: applicationBg,
                      marginBottom: 10,
                      padding: '8px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      color: colors.primaryDark,
                      border: `1.5px solid ${colors.primaryLight}`,
                      userSelect: 'none',
                      transition: 'background-color 0.3s ease',
                    }}
                    onClick={onLeadershipClick}
                    onMouseEnter={e =>
                      (e.currentTarget.style.backgroundColor = colors.primaryLight + '33')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.backgroundColor = applicationBg)
                    }
                  >
                    {child}
                  </li>
                );
              }
              return (
                <li
                  key={i}
                  style={{
                    backgroundColor: applicationBg,
                    marginBottom: 10,
                    padding: '8px 12px',
                    borderRadius: 8,
                    color: colors.primaryDark,
                    border: `1.5px solid ${colors.primaryLight}`,
                    userSelect: 'none',
                  }}
                >
                  {child}
                </li>
              );
            })}
          </ul>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

const Resources = () => {
  const user = {
    username: 'TestUser#1234',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
  };

  const [showLeadershipModal, setShowLeadershipModal] = useState(false);
  const [showSubmissionPopup, setShowSubmissionPopup] = useState(false);

  const handleShowPopup = () => setShowSubmissionPopup(true);
  const handleAcknowledge = () => setShowSubmissionPopup(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0f11 0%, #1a2d2d 100%)',
        color: colors.textLight,
        padding: '100px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Navbar />
      <div
        style={{
          maxWidth: 960,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap',
          marginTop: 20,
        }}
      >
        <ResourceBox title="Defender Corps Resources" color={colors.primaryDark}>
          <p style={{ textAlign: 'center' }}>No resources available yet.</p>
        </ResourceBox>

        <ResourceBox title="Industrial Corps Resources" color={colors.alternate1}>
          <p style={{ textAlign: 'center' }}>No resources available yet.</p>
        </ResourceBox>

        <ResourceBox
          title="Applications"
          color={colors.primaryLight}
          isApplication
          onLeadershipClick={() => setShowLeadershipModal(true)}
        >
          <ul>
            <li>Shops Application</li>
            <li>Leadership Applications</li>
          </ul>
        </ResourceBox>
      </div>

      {showLeadershipModal && (
        <LeadershipApplicationModal
          user={user}
          onClose={() => setShowLeadershipModal(false)}
          onShowPopup={handleShowPopup}  // pass handler here
        />
      )}

      {showSubmissionPopup && <SubmissionPopup onAcknowledge={handleAcknowledge} />}
    </div>
  );
};

export default Resources;
