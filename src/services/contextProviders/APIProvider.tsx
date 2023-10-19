import React from 'react';
import APIGet from '../APIHandler/APIGet';
import APIPost from '../APIHandler/APIPost';
import APIPut from '../APIHandler/APIPut';
import APIPatch from '../APIHandler/APIPatch';
import APIDelete from '../APIHandler/APIDelete';
import { AuthContext } from './AuthContextProvider';

const initialState = {
  APIGet: APIGet,
  APIPost: APIPost,
  APIPut: APIPut,
  APIPatch: APIPatch,
  APIDelete: APIDelete
};

export const APIContext = React.createContext(initialState);

const APIContextProvider = (props: {children: React.ReactNode}) => {

    const {authStatus} = React.useContext(AuthContext);

  return (
    <APIContext.Provider
      value={{
        APIGet: ({url, resolve, reject}) => APIGet({url, resolve, reject, customHeaders: {'Session-Token': authStatus.authToken}}),
        APIPost: ({url, body, resolve, reject}) => APIPost({url, body, resolve, reject, customHeaders: {'Session-Token': authStatus.authToken}}),
        APIPut: ({url, body, resolve, reject}) => APIPut({url, body, resolve, reject, customHeaders: {'Session-Token': authStatus.authToken}}),
        APIPatch: ({url, body, resolve, reject}) => APIPatch({url, body, resolve, reject, customHeaders: {'Session-Token': authStatus.authToken}}),
        APIDelete: ({url, body, resolve, reject}) => APIDelete({url, body, resolve, reject, customHeaders: {'Session-Token': authStatus.authToken}}),
      }}>
      {props.children}
    </APIContext.Provider>
  );
};

export default APIContextProvider;
