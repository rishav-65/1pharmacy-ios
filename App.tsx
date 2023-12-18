/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { APIContextProvider, AuthContext, AuthContextProvider, FormStateProvider, ToastProvider } from '@contextProviders';
import { BillDetails, CreateBill, CreatePurchase, DynamicScreen, Home, ItemsSelect, LoginScreen, TabScreen, VerifyOTP } from '@screens';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAdd, faAngleDoubleDown, faAngleDoubleUp, faBars, faCartShopping, faCheck, faChevronRight, faCircleXmark, faFileInvoiceDollar, faFilter, faIndianRupeeSign, faPen, faPercent, faPhone, faPills, faQrcode, faShop, faSubtract, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

library.add(
  faPills,
  faFileInvoiceDollar,
  faShop,
  faCartShopping,
  faQrcode,
  faBars,
  faPhone,
  faWhatsapp,
  faFilter,
  faTrashAlt,
  faAngleDoubleUp,
  faAngleDoubleDown,
  faPen,
  faCircleXmark,
  faAdd,
  faSubtract,
  faChevronRight,
  faPercent,
  faIndianRupeeSign,
  faCheck
);

const _1PTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    primaryText: '#0000FF'
  },
};

const _1PNativeBaseTheme = extendTheme({
  colors: {
    text: {
      900: '#3C3C3C'
    }
  }
})

export type RootStackParamList = {
  DynamicScreen: undefined;
  Home: undefined;
  VerifyOTP: { phone: number | string };
  TabScreen: { url: string, detailsDisplayProfile: string, screenTitle: string };
  CreateBill: undefined,
  CreatePurchase: undefined,
  ItemsSelect: { saleIndex: number }
  BillDetails: { saleIndex: number }
};

type RouteDefinition = {
  name: keyof RootStackParamList;
  component:
  | React.FC<NativeStackScreenProps<RootStackParamList, 'DynamicScreen'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'VerifyOTP'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'TabScreen'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'CreateBill'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'CreatePurchase'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'ItemsSelect'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'BillDetails'>>
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
    {
      name: 'CreateBill',
      component: CreateBill
    },
    {
      name: 'ItemsSelect',
      component: ItemsSelect
    },
    {
      name: 'BillDetails',
      component: BillDetails
    },
    {
      name: 'CreatePurchase',
      component: CreatePurchase
    }
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
    <NativeBaseProvider theme={_1PNativeBaseTheme}>
      <ToastProvider>
        <AuthContextProvider>
          <APIContextProvider>
            <FormStateProvider>
              <AppNavigator />
            </FormStateProvider>
          </APIContextProvider>
        </AuthContextProvider>
      </ToastProvider>
    </NativeBaseProvider>
  );
}

export default App;
