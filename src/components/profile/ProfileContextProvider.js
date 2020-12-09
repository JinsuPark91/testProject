import React, { useState, createContext, useContext } from 'react';

const ProfileContext = createContext(null);

export const useProfileContext = () => useContext(ProfileContext);
export const ProfileContextProvider = ({ children }) => {
  const [state, setState] = useState({
    infoMode: false,
    editMode: false,

    // test용 state
    isAdmin: false,
    created: true,
  });

  const context = {
    state,
    setState,
  };

  return (
    <ProfileContext.Provider value={context}>
      {children}
    </ProfileContext.Provider>
  );
};
