/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext} from 'react';
import {DynamicScreen, Home, LoginScreen} from './src/components/screens';
import {
  AuthContext,
  AuthContextProvider,
} from './src/components/displayBlocks/contextProviders';

const Navigator = () => {
  const Stack = createNativeStackNavigator();

  const {authStatus} = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={authStatus.loggedIn ? 'Home' : 'Login'}>
        <Stack.Screen name="DynamicScreen" component={DynamicScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App(): JSX.Element {
  return (
    <AuthContextProvider>
      <Navigator />
    </AuthContextProvider>
  );
}

export default App;
