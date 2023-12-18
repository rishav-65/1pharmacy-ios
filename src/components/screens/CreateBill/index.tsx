import { getURL } from "@APIRepository";
import P1Styles from "@P1StyleSheet";
import { ToastProfiles } from "@ToastProfiles";
import { P1AlertDialog, P1DatePicker, ReferenceField } from "@commonComponents";
import { APIContext, FormStateContext, ToastContext } from "@contextProviders";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import moment from "moment";
import { ArrowBackIcon, Box, Button, HStack, IconButton, Input, ScrollView, SearchIcon, StatusBar, Text, VStack, View } from "native-base";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Animated, Dimensions, KeyboardAvoidingView, StyleSheet, TouchableOpacity } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import { calculateTotal } from "./utils";
import { isEmpty } from "lodash";

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    header: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: '#FFFFFF',
        // ...P1Styles.shadow
    },
    tabBar: {
        flex: 0,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    tab: {
        alignItems: 'center',
        flex: 0,
        height: 40,
        width: 40,
        borderRadius: 20,
        ...P1Styles.shadow
    },
    tabBarTitle: {
        fontSize: 18,
        fontWeight: '700'
    },
    footer: {
        zIndex: 10000,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        ...P1Styles.shadowTopLarge
    },
    customerDetailsASControl: {
        width: screenWidth,
    },
    customerDetailsASHandle: {
        width: screenWidth,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15
    },
    collapsibleList: {
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        zIndex: 1000
    },
    collapsibleListContent: {
        paddingHorizontal: 20,
        zIndex: 1000
    },
    submissionFooter: {
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#A0A0A0',
    },
    submitButton: {
        backgroundColor: '#2E6ACF',
        borderRadius: 20,
        ...P1Styles.shadow
    },
    formBase: {
        flex: 1,
        justifyContent: 'space-between'
    },
    referenceField: {
        marginVertical: 5
    },
    inputBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginVertical: 5,
        ...P1Styles.shadow
    },
    searchBar: {
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal: 10
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        padding: 10,
        marginBottom: 10,
        ...P1Styles.shadowTopLarge
    },
    searchIcon: {
        marginRight: 10
    },
    searchBoxPlaceholder: {
        color: '#5A5A5A',
        fontSize: 16
    },
    listItemCard: {
        backgroundColor: '#FFFFFF',
        width: Dimensions.get('window').width - 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginHorizontal: 10,
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingVertical: 15,
        ...P1Styles.shadow
    },
    screenBuffer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardTitle: {
        color: '#2E6ACF',
        fontWeight: '600'
    },
    detailItem: {
        fontSize: 13,
        color: '#808080'
    },
    qtyBadge: {
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#2E6ACF',
        alignItems: 'center',
        ...P1Styles.shadow
    },
    qtyButton: {
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 2
    }
})

const initialLayout = {
    width: screenWidth,
};

