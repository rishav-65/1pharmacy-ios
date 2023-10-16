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
import { DynamicScreen, Home, LoginScreen, VerifyOTP } from '@screens';
import { SafeAreaView } from 'react-native';
import { NativeBaseProvider } from 'native-base';

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();

  const { authStatus } = useContext(AuthContext);

  const routes = [
    {
      name: 'DynamicScreen',
      component: DynamicScreen
    },
    {
      name: 'Home',
      component: Home
    },
    {
      name: 'Login',
      component: LoginScreen
    },
    {
      name: 'VerifyOTP',
      component: VerifyOTP
    },
  ]

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName={authStatus.loggedIn ? 'Home' : 'Login'}>
        {
          routes.map(route => (<Stack.Screen key={route.name} name={route.name} component={route.component} />))
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      <AuthContextProvider>
        <AppNavigator />
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}

export default App;
