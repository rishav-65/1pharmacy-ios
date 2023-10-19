/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { AuthContext, AuthContextProvider } from '@contextProviders';
import { DynamicScreen, Home, LoginScreen } from '@screens';
import APIContextProvider from 'src/services/contextProviders/APIProvider';

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();

  const { authStatus } = useContext(AuthContext);

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
      <APIContextProvider>
        <AppNavigator />
      </APIContextProvider>
    </AuthContextProvider>
  );
}

export default App;
