import React, { createContext, useState, useContext } from 'react';

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [userss, setUserss] = useState([]); // renamed to userss

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUserss(data); // using userss to hold the fetched users
  };

  return (
    <UserContext.Provider value={{ userss, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access to UserContext
export const useUserContext = () => useContext(UserContext);
