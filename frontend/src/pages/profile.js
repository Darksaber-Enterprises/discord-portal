import React, { useEffect, useState } from 'react';
import colors from '../colors';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinDate, setJoinDate] = useState(null);
  const [isEmployee, setIsEmployee] = useState(false);

  // Staff role ID
  const STAFF_ROLE_ID = '1187153043192553522';

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No access token found.');
      setLoading(false);
      return;
    }

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
        
        // Check if user has staff role
        const hasStaffRole = data.roles.some(role => role.id === STAFF_ROLE_ID);
        setIsEmployee(hasStaffRole);
        
        // Get join date (if available)
        if (data.joined_at) {
          setJoinDate(new Date(data.joined_at).toLocaleDateString());
        }
        
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

  if (loading) return <LoadingSpinner color={colors.gold} />;
  if (error) return <p style={{ color: colors.accent }}>Error: {error}</p>;
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      {isEmployee ? (
        <EmployeeCard 
          user={user} 
          displayName={displayName} 
          avatarUrl={avatarUrl} 
          joinDate={joinDate}
          ranks={ranks}
          corps={corps}
          certifications={certifications}
          showIndustrialProf={showIndustrialProf}
          industrialProficiencies={industrialProficiencies}
          additionalDutiesFiltered={additionalDutiesFiltered}
          hasAdditionalDuties={hasAdditionalDuties}
        />
      ) : (
        <CustomerCard 
          user={user} 
          displayName={displayName} 
          avatarUrl={avatarUrl} 
          joinDate={joinDate}
        />
      )}
    </div>
  );
};