const ItemDetailForm = ({ index, customers, customersLoaded, doctors, doctorsLoaded }: { index: number, customers: any[], customersLoaded: boolean, doctors: any[], doctorsLoaded: boolean }) => {
    const [mounted, setMounted] = useState(false)
    const [clearDialogOpen, setClearDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false);
    const [collapsed, setCollapsed] = React.useState(true);
    const [contentHeight, setContentHeight] = React.useState(
        screenWidth >= 414 ? 500 : screenWidth >= 375 ? 300 : 200,
    );

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { saleFormState, getSalePatcherByIndex, initializeSaleFormState } = useContext(FormStateContext);

    const { showToast } = useContext(ToastContext);

    const saleStatePatcher = getSalePatcherByIndex(index);

    const maxHeight = screenWidth >= 414 ? 600 : screenWidth >= 375 ? 450 : 300;

    const openCLoseAnim = React.useRef(new Animated.Value(0)).current;

    const collapse = (event: any) => {
        event.stopPropagation();

        Animated.timing(openCLoseAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start(() => setCollapsed(true));
    };

    const expand = (event: any) => {
        event.stopPropagation();

        Animated.timing(openCLoseAnim, {
            toValue: contentHeight,
            duration: 500,
            useNativeDriver: false
        }).start(() => setCollapsed(false));
    };

    useEffect(() => {
        if (!mounted) {
            if (isEmpty(saleFormState[index])) {
                initializeSaleFormState(index)
            }
            setMounted(true)
        }
    }, [mounted]);

    const removeItem = (index: number) => {
        const saleItems = [...saleFormState[index].items];

        saleItems.splice(index, 1);

        saleStatePatcher({ items: saleItems });
    }

    const manipulateItemQty = (action: string, itemIndex: number) => {
        let items = [...saleFormState[index].items];

        if (action === 'subtract' && items[itemIndex].billQty === 1) {
            removeItem(itemIndex);

            return;
        }

        action === 'add' ? items[itemIndex].billQty++ : items[itemIndex].billQty--;

        items = items.map(
            (item: any) => (
                {
                    ...item,
                    ...(calculateTotal({
                        mrp: item.price,
                        qty: item.billQty,
                        discount: item.discount,
                        overallDiscount: saleFormState[index].discountPercent,
                        gst: item.gst
                    }))
                }
            )
        )

        saleStatePatcher({ items })
    }

    const clearCart = () => {
        saleStatePatcher({ items: [] })
    }

    const submit = () => {
        if (saleFormState[index].items.length === 0) {
            showToast({ ...ToastProfiles.error, title: 'Please select at least 1 item to proceed.' });
            return;
        }

        navigation.push('BillDetails', { saleIndex: index });
    }

    const toggleClearDialogOpen = () => setClearDialogOpen(!clearDialogOpen)

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.formBase}>
            {
                mounted
                && <ScrollView height="100%" bounces={false} contentContainerStyle={{
                    height: '100%',
                    justifyContent: 'flex-end'
                }}>
                    <ScrollView height="100%" width="100%" position="absolute">
                        <View style={styles.screenBuffer}>
                            <Text fontSize={22} style={styles.cardTitle}>
                                {(saleFormState[index].items || []).length} Item(s) Added
                            </Text>
                        </View>
                        {
                            saleFormState[index].items.map((item: any, itemIndex: number) => (
                                <View style={styles.listItemCard}>
                                    <HStack alignItems="center" justifyContent="space-between">
                                        <Text style={styles.cardTitle}>
                                            {item.name}
                                        </Text>
                                        <IconButton borderRadius={20} padding={0} icon={<FontAwesomeIcon icon="circle-xmark" size={15} />} onPress={() => removeItem(itemIndex)} />
                                    </HStack>
                                    <HStack justifyContent="space-between">
                                        <VStack width="60%">
                                            <HStack justifyContent="space-between">
                                                <Text style={styles.detailItem}>
                                                    B.No.: {item.batchNo}
                                                </Text>
                                                <Text style={styles.detailItem}>
                                                    MRP: {item.price}
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text style={styles.detailItem}>
                                                    Stock: {item.stock}
                                                </Text>
                                                <Text style={styles.detailItem}>
                                                    Discount: {item.discount}%
                                                </Text>
                                            </HStack>
                                            <HStack>
                                                <Text style={styles.detailItem}>
                                                    Expiry: {moment.unix(item.expiry).format('DD-MMM-YYYY')}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                        <VStack justifyContent="space-between" alignItems="flex-end">
                                            <Text fontWeight="600">
                                                ₹ {item.price}
                                            </Text>
                                            <HStack style={styles.qtyBadge} justifyContent="space-between">
                                                <IconButton style={styles.qtyButton} icon={<FontAwesomeIcon size={12} icon="subtract" color="#FFFFFF" />} onPress={() => manipulateItemQty('subtract', itemIndex)} />
                                                <Text color="#FFFFFF" fontSize={12} width={2} fontWeight="600">
                                                    {item.billQty}
                                                </Text>
                                                <IconButton style={styles.qtyButton} icon={<FontAwesomeIcon size={12} icon="add" color="#FFFFFF" />} onPress={() => manipulateItemQty('add', itemIndex)} />
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                </View>
                            ))
                        }
                        <View style={styles.screenBuffer} />
                    </ScrollView>
                    <HStack style={styles.searchBar}>
                        <TouchableOpacity style={styles.searchBox} onPress={() => navigation.push('ItemsSelect', { saleIndex: index })}>
                            <SearchIcon size={22} style={styles.searchIcon} />
                            <Text style={styles.searchBoxPlaceholder}>
                                Search for an Item or Medicine
                            </Text>
                        </TouchableOpacity>
                    </HStack>
                    <HStack safeAreaBottom style={styles.footer}>
                        <VStack>
                            <TouchableOpacity style={styles.customerDetailsASControl} onPress={collapsed ? expand : collapse}>
                                <HStack style={styles.customerDetailsASHandle}>
                                    <Text fontSize={16}>Customer Details</Text>
                                    <FontAwesomeIcon icon={collapsed ? 'angle-double-up' : 'angle-double-down'} size={16} color='#3C3C3C' />
                                </HStack>
                            </TouchableOpacity>
                            <Animated.View
                                style={{
                                    height: openCLoseAnim,
                                    ...styles.collapsibleList,
                                }}>
                                <ScrollView
                                    bounces={false}
                                    onContentSizeChange={(width, height) => {
                                        setContentHeight(height > maxHeight ? maxHeight : height + 20);
                                    }}
                                    style={{
                                        maxHeight: contentHeight,
                                        ...styles.collapsibleListContent
                                    }}
                                    contentContainerStyle={{
                                        zIndex: 1000
                                    }}
                                >
                                    <ReferenceField
                                        label="Customer's Mobile Number"
                                        placeholder="Customer's Mobile Number"
                                        containerStyle={styles.referenceField}
                                        referenceList={customers}
                                        loading={!customersLoaded}
                                        filter={(keyword: string, item: any) => item.phone.split(' ').reduce((matchFound: boolean, word: string) => (matchFound || (new RegExp(`^${keyword}`, 'i')).test(word)), false)}
                                        titleField="name"
                                        subTitleField="phone"
                                        subTitleHeading="Phone: "
                                        value={saleFormState[index].contactNo}
                                        onChangeText={(text: string) => saleStatePatcher({ contactNo: text })}
                                        onSelect={(customer: any) => {
                                            saleStatePatcher({
                                                name: customer.name,
                                                contactNo: customer.phone,
                                                customerId: customer.id
                                            })
                                        }}
                                    />
                                    <ReferenceField
                                        label="Customer's Name"
                                        placeholder="Customer's Name"
                                        containerStyle={styles.referenceField}
                                        referenceList={customers}
                                        loading={!customersLoaded}
                                        filter={(keyword: string, item: any) => item.name.split(' ').reduce((matchFound: boolean, word: string) => (matchFound || (new RegExp(`^${keyword}`, 'i')).test(word)), false)}
                                        titleField="name"
                                        subTitleField="phone"
                                        subTitleHeading="Phone: "
                                        value={saleFormState[index].name}
                                        onChangeText={(text: string) => saleStatePatcher({ name: text })}
                                        onSelect={(customer: any) => {
                                            saleStatePatcher({
                                                name: customer.name,
                                                contactNo: customer.phone,
                                                customerId: customer.id
                                            })
                                        }}
                                    />
                                    <ReferenceField
                                        label="Doctor's Name"
                                        placeholder="Doctor's Name"
                                        containerStyle={styles.referenceField}
                                        referenceList={doctors}
                                        loading={!doctorsLoaded}
                                        filter={(keyword: string, item: any) => item.name.split(' ').reduce((matchFound: boolean, word: string) => (matchFound || (new RegExp(`^${keyword}`, 'i')).test(word)), false)}
                                        titleField="name"
                                        subTitleField="phone"
                                        subTitleHeading="Phone: "
                                        value={saleFormState[index].doctor}
                                        onChangeText={(text: string) => saleStatePatcher({ doctor: text })}
                                        onSelect={(doctor: any) => {
                                            saleStatePatcher({
                                                doctor: doctor.name,
                                                doctorId: doctor.id
                                            })
                                        }}
                                    />
                                    <Text fontSize={12} marginLeft={1} marginTop={1}>Refill Reminder (Days)</Text>
                                    <View style={styles.inputBox}>
                                        <Input
                                            borderColor='transparent'
                                            keyboardType="numeric"
                                            size="xl"
                                            placeholder="Refill Reminder"
                                            w="100%"
                                            value={saleFormState[index].reminderDay}
                                            onChangeText={(text: string) => saleStatePatcher({ reminderDay: text })}
                                            _focus={{
                                                borderColor: 'transparent',
                                                backgroundColor: 'transparent',
                                            }}
                                        />
                                    </View>
                                    <Text fontSize={12} marginLeft={1} marginTop={1}>Billed On</Text>
                                    <P1DatePicker
                                        mode="date"
                                        value={saleFormState[index].billedOn}
                                        format="D MMMM YYYY"
                                        onConfirm={(date: number) => saleStatePatcher({ billedOn: date })}
                                        inputStyle={styles.inputBox}
                                    />
                                </ScrollView>
                            </Animated.View>
                            <HStack style={styles.submissionFooter}>
                                <HStack>
                                    <VStack>
                                        <HStack>
                                            <Text style={{ marginRight: 5, color: '#2E6ACF' }}>
                                                {saleFormState[index].items.length} Item(s)
                                            </Text>
                                            <Text style={{ marginRight: 5 }}>
                                                {saleFormState[index].items.reduce((total: number, currentItem: any) => {
                                                    return total + currentItem.billQty
                                                }, 0)} Quantity
                                            </Text>
                                        </HStack>
                                        <HStack>
                                            <Text style={{ marginRight: 5, color: '#2E6ACF', fontWeight: '700' }}>
                                                ₹ {saleFormState[index].items.reduce((total: number, currentItem: any) => (+(total) + currentItem.netItemAmount).toFixed(2), 0)}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                    {
                                        (saleFormState[index].items.length > 0)
                                        && <IconButton variant="unstyled" icon={<FontAwesomeIcon color="#3C3C3C" icon="trash-alt" />} style={{ marginRight: 10 }} onPress={toggleClearDialogOpen} />
                                    }
                                </HStack>
                                <HStack alignItems="center" justifyContent="space-between">
                                    {/* {
                                    (saleFormState[index].items.length > 0)
                                    && <Button style={{ ...styles.submitButton, backgroundColor: '#D00000' }} onPress={toggleClearDialogOpen}>
                                        Clear Cart
                                    </Button>
                                } */}
                                    {/* <IconButton icon={<FontAwesomeIcon color="#FFFFFF" icon="check" />} style={styles.submitButton} disabled={submitting} onPress={submit}/> */}

                                    <Button style={styles.submitButton} isLoading={submitting} onPress={submit}>
                                        Proceed
                                    </Button>
                                </HStack>
                            </HStack>
                        </VStack>
                    </HStack>
                    <P1AlertDialog
                        heading="Clear Cart?"
                        body="Are you sure you want to clear your cart?"
                        isOpen={clearDialogOpen}
                        toggleOpen={toggleClearDialogOpen}
                        buttons={[
                            {
                                label: 'Clear',
                                variant: 'solid',
                                style: { ...styles.submitButton, backgroundColor: '#D00000' },
                                action: clearCart
                            }
                        ]}
                    />
                </ScrollView>
            }
        </KeyboardAvoidingView>
    )
}

