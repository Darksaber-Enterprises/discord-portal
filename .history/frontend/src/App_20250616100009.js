import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Landing from './pages/landing';
import Callback from './pages/callback';
import Home from './pages/home';
import Requests from './pages/Requests';
import Resources from './pages/resources';
import SubmitRequest from './pages/SubmitRequest';
import ProfileWrapper from './pages/ProfileWrapper';
import Navbar from './components/navbar';

const REQUIRED_ROLE_ID = '1187153043192553522';

// LayoutWrapper will re-render on route changes because of useLocation
function LayoutWrapper({ children, hasAuthorizedRole }) {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      {!isLanding && <Navbar hasAuthorizedRole={hasAuthorizedRole} />}
      <div style={{ marginTop: isLanding ? 0 : '60px' }}>{children}</div>
    </>
  );
}

function App() {
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('access_token'));
  const [hasAuthorizedRole, setHasAuthorizedRole] = useState(false);
  const [checkingRoles, setCheckingRoles] = useState(true);

  // Listen for login/logout changes in localStorage
  useEffect(() => {
    const onStorageChange = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthed(!!token);
    };
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  // Whenever authentication changes, fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      setCheckingRoles(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setHasAuthorizedRole(false);
        setCheckingRoles(false);
        return;
      }
      try {
        const res = await fetch('/api/discord/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user roles');
        const data = await res.json();

        const roleIds = data.roles?.map(r => r.id) || [];
        setHasAuthorizedRole(roleIds.includes(REQUIRED_ROLE_ID));
      } catch (err) {
        console.error('Failed to fetch roles:', err);
        setHasAuthorizedRole(false);
      } finally {
        setCheckingRoles(false);
      }
    };

    fetchRoles();
  }, [isAuthed]);

  if (checkingRoles) return <div>Loading...</div>;

  return (
    <Router>
      <LayoutWrapper hasAuthorizedRole={hasAuthorizedRole}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/home" element={isAuthed ? <Home /> : <Navigate to="/" replace />} />
          <Route
            path="/profile"
            element={isAuthed ? <ProfileWrapper /> : <Navigate to="/" replace />}
          />
          <Route
            path="/resources"
            element={isAuthed && hasAuthorizedRole ? <Resources /> : <Navigate to="/" replace />}
          />
          <Route
            path="/requests"
            element={isAuthed && hasAuthorizedRole ? <Requests /> : <Navigate to="/" replace />}
          />
          <Route
            path="/submit-request"
            element={isAuthed ? <SubmitRequest /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