// Employee Card Component
const EmployeeCard = ({ 
  displayName, 
  avatarUrl, 
  joinDate,
  ranks,
  corps,
  certifications,
  showIndustrialProf,
  industrialProficiencies,
  additionalDutiesFiltered,
  hasAdditionalDuties
}) => (
  <div
    style={{
      width: '100%',
      maxWidth: '800px',
      backgroundColor: colors.primaryDark,
      borderRadius: '12px',
      boxShadow: `0 8px 30px rgba(0, 0, 0, 0.5)`,
      overflow: 'hidden',
      border: `2px solid ${colors.primary}`,
    }}
  >
    {/* Card Header */}
    <div
      style={{
        backgroundColor: colors.primary,
        padding: '30px 20px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <img
        src={avatarUrl}
        alt="Discord Avatar"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: `4px solid ${colors.backgroundDark}`,
          objectFit: 'cover',
          marginBottom: '15px',
        }}
      />
      <h1
        style={{
          margin: 0,
          fontSize: '2.2rem',
          letterSpacing: '0.1em',
          color: colors.backgroundDark,
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        {displayName}
      </h1>
      
      {/* ID Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '40px',
          backgroundColor: colors.primary,
          borderRadius: '50%',
          border: `2px solid ${colors.backgroundDark}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.5rem',
          color: colors.backgroundDark,
        }}
      >
        ID
      </div>
    </div>

    {/* Card Body */}
    <div
      style={{
        padding: '40px 30px 30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
      }}
    >
      {/* Rank Section */}
      <CardSection 
        title="Rank" 
        items={ranks} 
        color={colors.primaryLight}
        emptyText="No rank assigned"
      />
      
      {/* Corps Section */}
      <CardSection 
        title="Corps" 
        items={corps} 
        color={colors.gold}
        emptyText="No corps assigned"
      />
      
      {/* Certifications Section */}
      <CardSection 
        title="Certifications" 
        items={certifications} 
        color={colors.accent}
        emptyText="No certifications"
      />

      {/* Date of Entry Section */}
      <CardSection 
        title="Date of Entry" 
        items={[{name: joinDate || 'N/A'}]} 
        color={colors.primary}
        emptyText="N/A"
      />
      
      {/* Industrial Proficiency Section */}
      {showIndustrialProf && (
        <CardSection 
          title="Industrial Proficiency" 
          items={industrialProficiencies} 
          color={colors.primary}
          emptyText="No industrial proficiency"
        />
      )}
      
      {/* Additional Duties Section */}
      {hasAdditionalDuties && (
        <div
          style={{
            gridColumn: '1 / -1',
            backgroundColor: colors.backgroundDark,
            borderRadius: '8px',
            padding: '15px 20px',
            borderLeft: `4px solid ${colors.gold}`,
          }}
        >
          <h2
            style={{
              color: colors.gold,
              margin: '0 0 15px',
              paddingBottom: '8px',
              borderBottom: `1px solid ${colors.primary}`,
              fontSize: '1.4rem',
            }}
          >
            ADDITIONAL DUTIES
          </h2>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px',
            }}
          >
            {Object.entries(additionalDutiesFiltered).map(([group, groupRoles]) => (
              <div key={group}>
                <h3
                  style={{
                    margin: '0 0 8px',
                    color: colors.primary,
                    fontSize: '1.1rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {group.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                  {groupRoles.map(role => (
                    <li 
                      key={role.id} 
                      style={{ 
                        textTransform: 'uppercase', 
                        fontSize: '0.9rem',
                        marginBottom: '5px',
                      }}
                    >
                      {role.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Card Footer */}
    <div
      style={{
        backgroundColor: colors.primary,
        padding: '15px',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: colors.backgroundDark,
        fontWeight: 'bold',
        borderTop: `2px solid ${colors.backgroundDark}`,
      }}
    >
      DARKSABER INDUSTRIES | EMPLOYEE PROFILE
    </div>
  </div>
);

// Customer Card Component
const CustomerCard = ({ displayName, avatarUrl, joinDate }) => (
  <div
    style={{
      width: '100%',
      maxWidth: '600px',
      backgroundColor: colors.primaryDark,
      borderRadius: '12px',
      boxShadow: `0 8px 30px rgba(0, 0, 0, 0.5)`,
      overflow: 'hidden',
      border: `2px solid ${colors.gold}`,
      textAlign: 'center',
    }}
  >
    {/* Card Header */}
    <div
      style={{
        backgroundColor: colors.gold,
        padding: '30px 20px',
        position: 'relative',
      }}
    >
      <img
        src={avatarUrl}
        alt="Discord Avatar"
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          border: `4px solid ${colors.primaryDark}`,
          objectFit: 'cover',
          marginBottom: '15px',
        }}
      />
      <h1
        style={{
          margin: 0,
          fontSize: '2.2rem',
          letterSpacing: '0.1em',
          color: colors.primaryDark,
          fontWeight: 'bold',
        }}
      >
        {displayName}
      </h1>
    </div>

    {/* Card Body */}
    <div
      style={{
        padding: '40px 30px',
        backgroundColor: colors.primaryLight,
        color: colors.primaryDark,
      }}
    >
      <div
        style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: colors.primaryDark,
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}
      >
        Valued Customer
      </div>
      
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginBottom: '30px',
          flexWrap: 'wrap',
        }}
      >
        <InfoBadge 
          title="Customer Since" 
          value={joinDate || 'N/A'} 
          color={colors.primary}
        />
        <InfoBadge 
          title="Account Status" 
          value="Active" 
          color={colors.gold}
        />
      </div>
      
      <div
        style={{
          backgroundColor: colors.backgroundDark,
          borderRadius: '8px',
          padding: '20px',
          color: colors.textLight,
          marginTop: '20px',
          borderLeft: `4px solid ${colors.gold}`,
        }}
      >
        <p style={{ fontSize: '1.1rem', margin: 0 }}>
          Thank you for being a valued customer of Darksaber Industries. 
          We appreciate your business and are committed to providing you 
          with the highest quality services and support.
        </p>
      </div>
    </div>

    {/* Card Footer */}
    <div
      style={{
        backgroundColor: colors.gold,
        padding: '15px',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: colors.primaryDark,
        fontWeight: 'bold',
        borderTop: `2px solid ${colors.primaryDark}`,
      }}
    >
      DARKSABER INDUSTRIES | CUSTOMER PROFILE
    </div>
  </div>
);

// Info Badge Component (for Customer Card)
const InfoBadge = ({ title, value, color }) => (
  <div
    style={{
      backgroundColor: color,
      borderRadius: '8px',
      padding: '15px 25px',
      minWidth: '200px',
    }}
  >
    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{title}</div>
    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{value}</div>
  </div>
);

// Card Section Component (for Employee Card)
const CardSection = ({ title, items, color, emptyText }) => (
  <div
    style={{
      backgroundColor: colors.backgroundDark,
      borderRadius: '8px',
      padding: '15px',
      borderLeft: `4px solid ${color}`,
    }}
  >
    <h3
      style={{
        color: color,
        margin: '0 0 10px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}
    >
      {title}
    </h3>
    {items.length > 0 ? (
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {items.map((item, index) => (
          <li 
            key={index} 
            style={{
              textTransform: 'uppercase',
              padding: '5px 0',
              borderBottom: items.length > 1 && index < items.length - 1 ? `1px solid ${colors.primaryDark}` : 'none',
              fontSize: '0.95rem',
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    ) : (
      <p style={{ fontStyle: 'italic', color: colors.accent, margin: 0 }}>
        {emptyText}
      </p>
    )}
  </div>
);

// Loading Spinner Component
const LoadingSpinner = ({ color = colors.gold, size = 60 }) => (
  <div
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: size,
      height: size,
      border: `6px solid ${color}33`,
      borderTopColor: color,
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

export default Profile;