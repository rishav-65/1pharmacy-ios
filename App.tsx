/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { APIContextProvider, AuthContext, AuthContextProvider, ToastProvider } from '@contextProviders';
import { DynamicScreen, Home, LoginScreen, VerifyOTP } from '@screens';
import { NativeBaseProvider } from 'native-base';

export type RootStackParamList = {
  DynamicScreen: undefined;
  Home: undefined;
  Login: undefined;
  VerifyOTP: { phone: number | string };
};

type RouteDefinition = {
  name: keyof RootStackParamList;
  component:
  | React.FC<NativeStackScreenProps<RootStackParamList, 'DynamicScreen'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'Login'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'VerifyOTP'>>
  | undefined;
};

const AppNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  const { authStatus } = useContext(AuthContext);

  const routes: RouteDefinition[] = [
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
          routes.map(route => (<Stack.Screen key={route.name} name={route.name as keyof RootStackParamList} component={route.component as React.FC<NativeStackScreenProps<RootStackParamList, typeof route.name>>} />))
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App(): JSX.Element {
  return (
    <NativeBaseProvider>
      <ToastProvider>
        <AuthContextProvider>
          <APIContextProvider>
            <AppNavigator />
          </APIContextProvider>
        </AuthContextProvider>
      </ToastProvider>
    </NativeBaseProvider>
  );
}

export default App;
