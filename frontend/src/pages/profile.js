import React, { useEffect, useState } from 'react';
import colors from '../colors'; // adjust path if needed

const Profile = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No access token found.');
      setLoading(false);
      return;
    }

    // Adjust fetch URL to absolute or relative to your backend server.
    // For example, if your backend is on the same domain and port, keep "/api/discord/user"
    // Otherwise, use full URL like "https://your-backend.com/api/discord/user"
    fetch('/api/discord/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then(data => {
        setUser(data.user || null);
        setRoles(data.roles || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Role ID groups
  const certificationRoleIds = [
    '1189686496144412923',
    '1189686562720596019',
    '1189686613220007967',
  ];
  const joinedCorpsRoleIds = [
    '1341973996987617352',
    '1191347745408159784',
    '1203994204154495006',
  ];
  const rankRoleIds = [
    '1187160434831269908',
    '1303846351771013240',
    '1187160555908251751',
    '1187160473909604472',
    '1245173875109793904',
    '1245174720547127379',
    '1245174549792817184',
    '1245173465015910461',
    '1303846455743610954',
    '1245172256330612857',
    '1245175095018655806',
    '1294939661289914368',
    '1187160741283889152',
    '1187160775521992784',
  ];
  const industrialProfRoleIds = [
    '1340562924799922206',
    '1340562888317730857',
    '1340562834332979252',
    '1340562796257218702',
    '1340562740162330685',
    '1340562680397959280',
    '1340562635787210802',
    '1340562591268732972',
    '1340562523157692437',
    '1340562479033618462',
    '1340562384066183190',
    '1340548627193528340',
  ];

  const additionalDutiesGroups = {
    Administration: [
      '1189692979233947688',
      '1290203254730522735',
      '1191516672612380762',
      '1340568253164163173',
    ],
    DirectorsRoles: [
      '1341073426290446408',
      '1341073442463809616',
      '1341073438692868177',
    ],
    ChiefRoles: [
      '1303132366729908275',
      '1191516894356840468',
      '1341078313912762469',
      '1191516942541017129',
      '1191516850392150178',
      '1191516791961309194',
    ],
    AssistantHeadRoles: [
      '1303132044062097429',
      '1303130726299861032',
      '1303127949297320046',
      '1303133166743326761',
    ],
    Moderation: [
      '1194359238068277419',
      '1309569855384588362',
      '1309569709582061690',
      '1309569669346230372',
    ],
    Operations: [
      '1248121910366310481',
      '1340869233365618830',
      '1340869101953880204',
      '1340869098485321788',
    ],
    Logistics: [
      '1203994204154495006',
      '1340540277252685842',
      '1340540368327807007',
      '1340540378293731409',
      '1187161296383258685',
    ],
    Academy: [
      '1189675324838006824',
      '1340869238893707304',
      '1340869236570198027',
      '1245176293767647283',
    ],
    HumanResources: [
      '1189663852833546361',
      '1340869280467779734',
      '1189663938841956443',
      '1340869276436922381',
      '1340869273576275988',
    ],
    Marketing: [
      '1191347200991707207',
      '1340869270451785782',
      '1340869244778315847',
      '1340869241955418162',
    ],
    OtherAdditionalDuties: [
      '1341511889603006464',
      '1194448242969157742',
    ],
  };

  // Filter roles
  const certifications = roles.filter(role => certificationRoleIds.includes(role.id));
  const ranks = roles.filter(role => rankRoleIds.includes(role.id));
  const corps = roles.filter(role => joinedCorpsRoleIds.includes(role.id));
  const industrialProficiencies = roles.filter(role => industrialProfRoleIds.includes(role.id));
  const showIndustrialProf = industrialProficiencies.length > 0;

  const additionalDutiesFiltered = {};
  let hasAdditionalDuties = false;
  for (const [groupName, roleIds] of Object.entries(additionalDutiesGroups)) {
    const matched = roles.filter(role => roleIds.includes(role.id));
    if (matched.length > 0) {
      additionalDutiesFiltered[groupName] = matched;
      hasAdditionalDuties = true;
    }
  }

  // Loading and error states handled here
  if (loading) return <LoadingSpinner color={colors.alternate1} />;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data available.</p>;

  const displayName = user.username.toUpperCase();

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
    : 'https://cdn.discordapp.com/embed/avatars/0.png';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.backgroundDark,
        color: colors.textLight,
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        padding: 20,
        gap: 40,
        boxSizing: 'border-box',
        overflowY: 'visible', // Ensure page scrolls normally
      }}
    >
      {/* Left panel - Employee Card */}
      <div
        style={{
          flex: '1 1 60%',
          backgroundColor: colors.primaryDark,
          borderRadius: 12,
          padding: 30,
          boxShadow: `0 0 20px ${colors.primary}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          textAlign: 'center',
          overflow: 'visible', // no scroll
        }}
      >
        <img
          src={avatarUrl}
          alt="Discord Avatar"
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: `4px solid ${colors.primary}`,
            objectFit: 'cover',
          }}
        />

        <h1 style={{ margin: 0, fontSize: '2.4rem', letterSpacing: '0.1em' }}>
          {displayName}
        </h1>

        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            fontSize: '1.1rem',
          }}
        >
          <InfoRow label="Rank" items={ranks} />
          <InfoRow label="Corps" items={corps} />
          <InfoRow label="Certifications" items={certifications} />
          {showIndustrialProf && (
            <InfoRow label="Industrial Proficiency" items={industrialProficiencies} />
          )}
        </div>
      </div>

      {/* Right panel - Additional Duties */}
      {hasAdditionalDuties && (
        <div
          style={{
            flex: '1 1 40%',
            backgroundColor: colors.primaryDark,
            borderRadius: 12,
            padding: 30,
            boxShadow: `0 0 20px ${colors.primary}`,
            color: colors.textLight,
            fontSize: '1rem',
            overflow: 'visible', // removed scroll here
            maxHeight: 'none',
          }}
        >
          <h2
            style={{
              color: colors.alternate1,
              marginBottom: 20,
              textAlign: 'center',
              letterSpacing: '0.1em',
            }}
          >
            ADDITIONAL DUTIES
          </h2>

          {Object.entries(additionalDutiesFiltered).map(([group, groupRoles]) => (
            <section key={group} style={{ marginBottom: 24 }}>
              <h3
                style={{
                  marginBottom: 8,
                  color: colors.primary,
                  borderBottom: `1px solid ${colors.primary}`,
                  paddingBottom: 4,
                  textTransform: 'capitalize',
                }}
              >
                {group.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: 20, margin: 0 }}>
                {groupRoles.map(role => (
                  <li key={role.id} style={{ textTransform: 'uppercase', marginBottom: 4 }}>
                    {role.name}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

// New spinner loader component
const LoadingSpinner = ({ color = '#dac42a', size = 60 }) => (
  <div
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: size,
      height: size,
      border: `6px solid ${color}33`, // transparent border
      borderTopColor: color, // colored border top
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      zIndex: 9999,
    }}
  >
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

const InfoRow = ({ label, items }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <strong style={{ color: colors.alternate1, marginBottom: 6 }}>{label.toUpperCase()}</strong>
    {items.length > 0 ? (
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ textTransform: 'uppercase' }}>
            {item.name}
          </li>
        ))}
      </ul>
    ) : (
      <p style={{ fontStyle: 'italic', color: colors.alternate2 }}>
        No {label.toLowerCase()} assigned.
      </p>
    )}
  </div>
);

export default Profile;
