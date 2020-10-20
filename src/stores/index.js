import React from 'react';
import UIStore from './UIStore';

export const RootStore = {
  uiStore: new UIStore(),
};

export const StoreContext = React.createContext(RootStore);

export const StoreProvider = ({ children, store }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => React.useContext(StoreContext);

export const withStore = Component => props => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...props} store={useStore()} />;
};