const CreateBill = (props: any) => {
    const screenTitle = 'Bill Items'

    const [referenceListsLoaded, setReferenceListsLoaded] = useState(false)

    const [customers, setCustomers] = useState([]);

    const [customersLoaded, setCustomersLoaded] = useState(false);

    const [doctors, setDoctors] = useState([]);

    const [doctorsLoaded, setDoctorsLoaded] = useState(false);

    const { showToast } = useContext(ToastContext);

    const { APIGet } = useContext(APIContext);

    const [index, setIndex] = useState(0);
    const [routes, setRoutes] = useState<Array<{ key: string; title: string }>>([
        { key: '1', title: '1' },
        { key: '2', title: '2' },
        { key: '3', title: '3' },
        { key: '4', title: '4' },
        { key: '5', title: '5' },
    ]);

    const renderScene = useMemo(() => SceneMap(
        routes.reduce(
            (sceneMap, route, index) => (
                {
                    ...sceneMap,
                    [route.key]: () => <ItemDetailForm customers={customers} customersLoaded={customersLoaded} doctors={doctors} doctorsLoaded={doctorsLoaded} index={index} />
                }
            ),
            {}
        )
    ), [customers, customersLoaded]);

    const referenceListProfiles = [
        {
            key: 'STORE_CUSTOMERS',
            onComplete: (response: any) => {
                setCustomers(response.data?.customers);
                setCustomersLoaded(true);
                setReferenceListsLoaded(true);
            }
        },
        {
            key: 'STORE_DOCTOR_LISTING',
            onComplete: (response: any) => {
                setDoctors(response.data?.items);
                setDoctorsLoaded(true);
                setReferenceListsLoaded(true);
            }
        }
    ]

    const fetchReferenceLists = () => {
        referenceListProfiles.forEach((profile: { key: string, onComplete: Function }) => {
            APIGet(
                {
                    url: getURL({
                        key: profile.key,
                    }),
                    resolve: (response: any) => {
                        if (!response.data) {
                            throw response;
                        }

                        profile.onComplete(response);
                    },
                    reject: (error: any) => {
                        showToast(ToastProfiles.error)
                    }
                }
            )
        })
    }

    useEffect(() => {
        if (!referenceListsLoaded) {
            fetchReferenceLists();
        }
    }, [referenceListsLoaded])

    const submitForm = () => { }

    const renderTabBar = (props: any) => {
        return <HStack style={styles.tabBar}>
            <Text style={styles.tabBarTitle}>Drafts:</Text>
            <HStack>
                {routes.map((route: any, i) => {
                    const color = index === i ? '#FFFFFF' : '#3C3C3C';
                    const backgroundColor = index === i ? '#2E6ACF' : '#FFFFFF';
                    return <TouchableOpacity style={{ marginHorizontal: 5 }} key={route.title + `${i}`} onPress={() => setIndex(i)}>
                        <Box bgColor={backgroundColor} style={styles.tab} p={3}>
                            <Animated.Text style={{ color }}>
                                {route.title}
                            </Animated.Text>
                        </Box>
                    </TouchableOpacity>;
                })}
            </HStack>
        </HStack>;
    };

    return (
        <>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <Box safeAreaTop bg="#FFFFFF" />
            <HStack px="1" py="2" style={styles.header}>
                <HStack alignItems="center">
                    <IconButton icon={<ArrowBackIcon style={{ color: '#2E6ACF' }} />} onPress={props.navigation.goBack} />
                    <Text color="#3C3C3C" fontSize="20" >
                        {screenTitle}
                    </Text>
                </HStack>
                <HStack>
                    {/* <IconButton icon={<ShareIcon style={{ color: '#2E6ACF' }} />} />
                <IconButton icon={<ThreeDotsIcon style={{ color: '#2E6ACF' }} />} /> */}
                </HStack>
            </HStack>
            <TabView
                navigationState={{ index, routes }}
                renderTabBar={renderTabBar}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
            />
        </>
    );
}

export default CreateBill;