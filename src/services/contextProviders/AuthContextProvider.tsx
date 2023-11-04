import { getActiveUserSession, setActiveUserSessionIndex, setUserSessions } from '@auth';
import React from 'react';

type AuthStatus = {
  loggedIn: boolean;
  loggedInUser: any | null;
  authToken: string | null;
  activeSessionIndex: number,
  sessions?: Array<any>
};

const initialState: { authStatus: AuthStatus; setLoggedInUser: Function, setActiveSession: Function, logOut: Function, localAuthFetched: boolean } = {
  authStatus: {
    loggedIn: false,
    loggedInUser: null,
    authToken: null,
    activeSessionIndex: 0,
    sessions: [],
  },
  setLoggedInUser: (sessions: Array<any>) => { },
  setActiveSession: (index: number) => { },
  logOut: () => { },
  localAuthFetched: false
};

export const AuthContext = React.createContext(initialState);

const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const [authStatus, setAuthStatus] = React.useState(initialState.authStatus);
  const [localAuthFetched, setLocalAuthFetched] = React.useState(false);

  React.useEffect(() => {
    getActiveUserSession().then((sessionData) => {
      if (!!sessionData) {
        const { currentSession, activeSessionIndex, sessions } = sessionData
        setAuthStatus({
          loggedIn: true,
          loggedInUser: currentSession,
          authToken: currentSession['session-token'],
          activeSessionIndex,
          sessions
        })
      }
    })
  }, [])

  const setLoggedInUser = (sessions: Array<any>) => {
    setUserSessions(sessions).then(activeSessionIndex => setAuthStatus({
      loggedIn: true,
      loggedInUser: sessions[activeSessionIndex],
      authToken: sessions[activeSessionIndex]['session-token'],
      activeSessionIndex: activeSessionIndex,
      sessions
    }))
  }

  const setActiveSession = (index: number) => {
    setActiveUserSessionIndex(index).then(() => {
      setAuthStatus({
        ...authStatus,
        activeSessionIndex: index
      })
    })
  }

  const logOut = () => {
    setAuthStatus(initialState.authStatus)
  }

  React.useEffect(() => {
    setLocalAuthFetched(true)
  }, [authStatus.authToken])

  React.useEffect(() => {
    const currentUser = authStatus.sessions && authStatus.sessions[authStatus.activeSessionIndex];
    if (!!currentUser) {
      setAuthStatus({
        ...authStatus,
        loggedInUser: currentUser,
        authToken: currentUser['session-token']
      })
    }
  }, [authStatus.activeSessionIndex])

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        setLoggedInUser,
        setActiveSession,
        logOut,
        localAuthFetched
      }}>
      {localAuthFetched && props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
