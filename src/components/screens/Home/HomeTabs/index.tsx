import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardTabPanel from "./DashboardTabPanel";
import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { FavouriteIcon } from "native-base";
import PurchasesTabPanel from "./PurchasesTabPanel";
import P1Styles from "@P1StyleSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SalesTabPanel from "./SalesTabPanel";
import OrdersTabPanel from "./OrdersTabPanel";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        margin: 10,
        height: 60,
        borderRadius: 30,
        ...P1Styles.shadow
    },
    tabBarFAB: {
        backgroundColor: '#2E6ACF',
        height: 56,
        width: 56,
        borderRadius: 28,
        alignSelf: 'center',
        ...P1Styles.shadow
    }
})

const HomeTabs = () => {

    const Tab = createBottomTabNavigator();

    const tabBarStyle = {...styles.tabBar};

    const { bottom } = useSafeAreaInsets();

    if(bottom > 0){
        tabBarStyle.bottom = 20;
    }

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: tabBarStyle,
            }}
            safeAreaInsets={{
                bottom: 0
            }}
        >
            <Tab.Screen name="Dashboard" component={DashboardTabPanel} options={{
                tabBarIcon: ({ focused }) => <FontAwesomeIcon icon="pills" size={30} color={focused ? '#2E6ACF' : '#D0D0D0'} />,
            }} />
            <Tab.Screen name="Sales" component={SalesTabPanel} options={{
                tabBarIcon: ({ focused }) => <FontAwesomeIcon icon="file-invoice-dollar" size={30} color={focused ? '#2E6ACF' : '#D0D0D0'} />,
            }} />
            <Tab.Screen name="QR" component={React.Fragment} options={{
                tabBarIcon: ({ focused }) => <FontAwesomeIcon icon='qrcode' size={30} color='#FFFFFF' />,
                tabBarButton: ({ children }) => (
                    <TouchableOpacity style={styles.tabBarFAB}>
                        {children}
                    </TouchableOpacity>
                )
            }} />
            <Tab.Screen name="Purchases" component={PurchasesTabPanel} options={{
                tabBarIcon: ({ focused }) => <FontAwesomeIcon icon="shop" size={30} color={focused ? '#2E6ACF' : '#D0D0D0'} />,
            }} />
            <Tab.Screen name="Orders" component={OrdersTabPanel} options={{
                tabBarIcon: ({ focused }) => <FontAwesomeIcon icon="cart-shopping" size={30} color={focused ? '#2E6ACF' : '#D0D0D0'} />,
            }} />
        </Tab.Navigator>
    );
}

export default HomeTabs;