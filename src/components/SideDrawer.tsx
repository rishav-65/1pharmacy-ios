import { createDrawerNavigator } from "@react-navigation/drawer";
import { Button, HStack, Image, Text, VStack, View } from "native-base";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from '@contextProviders';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import P1Styles from '@P1StyleSheet';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import Emitter from '@Emitter';
import { useContext, useState } from "react";
import P1AlertDialog from "./commonComponents/P1AlertDialog";
import MedicBackground from "./commonComponents/MedicBackground";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    header: {
        paddingVertical: 10,
        paddingRight: 15,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderTopRightRadius: 32,
        borderBottomRightRadius: 32,
        marginBottom: 10,
        ...P1Styles.shadow
    },
    imageThumbnail: {
        height: 60,
        width: 60,
        borderRadius: 20,
        marginRight: 10
    },
    sideNavBlock: {
        padding: 20,
        paddingLeft: 0,
        marginVertical: 5,
        backgroundColor: '#FAFAFA',
        borderTopRightRadius: 32,
        borderBottomRightRadius: 32,
        ...P1Styles.shadow
    },
    navListItem: {
        padding: 5,
        paddingLeft: 25,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2E6ACF',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        ...P1Styles.shadow
    },
    navListItemLabel: {
        fontSize: 16,
        color: '#FFFFFF'
    },
    logOutButton: {
        padding: 5,
        paddingLeft: 25,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2E6ACF',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        ...P1Styles.shadow
    },
    logOutConfirmButton: {
        backgroundColor: '#2E6ACF',
        borderRadius: 20,
        ...P1Styles.shadow
    },
    backgroundContainer: {
        position: 'absolute',
        height: height,
        width: 0.8 * width,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        overflow: 'hidden'
    },
    backgroundIcon: {
        margin: 2,
        fontSize: 11,
        color: '#EAEAEA'
    }
})

const navList: {
    label: string,
    screen: keyof RootStackParamList
}[] = [
        {
            label: 'Sales',
            screen: 'SalesListing'
        },
        {
            label: 'Purchases',
            screen: 'PurchasesListing'
        },
        {
            label: 'Inventory',
            screen: 'InventoryListing'
        },
        {
            label: 'Customers',
            screen: 'CustomersListing'
        },
        {
            label: 'Suppliers',
            screen: 'SuppliersListing'
        }
    ]

const Drawer = createDrawerNavigator();
const SideDrawer = ({ component }: { component: any }) => {
    const [logOutDialogOpen, setLogOutDialogOpen] = useState(false);

    const toggleLogOutDialogOpen = () => setLogOutDialogOpen(!logOutDialogOpen)

    const { authStatus, userLogOut } = useContext(AuthContext);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const navPush = (item: any) => {
        Emitter.emit('PUSH', { screen: item.screen });

        navigation.dispatch(DrawerActions.toggleDrawer())
    }

    const drawerWidth = 0.8 * width;

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                swipeEnabled: true,
                swipeEdgeWidth: !!authStatus.authToken ? 75 : 0,
                drawerType: 'front',
                drawerStyle: {
                    width: '75%',
                    borderTopRightRadius: 42,
                    borderBottomRightRadius: 42,
                    overflow: 'hidden',
                    marginTop: 25
                },
            }}
            initialRouteName="Home"
            drawerContent={(props) => (
                !!authStatus.authToken
                    ? <View style={{ padding: 20, paddingLeft: 0, }}>
                        <MedicBackground height={height} width={drawerWidth} />
                        <VStack justifyContent="space-between" height="100%">
                            <VStack>
                                <HStack style={styles.header}>
                                    <Image
                                        source={{
                                            uri: authStatus?.loggedInUser?.userData?.logo
                                        }}
                                        alt="IMG"
                                        size="sm"
                                        style={styles.imageThumbnail}
                                    />
                                    <VStack paddingY={2}>
                                        <Text flexWrap="wrap" fontWeight="700">
                                            {authStatus?.loggedInUser?.userData?.name}
                                        </Text>
                                        <Text flexWrap="wrap" fontWeight="400">
                                            {authStatus?.loggedInUser?.userData?.company}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <VStack style={styles.sideNavBlock}>
                                    {
                                        navList.map(item => (
                                            <TouchableOpacity
                                                style={styles.navListItem}
                                                onPress={() => navPush(item)}
                                            >
                                                <Text style={styles.navListItemLabel}>{item.label}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </VStack>
                            </VStack>
                            <VStack style={styles.sideNavBlock}>
                                <TouchableOpacity style={styles.logOutButton} onPress={toggleLogOutDialogOpen}>
                                    <FontAwesomeIcon icon="right-from-bracket" color="#FFFFFF" />
                                    <Text color="#FFFFFF" fontSize={16} marginLeft={2}>LogOut</Text>
                                </TouchableOpacity>
                            </VStack>
                        </VStack>
                        <P1AlertDialog
                            heading="LogOut?"
                            body="Are you sure you want to logout?"
                            isOpen={logOutDialogOpen}
                            toggleOpen={toggleLogOutDialogOpen}
                            buttons={[
                                {
                                    label: 'LogOut',
                                    variant: 'solid',
                                    style: { ...styles.logOutConfirmButton, backgroundColor: '#D00000' },
                                    action: () => userLogOut().then(() => navigation.dispatch(DrawerActions.toggleDrawer()))
                                }
                            ]}
                        />
                    </View>
                    : <></>
            )}>
            <Drawer.Screen name="Root" component={component} />
        </Drawer.Navigator>

    );
}

export default SideDrawer;