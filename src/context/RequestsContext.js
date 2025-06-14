// RequestsContext.js

import React, { createContext, useState, useContext } from 'react';

// Create a context for managing requests
const RequestsContext = createContext();

// Provider component to wrap the app and manage state
export const RequestsProvider = ({ children }) => {
  // State to hold the list of requests
  const [requests, setRequests] = useState([]);

  // Function to add a new request to the list
  const addRequest = (request) => {
    setRequests((prev) => [...prev, request]);
  };

  // Provide the requests and addRequest function to child components
  return (
    <RequestsContext.Provider value={{ requests, addRequest }}>
      {children}
    </RequestsContext.Provider>
  );
};

// Custom hook to access the RequestsContext easily
export const useRequests = () => useContext(RequestsContext);
