import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/landing';
import Callback from './pages/callback';
import Home from './pages/home';
import Profile from './pages/profile';
import OnDuty from './pages/OnDuty';
import Resources from './pages/resources';
import SubmitRequest from './pages/SubmitRequest';  // NEW

function App() {
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('access_token'));

  useEffect(() => {
    const onStorageChange = () => {
      setIsAuthed(!!localStorage.getItem('access_token'));
    };
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/callback" element={<Callback />} />

        <Route
          path="/home"
          element={isAuthed ? <Home /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={isAuthed ? <Profile /> : <Navigate to="/" replace />}
        />
        <Route
          path="/resources"
          element={isAuthed ? <Resources /> : <Navigate to="/" replace />}
        />
        <Route
          path="/on-duty"
          element={isAuthed ? <OnDuty /> : <Navigate to="/" replace />}
        />
        {/* New route for Submit Request */}
        <Route
          path="/submit-request"
          element={isAuthed ? <SubmitRequest /> : <Navigate to="/" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;