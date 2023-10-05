import React from 'react';

type AuthStatus = {
  loggedIn: boolean;
  loggedInUser: {} | null;
  authToken: string | null;
};

const initialState: {authStatus: AuthStatus; setAuthStatus: Function} = {
  authStatus: {
    loggedIn: false,
    loggedInUser: null,
    authToken: null,
  },
  setAuthStatus: (_authStatus: AuthStatus) => {},
};

export const AuthContext = React.createContext(initialState);

const AuthContextProvider = (props: {children: React.ReactNode}) => {
  const [authStatus, setAuthStatus] = React.useState(initialState.authStatus);

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        setAuthStatus,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
