/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext} from 'react';
import {AuthContext, AuthContextProvider} from '@contextProviders';
import {DynamicScreen, Home, LoginScreen} from '@screens';

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();

  const {authStatus} = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.AppNavigator
        initialRouteName={authStatus.loggedIn ? 'Home' : 'Login'}>
        <Stack.Screen name="DynamicScreen" component={DynamicScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.AppNavigator>
    </NavigationContainer>
  );
};

function App(): JSX.Element {
  return (
    <AuthContextProvider>
      <AppNavigator />
    </AuthContextProvider>
  );
}

export default App;
