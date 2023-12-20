import P1Styles from "@P1StyleSheet";
import { BottomActionSheet } from "@commonComponents";
import { APIContext, FormStateContext, ToastContext } from "@contextProviders";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import moment from "moment";
import { ArrowBackIcon, Box, Button, ChevronDownIcon, FlatList, HStack, IconButton, Input, KeyboardAvoidingView, ScrollView, StatusBar, Switch, Text, VStack, View } from "native-base";
import { useContext, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { calculateMarginPercent, calculateTotal, paymentModes } from "./utils";
import { getURL } from "@APIRepository";
import { ToastProfiles } from "@ToastProfiles";

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    header: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        ...P1Styles.shadow
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
    listTitle: {
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 10
    },
    itemsListSection: {
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        ...P1Styles.shadow
    },
    listItem: {
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    footer: {
        zIndex: 10000,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        ...P1Styles.shadowTopLarge
    },
    customerDetailsASControl: {
        paddingHorizontal: 20,
        paddingVertical: 10,
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
    },
    collapsibleListContent: {
        paddingHorizontal: 20,
    },
    submissionFooter: {
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    submitButton: {
        backgroundColor: '#2E6ACF',
        borderRadius: 20,
        ...P1Styles.shadow
    },
    inputBox: {
        flex: 1,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        ...P1Styles.shadow
    },
    detailItem: {
        fontSize: 13,
        color: '#808080',
        width: '50%'
    },
    footerDetailTitle: {
        fontSize: 13,
        color: '#909090'
    },
    footerDetailValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3F3E60'
    },
    actionSheetStyle: {
        alignItems: 'flex-start'
    },
    elevatedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        ...P1Styles.shadow
    },
    formSwitch: {
        ...P1Styles.shadow
    },
    customInputText: {
        fontSize: 13
    },
    bottomSheetOption: {
        marginVertical: 5,
        width: Dimensions.get('window').width - 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        ...P1Styles.shadow
    },
})

const CollapsibleListItem = (props: any) => {
    const { item } = props;
    const [collapsed, setCollapsed] = useState(true);
    const [contentHeight, setContentHeight] = useState(
        screenWidth >= 414 ? 500 : screenWidth >= 375 ? 300 : 200,
    );

    const maxHeight = screenWidth >= 414 ? 600 : screenWidth >= 375 ? 450 : 300;

    const openCLoseAnim = useRef(new Animated.Value(0)).current;

    const collapse = (event: any) => {
        event.stopPropagation();

        Animated.timing(openCLoseAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false
        }).start(() => setCollapsed(true));
    };

    const expand = (event: any) => {
        event.stopPropagation();

        Animated.timing(openCLoseAnim, {
            toValue: contentHeight,
            duration: 250,
            useNativeDriver: false
        }).start(() => setCollapsed(false));
    };

    return (
        <>
            <TouchableOpacity style={styles.listItem} onPress={collapsed ? expand : collapse}>
                <HStack width="50%" alignItems="center">
                    <FontAwesomeIcon icon="chevron-right" size={14} color="#505050" />
                    <Text bold color="#505050">
                        {item.name}
                    </Text>
                </HStack>
                <Text bold color="#505050" width="20%" textAlign="right">
                    {item.billQty}
                </Text>
                <Text bold color="#505050" width="30%" textAlign="right">
                    ₹ {item.price}
                </Text>
            </TouchableOpacity>
            <Animated.View
                style={{
                    height: openCLoseAnim,
                    ...styles.collapsibleList,
                }}>
                <ScrollView
                    bounces={false}
                    onContentSizeChange={(width, height) => {
                        setContentHeight(height > maxHeight ? maxHeight : height);
                    }}
                    style={{
                        maxHeight: contentHeight,
                        ...styles.collapsibleListContent
                    }}>
                    <VStack justifyContent="space-between">
                        <HStack justifyContent="space-between">
                            <Text style={styles.detailItem}>
                                MRP: ₹ {item.mrp}
                            </Text>
                            <Text style={styles.detailItem}>
                                Batch Number: {item.batchNo}
                            </Text>
                        </HStack>
                        <HStack justifyContent="space-between">
                            <Text style={styles.detailItem}>
                                GST: {item.gst.toFixed(1)}%
                            </Text>
                            <Text style={styles.detailItem}>
                                Expiry: {moment.unix(item.expiry).format('DD-MMM-YYYY')}
                            </Text>
                        </HStack>
                    </VStack>
                </ScrollView>
            </Animated.View>
        </>
    )
}

