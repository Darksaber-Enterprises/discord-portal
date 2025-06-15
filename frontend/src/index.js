import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RequestsProvider } from './context/RequestsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RequestsProvider>
    <App />
  </RequestsProvider>
);
