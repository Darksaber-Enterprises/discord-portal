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

const ALL_ROLES = [
  RRF_ROLE,
  ...Object.values(SERVICE_ROLES)
];

const Requests = ({ userToken: initialToken }) => {
  const [userToken, setUserToken] = useState(initialToken || '');
  const [panel, setPanel] = useState(null); // 'industry' or null
  const [services, setServices] = useState([]);
  const [onDutyRrf, setOnDutyRrf] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Store current assigned Industry roles (role IDs)
  const [currentIndustryRoles, setCurrentIndustryRoles] = useState([]);

  useEffect(() => {
    if (!initialToken) {
      const stored = localStorage.getItem('access_token');
      if (stored) {
        setUserToken(stored);
        checkUserRoles(stored);
      } else {
        alert('You must be signed in to assign roles.');
      }
    } else {
      checkUserRoles(initialToken);
    }
  }, [initialToken]);

  const checkUserRoles = async (token) => {
    try {
      const res = await fetch('/api/discord/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user roles');
      const data = await res.json();

      // Check RRF role
      const hasRrf = data.roles.some(role => role.id === RRF_ROLE);
      setOnDutyRrf(hasRrf);

      // Check Industry roles user currently has
      const userRoleIds = data.roles.map(role => role.id);
      const assignedIndustryRoles = Object.values(SERVICE_ROLES).filter(roleId =>
        userRoleIds.includes(roleId)
      );
      setCurrentIndustryRoles(assignedIndustryRoles);

      // Set initial checkbox states accordingly
      const assignedServiceNames = Object.entries(SERVICE_ROLES)
        .filter(([name, roleId]) => assignedIndustryRoles.includes(roleId))
        .map(([name]) => name);
      setServices(assignedServiceNames);
    } catch (err) {
      console.error('Error checking user roles:', err);
    }
  };

  const toggleService = name =>
    setServices(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );

  const assignRoles = async (roleIds) => {
    if (!userToken) throw new Error('No token available for authentication.');
    const res = await fetch('/api/discord/assign-roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ roles: roleIds }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('[ERROR] Role assignment failed:', errorText);
      throw new Error('Failed to assign roles: ' + errorText);
    }

    return await res.json();
  };

  const removeRoles = async (roleIds) => {
    if (!userToken) throw new Error('No token available for authentication.');
    for (const roleId of roleIds) {
      const res = await fetch(`/api/discord/remove-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ role: roleId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[ERROR] Role removal failed:', errorText);
        throw new Error('Failed to remove roles: ' + errorText);
      }
    }
  };

  const handleRrfToggle = async () => {
    try {
      if (!onDutyRrf) {
        await assignRoles([RRF_ROLE]);
        setOnDutyRrf(true);
        alert('You are now on duty: RRF');
      } else {
        await removeRoles([RRF_ROLE]);
        setOnDutyRrf(false);
        alert('You are now off duty: RRF');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleIndustry = () => {
    setPanel('industry');
  };

  const submitIndustry = async () => {
    try {
      const newRoleIds = services.map(s => SERVICE_ROLES[s]);
      const prevRoleIds = currentIndustryRoles;

      const rolesToAdd = newRoleIds.filter(id => !prevRoleIds.includes(id));
      const rolesToRemove = prevRoleIds.filter(id => !newRoleIds.includes(id));

      if (rolesToRemove.length > 0) {
        await removeRoles(rolesToRemove);
      }
      if (rolesToAdd.length > 0) {
        await assignRoles(rolesToAdd);
      }

      setCurrentIndustryRoles(newRoleIds);
      alert('Your Industry roles have been updated.');
      setPanel(null);
      setServices([]);
    } catch (e) {
      alert(e.message);
    }
  };

  // New: Go Off Duty removes all RRF + Industry roles
  const handleGoOffDuty = async () => {
    try {
      await removeRoles(ALL_ROLES);
      setOnDutyRrf(false);
      setCurrentIndustryRoles([]);
      setServices([]);
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
          background: '#111',
          color: '#eee',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: sidebarHovered ? 'flex-start' : 'center',
          paddingTop: 10,
          paddingLeft: sidebarHovered ? 20 : 0,
          paddingRight: sidebarHovered ? 20 : 0,
          boxSizing: 'border-box',
          userSelect: 'none',
        }}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div
          style={{
            fontSize: 28,
            marginBottom: 20,
            cursor: 'pointer',
            color: '#eee',
            width: '100%',
            textAlign: sidebarHovered ? 'left' : 'center',
            userSelect: 'none',
            lineHeight: 1,
          }}
          aria-label="Sidebar Menu"
        >
          &#9776;
        </div>

        {sidebarHovered && (
          <>
            <button
              onClick={handleRrfToggle}
              style={{ ...toggleBtnStyle, background: colors.primary, color: colors.primaryDark }}
            >
              {onDutyRrf ? 'Go off duty RRF' : 'Go on duty RRF'}
            </button>

            <button
              onClick={handleIndustry}
              style={{ ...toggleBtnStyle, background: colors.alternate1, color: colors.textDark }}
            >
              Go on duty Industry
            </button>

            <button
              onClick={handleGoOffDuty}
              style={{ ...toggleBtnStyle, background: '#b45a5a', color: colors.textLight }}
            >
              Go Off Duty (Remove All Roles)
            </button>

            {panel === 'industry' && (
              <div style={{ marginTop: 20, width: '100%' }}>
                {Object.keys(SERVICE_ROLES).map((name) => (
                  <label
                    key={name}
                    style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}
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
        {/* Your page content */}
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
};

export default Requests;
