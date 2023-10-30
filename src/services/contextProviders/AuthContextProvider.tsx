import { setUserSessions } from '@auth';
import React from 'react';

type AuthStatus = {
  loggedIn: boolean;
  loggedInUser: any | null;
  authToken: string | null;
};

const initialState: { authStatus: AuthStatus; setLoggedInUser: Function } = {
  authStatus: {
    loggedIn: false,
    loggedInUser: null,
    authToken: null,
  },
  setLoggedInUser: (sessions: Array<any>) => { },
};

export const AuthContext = React.createContext(initialState);

const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const [authStatus, setAuthStatus] = React.useState(initialState.authStatus);

  const setLoggedInUser = (sessions: Array<any>) => {
    setUserSessions(sessions).then(activeSession => setAuthStatus({
      loggedIn: true,
      loggedInUser: activeSession,
      authToken: activeSession['session-token']
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        setLoggedInUser,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
