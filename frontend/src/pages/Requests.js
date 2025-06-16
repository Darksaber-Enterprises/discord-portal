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
  const [services, setServices] = useState([]);
  const [onDutyRrf, setOnDutyRrf] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [currentIndustryRoles, setCurrentIndustryRoles] = useState([]);

  useEffect(() => {
    const stored = initialToken || localStorage.getItem('access_token');
    if (!stored) {
      alert('You must be signed in to assign roles.');
      return;
    }

    setUserToken(stored);
    checkUserRoles(stored);
  }, [initialToken]);

  const checkUserRoles = async (token) => {
    try {
      const res = await fetch('/api/discord/user', {
        headers: { Authorization: `Bearer ${token}` }, // Fixed template literal
      });

      if (!res.ok) throw new Error('Failed to fetch user roles');
      const data = await res.json();

      const userRoleIds = data.roles.map((role) => role.id);
      const hasRrf = userRoleIds.includes(RRF_ROLE);
      setOnDutyRrf(hasRrf);

      const assignedIndustryRoles = Object.values(SERVICE_ROLES).filter((roleId) =>
        userRoleIds.includes(roleId)
      );

      setCurrentIndustryRoles(assignedIndustryRoles);

      const assignedServices = Object.entries(SERVICE_ROLES)
        .filter(([name, roleId]) => assignedIndustryRoles.includes(roleId))
        .map(([name]) => name);

      setServices(assignedServices);
    } catch (err) {
      console.error('Error checking user roles:', err);
    }
  };

  const toggleService = (name) =>
    setServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );

  const assignRoles = async (roleIds) => {
    const res = await fetch('/api/discord/assign-roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`, // Fixed template literal
      },
      body: JSON.stringify({ roles: roleIds }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('[ERROR] Assign roles failed:', error);
      throw new Error('Failed to assign roles: ' + error);
    }

    return await res.json();
  };

  const removeRoles = async (roleIds) => {
    for (const roleId of roleIds) {
      const res = await fetch('/api/discord/remove-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`, // Fixed template literal
        },
        body: JSON.stringify({ role: roleId }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error('[ERROR] Remove role failed:', error);
        throw new Error('Failed to remove role: ' + error);
      }
    }
  };

  const handleRrfToggle = async () => {
    try {
      if (onDutyRrf) {
        await removeRoles([RRF_ROLE]);
        setOnDutyRrf(false);
        alert('You are now off duty: RRF');
      } else {
        await assignRoles([RRF_ROLE]);
        setOnDutyRrf(true);
        alert('You are now on duty: RRF');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleIndustry = () => {
    setPanel(panel === 'industry' ? null : 'industry');
  };

  const submitIndustry = async () => {
    try {
      const selectedRoleIds = services.map((s) => SERVICE_ROLES[s]);
      const rolesToAdd = selectedRoleIds.filter((id) => !currentIndustryRoles.includes(id));
      const rolesToRemove = currentIndustryRoles.filter((id) => !selectedRoleIds.includes(id));

      if (rolesToRemove.length > 0) await removeRoles(rolesToRemove);
      if (rolesToAdd.length > 0) await assignRoles(rolesToAdd);

      setCurrentIndustryRoles(selectedRoleIds);
      alert('Your Industry roles have been updated.');
      setPanel(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleGoOffDuty = async () => {
    try {
      await removeRoles(ALL_ROLES);
      setOnDutyRrf(false);
      setServices([]);
      setCurrentIndustryRoles([]);
      setPanel(null);
      alert('You are now off duty: all roles removed.');
    } catch (e) {
      alert(e.message);
    }
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
                opacity: 1,
                textAlign: 'center',
              }}
            >
              {onDutyRrf ? 'Go off duty RRF' : 'Go on duty RRF'}
            </button>

            <button
              onClick={handleIndustry}
              style={{
                ...toggleBtnStyle,
                background: colors.gold,
                color: colors.textDark,
                opacity: 1,
                textAlign: 'center',
              }}
            >
              Go on duty Industry
            </button>

            <button
              onClick={handleGoOffDuty}
              style={{
                ...toggleBtnStyle,
                background: colors.accent, // 
                color: colors.textDark,
                opacity: 1,
                textAlign: 'center',
              }}
            >
              Go Off Duty
            </button>

            {panel === 'industry' && (
              <div style={{ marginTop: 20, width: '100%' }}>
                {Object.keys(SERVICE_ROLES).map((name) => (
                  <label
                    key={name}
                    style={{ display: 'block', margin: '8px 0', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <input
                      type="checkbox"
                      checked={services.includes(name)}
                      onChange={() => toggleService(name)}
                      style={{ marginRight: 8 }}
                    />
                    {name}
                  </label>
                ))}

                <button onClick={submitIndustry} style={submitBtnStyle}>
                  Submit Services
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ flexGrow: 1, padding: 20 }}>
        {/* Page content goes here */}
      </div>
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
