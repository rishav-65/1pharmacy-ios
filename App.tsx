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
import { BillDetails, CreateBill, CreatePurchase, CustomersListing, DynamicScreen, Home, InventoryListing, ItemsSelect, LoginScreen, OrdersListing, PurchasesListing, SalesListing, SuppliersListing, TabScreen, VerifyOTP } from '@screens';
import { NativeBaseProvider, VStack, extendTheme } from 'native-base';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAdd, faAngleDoubleDown, faAngleDoubleUp, faBars, faCapsules, faCartShopping, faCheck, faChevronRight, faCircleXmark, faFileInvoiceDollar, faFilePrescription, faFilter, faHospital, faHouseChimney, faHouseMedical, faIndianRupeeSign, faPen, faPercent, faPhone, faPills, faPrescription, faPrescriptionBottle, faPrescriptionBottleMedical, faQrcode, faRightFromBracket, faShop, faStethoscope, faSubtract, faSyringe, faTablet, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import SideDrawer from './src/components/SideDrawer';

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
  faCheck,
  faRightFromBracket,
  faStethoscope,
  faHospital,
  faTablet,
  faSyringe,
  faPrescriptionBottleMedical,
  faPrescriptionBottle,
  faPrescription,
  faHouseMedical,
  faHouseChimney,
  faFilePrescription,
  faCapsules
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
  SalesListing: undefined;
  PurchasesListing: undefined;
  OrdersListing: undefined;
  InventoryListing: undefined;
  CustomersListing: undefined;
  SuppliersListing: undefined;
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
  | React.FC<NativeStackScreenProps<RootStackParamList, 'SalesListing'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'PurchasesListing'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'OrdersListing'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'InventoryListing'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'CustomersListing'>>
  | React.FC<NativeStackScreenProps<RootStackParamList, 'SuppliersListing'>>
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
      name: 'SalesListing',
      component: SalesListing
    },
    {
      name: 'PurchasesListing',
      component: PurchasesListing
    },
    {
      name: 'OrdersListing',
      component: OrdersListing
    },
    {
      name: 'InventoryListing',
      component: InventoryListing
    },
    {
      name: 'CustomersListing',
      component: CustomersListing
    },
    {
      name: 'SuppliersListing',
      component: SuppliersListing
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
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName='Home'>
      {
        activeRoutes.map(route => (<Stack.Screen key={route.name} name={route.name as keyof RootStackParamList} component={route.component as React.FC<NativeStackScreenProps<RootStackParamList, typeof route.name>>} />))
      }
    </Stack.Navigator>
  );
};

function App(): JSX.Element {
  return (
    <NativeBaseProvider theme={_1PNativeBaseTheme}>
      <ToastProvider>
        <AuthContextProvider>
          <APIContextProvider>
            <FormStateProvider>
              <NavigationContainer theme={_1PTheme}>
                <SideDrawer component={AppNavigator} />
              </NavigationContainer>
            </FormStateProvider>
          </APIContextProvider>
        </AuthContextProvider>
      </ToastProvider>
    </NativeBaseProvider>
  );
}

export default App;
