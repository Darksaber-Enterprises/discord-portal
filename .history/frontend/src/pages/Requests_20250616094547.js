import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import colors from '../colors';

const SERVICE_ROLES = {
  Refueling: '1340563326144479283',
  Towing: '1340563283190747167',
  Cargo: '1340563113774420079',
  Construction: '1340563229151072387',
};

const RRF_ROLE = '1203993365826506752';
const ALL_ROLES = [RRF_ROLE, ...Object.values(SERVICE_ROLES)];

const Requests = ({ userToken: initialToken }) => {
  const [userToken, setUserToken] = useState(initialToken || '');
  const [panel, setPanel] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentIndustryRoles, setCurrentIndustryRoles] = useState([]);
  const [onDutyRrf, setOnDutyRrf] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const isOnDuty = onDutyRrf || currentIndustryRoles.length > 0;
  const hasServiceRoles = currentIndustryRoles.length > 0;

  useEffect(() => {
    const token = initialToken || localStorage.getItem('access_token');
    if (!token) {
      alert('You must be signed in to assign roles.');
      return;
    }

    setUserToken(token);
    fetchUserRoles(token);
  }, [initialToken]);

  const fetchUserRoles = async (token) => {
    try {
      const res = await fetch('/api/discord/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch user roles');
      const data = await res.json();

      const userRoleIds = new Set(data.roles.map(role => role.id));
      setOnDutyRrf(userRoleIds.has(RRF_ROLE));

      const industryRoles = Object.entries(SERVICE_ROLES)
        .filter(([, id]) => userRoleIds.has(id))
        .map(([name]) => name);

      setCurrentIndustryRoles(industryRoles.map(name => SERVICE_ROLES[name]));
      setSelectedServices(industryRoles);
    } catch (err) {
      console.error('Error checking user roles:', err);
    }
  };

  const toggleService = (name) => {
    setSelectedServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const updateRoles = async (toAdd, toRemove) => {
    if (toRemove.length) {
      for (const roleId of toRemove) {
        await fetch('/api/discord/remove-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ role: roleId }),
        });
      }
    }

    if (toAdd.length) {
      await fetch('/api/discord/assign-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ roles: toAdd }),
      });
    }
  };

  const handleRrfToggle = async () => {
    try {
      if (onDutyRrf) {
        await updateRoles([], [RRF_ROLE]);
        setOnDutyRrf(false);
        alert('You are now off duty: RRF');
      } else {
        await updateRoles([RRF_ROLE], []);
        setOnDutyRrf(true);
        alert('You are now on duty: RRF');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const submitIndustry = async () => {
    try {
      const selectedIds = selectedServices.map((s) => SERVICE_ROLES[s]);
      const toAdd = selectedIds.filter(id => !currentIndustryRoles.includes(id));
      const toRemove = currentIndustryRoles.filter(id => !selectedIds.includes(id));

      await updateRoles(toAdd, toRemove);

      setCurrentIndustryRoles(selectedIds);
      alert('Your Industry roles have been updated.');
      setPanel(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleGoOffDuty = async () => {
    try {
      await updateRoles([], ALL_ROLES);
      setOnDutyRrf(false);
      setSelectedServices([]);
      setCurrentIndustryRoles([]);
      setPanel(null);
      alert('You are now off duty: all roles removed.');
    } catch (e) {
      alert(e.message);
    }
  };

  const handleIndustry = () => {
    setPanel(panel === 'industry' ? null : 'industry');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <div
        style={{
          width: sidebarHovered ? 260 : 50,
          background: '#1a1a1a',
          color: '#fff',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: sidebarHovered ? 'flex-start' : 'center',
          padding: sidebarHovered ? '20px 20px 10px' : '60px 0 10px',
          userSelect: 'none',
          fontWeight: 'bold',
        }}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div
          style={{
            fontSize: 28,
            marginBottom: 20,
            width: '100%',
            textAlign: sidebarHovered ? 'left' : 'center',
            lineHeight: 1,
            marginTop: '20px',
          }}
        >
          &#9776;
        </div>

        {sidebarHovered && (
          <>
            <button
              onClick={handleRrfToggle}
              style={{
                ...toggleBtnStyle,
                background: colors.primary,
                color: colors.textDark,
              }}
            >
              {onDutyRrf ? 'RRF Off' : 'RRF On'}
            </button>

            <button
              onClick={handleIndustry}
              style={{
                ...toggleBtnStyle,
                background: colors.gold,
                color: colors.textDark,
              }}
            >
              {hasServiceRoles ? 'Update Roles' : 'Industry On'}
            </button>

            {isOnDuty && (
              <button
                onClick={handleGoOffDuty}
                style={{
                  ...toggleBtnStyle,
                  background: colors.accent,
                  color: colors.textDark,
                }}
              >
                Off Duty
              </button>
            )}

            {panel === 'industry' && (
              <div style={{ marginTop: 20, width: '100%' }}>
                {Object.keys(SERVICE_ROLES).map((name) => (
                  <label
                    key={name}
                    style={{
                      display: 'block',
                      margin: '8px 0',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(name)}
                      onChange={() => toggleService(name)}
                      style={{ marginRight: 8 }}
                    />
                    {name}
                  </label>
                ))}
                <button onClick={submitIndustry} style={submitBtnStyle}>
                  Submit
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <div style={{ flexGrow: 1, padding: 20 }}>{/* Main content */}</div>
    </div>
  );
};

const toggleBtnStyle = {
  width: '100%',
  padding: '12px',
  margin: '8px 0',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 'bold',
  textAlign: 'left',
  background: '#222',
  color: '#fff',
};

const submitBtnStyle = {
  padding: '10px 20px',
  marginTop: 12,
  background: colors.primaryLight,
  color: colors.primaryDark,
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  width: '100%',
  fontWeight: 'bold',
};

export default Requests;
