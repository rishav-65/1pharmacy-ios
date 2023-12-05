/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { APIContextProvider, AuthContext, AuthContextProvider, ToastProvider } from '@contextProviders';
import { DynamicScreen, Home, LoginScreen, TabScreen, VerifyOTP } from '@screens';
import { NativeBaseProvider } from 'native-base';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faCartShopping, faFileInvoiceDollar, faFilter, faPhone, faPills, faQrcode, faShop } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

library.add(faPills, faFileInvoiceDollar, faShop, faCartShopping, faQrcode, faBars, faPhone, faWhatsapp, faFilter);

const _1PTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF'
  },
};

export type RootStackParamList = {
  DynamicScreen: undefined;
  Home: undefined;
  VerifyOTP: { phone: number | string };
  TabScreen: undefined;
};

type RouteDefinition = {
  name: keyof RootStackParamList;
  component:
  | React.FC<NativeStackScreenProps<RootStackParamList, 'DynamicScreen'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'VerifyOTP'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'TabScreen'>>
  | undefined;
};

const AppNavigator = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  const { authStatus, localAuthFetched } = useContext(AuthContext);

  const publicRoutes: RouteDefinition[] = [
    {
      name: 'Home',
      component: LoginScreen
    },
    {
      name: 'VerifyOTP',
      component: VerifyOTP
    },
  ]

  const privateRoutes: RouteDefinition[] = [
    {
      name: 'DynamicScreen',
      component: DynamicScreen
    },
    {
      name: 'Home',
      component: Home
    },
    {
      name: 'TabScreen',
      component: TabScreen
    },
  ]

  const activeRoutes: RouteDefinition[] = localAuthFetched ? (authStatus.loggedIn ? privateRoutes : publicRoutes) : []

  return (
    <NavigationContainer theme={_1PTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName='Home'>
        {
          activeRoutes.map(route => (<Stack.Screen key={route.name} name={route.name as keyof RootStackParamList} component={route.component as React.FC<NativeStackScreenProps<RootStackParamList, typeof route.name>>} />))
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