const BillDetails = (props: any) => {
    const saleIndex = props.route.params.saleIndex;
    const screenTitle = "Summary"

    const [submitting, setSubmitting] = useState(false);

    const [whatsAppBill, setWhatsAppBill] = useState(true);

    const { saleFormState, getSalePatcherByIndex, initializeSaleFormState } = useContext(FormStateContext);

    const saleStatePatcher = getSalePatcherByIndex(saleIndex);

    const { showToast } = useContext(ToastContext);

    const { APIPost } = useContext(APIContext);

    useEffect(() => {
        saleStatePatcher({
            items: saleFormState[saleIndex].items.map((item: any) => ({
                ...item,
                ...(calculateTotal({
                    mrp: item.price,
                    qty: item.billQty,
                    discount: item.discount,
                    overallDiscount: saleFormState[saleIndex].discountPercent,
                    gst: item.gst
                }))
            }))
        })
    }, [saleFormState[saleIndex].discount])

    useEffect(() => {
        const itemsNew = saleFormState[saleIndex].items.map((item: any) => ({ ...item, ...calculateTotal({ mrp: item.price, qty: item.billQty, discount: item.discount, overallDiscount: saleFormState[saleIndex].discountPercent, gst: item.gst }) }))
        const totalValue = itemsNew.reduce((totalMRP: number, currentItem: any) => totalMRP + currentItem.itemAmount, 0);
        const discount = +((+(saleFormState[saleIndex].discountPercent) * totalValue) / 100);

        saleStatePatcher({ discount, items: itemsNew })
    }, [saleFormState[saleIndex].discountPercent])

    useEffect(() => {
        const totalMarginPercent = saleFormState[saleIndex].items.reduce((marginPercent: number, item: any = {}) => (+(calculateMarginPercent({
            effectivePTR: item.effPtr,
            netItemAmount: item.netItemAmount,
            billQty: item.billQty,
            looseEnabled: item.looseEnabled,
            unitRatio: item.unitRatio
        }) || 0) + marginPercent), 0);

        const totalAmount = saleFormState[saleIndex].items.reduce((total: number, currentItem: any) => total + currentItem.itemAmount, 0);
        const netAmount = saleFormState[saleIndex].items.reduce((total: number, currentItem: any) => total + currentItem.netItemAmount, 0);
        const totalSavings = totalAmount - netAmount;
        const gst = saleFormState[saleIndex].items.reduce((total: number, currentItem: any) => total + currentItem.gstAmount, 0);


        saleStatePatcher({ totalMarginPercent, totalAmount, netAmount, totalSavings, gst });
    }, [saleFormState[saleIndex].items])

    const setDiscountAmount = (discount: number) => {
        const totalValue = saleFormState[saleIndex].items.reduce((totalMRP: number, currentItem: any) => totalMRP + currentItem.itemAmount, 0);
        const discountPercent = 100 * (+(discount) / totalValue);

        saleStatePatcher({ discountPercent, discount: +(discount) })
    }

    const submit = () => {
        const formBody = { ...saleFormState[saleIndex], whatsAppBill };

        setSubmitting(true);

        APIPost(
            {
                url: getURL({
                    key: 'SUBMIT_BILL',
                }),
                body: formBody,
                resolve: (response: any) => {
                    if (!response.data) {
                        throw response;
                    }

                    showToast({ ...ToastProfiles.success, title: 'Successfully created Bill' })

                    const { bill } = response.data;

                    setSubmitting(false);

                    initializeSaleFormState(saleIndex);

                    props.navigation.pop(2);
                    props.navigation.push(
                        'TabScreen',
                        {
                            url: getURL({
                                key: 'BILL_ENTRY',
                                pathParams: bill.id
                            }),
                            detailsDisplayProfile: 'bill',
                            screenTitle: bill.billedNo
                        }
                    )
                },
                reject: (error: any) => {
                    if (error.error) {
                        showToast({ ...ToastProfiles.error, title: error.error.userMessage });
                        setSubmitting(false);
                        return;
                    }
                    setSubmitting(false);
                    showToast(ToastProfiles.error)
                }
            }
        )
    }

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
            <ScrollView bounces={false} contentContainerStyle={{
                height: '100%',
                justifyContent: 'flex-end'
            }}>
                <HStack style={styles.itemsListSection}>
                    <View width="50%" my={2} borderRightWidth={1} borderRightColor="#D0D0D0">
                        <Text style={styles.listTitle}>
                            Item
                        </Text>

                    </View>
                    <View width="20%" my={2} borderRightWidth={1} borderRightColor="#D0D0D0">
                        <Text style={styles.listTitle} textAlign="right">
                            Qty
                        </Text>
                    </View>
                    <View width="30%" my={2}>
                        <Text style={styles.listTitle} textAlign="right">
                            Price
                        </Text>
                    </View>
                </HStack>
                <FlatList
                    bounces={false}
                    data={saleFormState[saleIndex].items}
                    renderItem={({ item }) => <CollapsibleListItem item={item} />}
                    keyExtractor={((item: any, index: number) => item.id + index)}
                />
                <KeyboardAvoidingView behavior="padding">
                    <HStack safeAreaBottom style={styles.footer}>
                        <VStack>
                            <HStack style={styles.customerDetailsASControl} alignItems="center" justifyContent="space-between">
                                <Text fontWeight="600" width="20%">
                                    Discount:
                                </Text>
                                <HStack alignItems="center" width='80%'>
                                    <View style={styles.inputBox}>
                                        <Input
                                            borderColor='transparent'
                                            size="xl"
                                            placeholder={props.placeholder}
                                            w="100%"
                                            value={saleFormState[saleIndex].discountPercent === undefined ? undefined : `${saleFormState[saleIndex].discountPercent}`} onChangeText={(text: string) => saleStatePatcher({ discountPercent: +(text) })}
                                            InputLeftElement={<FontAwesomeIcon icon="percent" color="#3f3e60" />}
                                            _focus={{
                                                borderColor: 'transparent',
                                                backgroundColor: 'transparent',
                                            }}
                                        />
                                    </View>
                                    <View style={styles.inputBox}>
                                        <Input
                                            borderColor='transparent'
                                            size="xl"
                                            placeholder={props.placeholder}
                                            w="100%"
                                            value={saleFormState[saleIndex].discount === undefined ? undefined : `${saleFormState[saleIndex].discount.toFixed(2)}`} onChangeText={(text: string) => setDiscountAmount(+(text))}
                                            InputLeftElement={<FontAwesomeIcon icon="indian-rupee-sign" color="#3f3e60" />}
                                            _focus={{
                                                borderColor: 'transparent',
                                                backgroundColor: 'transparent',
                                            }}
                                        />
                                    </View>
                                </HStack>
                            </HStack>
                            <HStack alignItems="center" justifyContent="space-between" px={3}>
                                <HStack alignItems="center" justifyContent="space-between" flex={1} px={2} borderRightWidth={1} borderRightColor="#3F3E60">
                                    <Text style={styles.footerDetailTitle}>Margin</Text>
                                    <Text style={styles.footerDetailValue}>{saleFormState[saleIndex].totalMarginPercent.toFixed(2)}</Text>
                                </HStack>
                                <HStack alignItems="center" justifyContent="space-between" flex={1} mx={2}>
                                    <Text style={styles.footerDetailTitle}>Total Value</Text>
                                    <Text style={styles.footerDetailValue}>₹ {saleFormState[saleIndex].items.reduce((totalMRP: number, currentItem: any) => totalMRP + currentItem.itemAmount, 0).toFixed(2)}</Text>
                                </HStack>
                            </HStack>
                            <HStack alignItems="center" justifyContent="space-between" px={3}>
                                <HStack alignItems="center" justifyContent="space-between" flex={1} px={2} borderRightWidth={1} borderRightColor="#3F3E60">
                                    <Text style={styles.footerDetailTitle}>GST</Text>
                                    <Text style={styles.footerDetailValue}>₹ {saleFormState[saleIndex].items.reduce((totalGST: number, currentItem: any) => totalGST + currentItem.gstAmount, 0).toFixed(2)}</Text>
                                </HStack>
                                <HStack alignItems="center" justifyContent="space-between" flex={1} mx={2}>
                                    <Text style={styles.footerDetailTitle}>Total Disc</Text>
                                    <Text style={styles.footerDetailValue}>{saleFormState[saleIndex].discount.toFixed(2)}</Text>
                                </HStack>
                            </HStack>
                            <HStack alignItems="center" justifyContent="space-between" mx={5} py={3} borderTopWidth={1} borderTopColor="#3F3E60" borderBottomWidth={1} borderBottomColor="#3F3E60">
                                <Text style={{ ...styles.footerDetailTitle, fontSize: 18 }}>Net (₹):</Text>
                                <Text style={{ ...styles.footerDetailValue, fontSize: 18 }}>₹ {saleFormState[saleIndex].items.reduce((netAmount: number, currentItem: any) => netAmount + currentItem.netItemAmount, 0).toFixed(2)}</Text>
                            </HStack>
                            <HStack style={styles.submissionFooter}>
                                <VStack>
                                    <HStack alignItems="center" my={1}>
                                        <Text bold>Mode of Payment</Text>
                                        <BottomActionSheet
                                            handle={(
                                                <>
                                                    <View style={styles.elevatedCard}>
                                                        <Text style={styles.customInputText}>
                                                            {saleFormState[saleIndex].paymentMode}
                                                        </Text>
                                                        <ChevronDownIcon />
                                                    </View>
                                                </>
                                            )}
                                            handleContainerStyle={{ width: 125, marginLeft: 5 }}
                                            actionSheetStyle={styles.actionSheetStyle}
                                            SheetContent={
                                                ({ onClose }: { onClose: Function }) => (<>
                                                    {paymentModes.map((paymentMode: any, index: number) => (
                                                        (
                                                            <TouchableOpacity
                                                                key={paymentMode.value}
                                                                style={styles.bottomSheetOption}
                                                                onPress={() => {
                                                                    saleStatePatcher({ paymentMode: paymentMode.value });
                                                                    onClose();
                                                                }}
                                                            >
                                                                <Text bold>
                                                                    {paymentMode.title}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )
                                                    ))}
                                                </>)
                                            }
                                        />
                                    </HStack>
                                    <HStack alignItems="center" my={1} justifyContent="space-between" space={4}>
                                        <Text bold>Sent the bill on Whatsapp</Text>
                                        <Switch style={styles.formSwitch} isChecked={whatsAppBill} onToggle={setWhatsAppBill} onTrackColor="#2E6ACF" size="md" />
                                    </HStack>
                                </VStack>
                                <Button style={styles.submitButton} isLoading={submitting} onPress={submit}>
                                    Submit
                                </Button>
                            </HStack>
                        </VStack>
                    </HStack>
                </KeyboardAvoidingView>
            </ScrollView >
        </>
    );
}

export default BillDetails;