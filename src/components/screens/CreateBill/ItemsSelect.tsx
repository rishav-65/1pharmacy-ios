import { getURL } from "@APIRepository";
import P1Styles from "@P1StyleSheet";
import { ToastProfiles } from "@ToastProfiles";
import { BottomActionSheet, LoadingScreen, P1AlertDialog } from "@commonComponents";
import { APIContext, FormStateContext, ToastContext } from "@contextProviders";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import moment from "moment";
import { ArrowBackIcon, Box, Button, ChevronDownIcon, FlatList, HStack, IconButton, Input, KeyboardAvoidingView, ScrollView, SearchIcon, Spinner, StatusBar, Switch, Text, VStack, View, isEmptyObj, useKeyboardBottomInset } from "native-base";
import { useContext, useEffect, useState } from "react";
import { Dimensions, Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import { calculateTotal, unitStockCount } from "./utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const styles = StyleSheet.create({
    header: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
        zIndex: 10000
    },
    inputBox: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginHorizontal: 10,
        marginVertical: 5
    },
    listItemCard: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        width: Dimensions.get('window').width - 20,
        borderRadius: 20,
        marginHorizontal: 10,
        marginVertical: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
        ...P1Styles.shadow
    },
    itemTitleContainer: {
        paddingRight: 10,
        paddingBottom: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#C0C0C0',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700'
    },
    detailItem: {
        fontSize: 14,
        marginTop: 2.5,
        marginRight: 10
    },
    addButton: {
        backgroundColor: '#2E6ACF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 5,
        ...P1Styles.shadow
    },
    searchIcon: {
        marginLeft: 10
    },
    formBase: {
        flex: 1,
        justifyContent: 'space-between'
    },
    footer: {
        zIndex: 10000,
        width: Dimensions.get('window').width,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        ...P1Styles.shadowTop
    },
    submissionFooter: {
        width: Dimensions.get('window').width,
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#A0A0A0'
    },
    submitButton: {
        backgroundColor: '#2E6ACF',
        borderRadius: 20,
        ...P1Styles.shadow
    },
    actionSheetStyle: {
        alignItems: 'flex-start'
    },
    BSItemTitle: {
        color: '#3C3C3C',
        fontSize: 18,
        marginVertical: 10
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
    customInputText: {
        fontSize: 17
    },
    batchSelectCard: {
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
    elevatedInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        ...P1Styles.shadow
    },
    cardTitle: {
        color: '#2E6ACF',
        fontWeight: '600'
    },
    cardCardDetailItem: {
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
    },
    cartItemCard: {
        backgroundColor: '#FFFFFF',
        width: Dimensions.get('window').width - 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginHorizontal: 10,
        ...P1Styles.shadow
    },
    bottomSheetControlPanel: {
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        marginBottom: 0,
        ...P1Styles.shadowTop
    },
    cartStatus: {
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        ...P1Styles.shadowDark
    }
})

const itemInitialFormStateParser = (item: any) => ({
    id: item.id,
    name: item.name,
    billQty: 1,
    expiry: item.expiry,
    price: item.sellingPrice,
    mrp: item.mrp,
    discount: 0,
    effPtr: item.effPtr,
    gst: item.gst,
    gstAmount: 0,
    cgst: 0,
    sgst: 0,
    unitRatio: item.unitRatio || 1,
    looseEnabled: item.looseEnabled,
    stock: 0,
    itemAmount: 0,
    marginPercent: item.marginPercent,
    netItemAmount: 0,
    wantedNoteId: item.wantedNoteId,
    hsnCode: item.hsnCode,
    packaging: item.packaging,
    rack: item.rack || ""
})

const ItemDetailsForm = ({ itemAbstract, index, onSubmit, loadItem, onClose }: { itemAbstract: any, index: number, onSubmit: Function, loadItem: Function, onClose: Function }) => {
    const [mounted, setMounted] = useState(false);
    const [firstRender, setFirstRender] = useState(true);
    const [item, setItem] = useState<any>({});
    const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);
    const [editingUnitRatio, setEditingUnitRatio] = useState(false);
    const [selectedItem, setSelectedItem] = useState(itemInitialFormStateParser(item));
    const [looseEnabled, setLooseEnabled] = useState(false)

    const parseBatchData = () => {
        const { batchNo, id, expiry, stock } = item.batches[selectedBatchIndex];

        return ({
            batchNo,
            batchId: id,
            expiry,
            stock
        })
    }

    useEffect(() => {
        if (!mounted) {
            loadItem(
                itemAbstract,
                (data: any) => {
                    setItem(data);
                    setSelectedItem(itemInitialFormStateParser(data));
                    setMounted(true);
                },
                (error: any) => {
                    setMounted(true);
                }
            )
        }
    }, [mounted]);

    useEffect(() => {
        setSelectedItem((selectedItem) => ({ ...selectedItem, mrp: (item.batches || [])[selectedBatchIndex]?.mrp, price: (looseEnabled ? ((item.batches || [])[selectedBatchIndex]?.mrp / selectedItem.unitRatio) : ((item.batches || [])[selectedBatchIndex]?.mrp)) }))
    }, [selectedBatchIndex, item])

    useEffect(() => {
        if (!firstRender) {
            if (looseEnabled) {
                setSelectedItem((selectedItem) => ({ ...selectedItem, price: (Math.round((+(selectedItem.price) / +(selectedItem.unitRatio) * 100)) / 100) }))
            } else {
                setSelectedItem((selectedItem) => ({ ...selectedItem, price: (+(selectedItem.price) * +(selectedItem.unitRatio)) }))
            }
        } else if (!isEmptyObj(item)) {
            setFirstRender(false);
        }
    }, [looseEnabled, item])

    const submit = () => {
        onSubmit({
            ...selectedItem,
            looseEnabled,
            ...parseBatchData(),
            ...calculateTotal({
                mrp: selectedItem.price,
                qty: selectedItem.billQty,
                discount: selectedItem.discount,
                gst: selectedItem.gst
            })
        })

        onClose();
    }

    return (
        <>
            {
                (mounted && item)
                    ? (

                        <View px={2} w='100%'>
                            <Text style={styles.BSItemTitle}>{item.name}</Text>
                            <HStack alignItems="center" justifyContent="space-between">
                                <BottomActionSheet
                                    handle={(
                                        <>
                                            <Text style={{ ...styles.detailItem, marginBottom: 5 }}>
                                                Batch Number
                                            </Text>
                                            <View style={styles.elevatedCard}>
                                                <Text style={styles.customInputText}>
                                                    {item.batches[selectedBatchIndex]?.batchNo}
                                                </Text>
                                                <ChevronDownIcon />
                                            </View>
                                        </>
                                    )}
                                    handleContainerStyle={{ width: '75%' }}
                                    actionSheetStyle={styles.actionSheetStyle}
                                    SheetContent={
                                        ({ onClose }: { onClose: Function }) => (<>
                                            {item.batches.map((batch: any, index: number) => (
                                                (
                                                    <TouchableOpacity
                                                        key={batch.id}
                                                        style={styles.batchSelectCard}
                                                        onPress={() => {
                                                            setSelectedBatchIndex(index);
                                                            onClose();
                                                        }}
                                                    >
                                                        <Text style={{ ...styles.itemTitle, width: '40%' }}>
                                                            {batch.batchNo}
                                                        </Text>
                                                        <HStack alignItems="center" justifyContent="space-between" width="60%">
                                                            <Text style={styles.detailItem}>
                                                                ₹ {batch.mrp}
                                                            </Text>
                                                            <Text style={styles.detailItem}>
                                                                {batch.stock}
                                                            </Text>
                                                            <Text style={styles.detailItem}>
                                                                {moment.unix(batch.expiry).format('MM/YY')}
                                                            </Text>
                                                        </HStack>
                                                    </TouchableOpacity>
                                                )
                                            ))}
                                        </>)
                                    }
                                />
                                <VStack alignItems="center" space={4}>
                                    <Text>Loose Billing</Text>
                                    <Switch isChecked={looseEnabled} onToggle={setLooseEnabled} onTrackColor="#2E6ACF" size="md" />
                                </VStack>
                            </HStack>
                            <HStack alignItems="center" justifyContent="space-between" px={2} marginTop={3}>
                                <Text fontSize={14}>
                                    M.R.P.: {item.batches[selectedBatchIndex]?.mrp}
                                </Text>
                                <Text fontSize={14}>
                                    Batch Stock: {item.batches[selectedBatchIndex]?.stock}
                                </Text>
                                <Text fontSize={14}>
                                    Margin (%): {+(selectedItem.marginPercent || 0).toFixed(2)}
                                </Text>
                            </HStack>
                            {
                                looseEnabled
                                && <HStack alignItems="center" mx={2} marginTop={1}>
                                    <Text fontSize={14}>
                                        Number of Units:
                                    </Text>
                                    <View style={{ width: 50, marginLeft: 10, ...(editingUnitRatio ? styles.elevatedInput : {}) }}>
                                        <Input
                                            borderColor='transparent'
                                            size="xl"
                                            placeholder="Unit Ratio"
                                            w="100%"
                                            _input={{
                                                style: { fontSize: 14, ...(editingUnitRatio ? {} : { paddingVertical: 0, paddingHorizontal: 0 }) }
                                            }}
                                            value={(selectedItem.unitRatio === undefined) ? undefined : `${selectedItem.unitRatio || ''}`} onChangeText={(text) => setSelectedItem({ ...selectedItem, unitRatio: +(text) })}
                                            onFocus={() => setEditingUnitRatio(true)}
                                            onBlur={() => setEditingUnitRatio(false)}
                                            _focus={{
                                                borderColor: 'transparent',
                                                backgroundColor: 'transparent',
                                            }}
                                        />
                                    </View>
                                    <IconButton icon={<FontAwesomeIcon icon={'pen'} size={12} color="#2E6ACF" />} onPress={() => editingUnitRatio ? setEditingUnitRatio(false) : setEditingUnitRatio(true)} />
                                </HStack>
                            }
                            <HStack alignItems="center" justifyContent="space-between" my={2}>
                                <View flex={1} mx={1}>
                                    <Text style={{ ...styles.detailItem, marginTop: 0, marginBottom: 5 }} marginLeft={1}>
                                        {looseEnabled ? 'Unit MRP (₹)' : 'MRP (₹)'}
                                    </Text>
                                    <View style={styles.elevatedInput}>
                                        <Input
                                            borderColor='transparent'
                                            size="xl"
                                            placeholder="MRP"
                                            w="100%"
                                            value={(selectedItem.price === undefined) ? undefined : `${selectedItem.price.toFixed(2)}`} onChangeText={(text) => setSelectedItem({ ...selectedItem, price: +(text) })}
                                            _focus={{
                                                borderColor: 'transparent',
                                                backgroundColor: 'transparent',
                                            }}
                                        />
                                    </View>
                                </View>
                                <View flex={1} mx={1}>
                                    <Text style={{ ...styles.detailItem, marginTop: 0, marginBottom: 5 }} marginLeft={1}>
                                        Discount (%)
                                    </Text>
                                    <View style={styles.elevatedInput}>
                                        <Input
                                            borderColor='transparent'
                                            size="xl"
                                            placeholder="Discount"
                                            w="100%"
                                            defaultValue="0"
                                            value={(selectedItem.discount === undefined) ? undefined : `${selectedItem.discount}`} onChangeText={(text) => setSelectedItem({ ...selectedItem, discount: +(text) })}
                                            _focus={{
                                                borderColor: 'transparent',
                                                backgroundColor: 'transparent',
                                            }}
                                        />
                                    </View>
                                </View>
                                <View flex={1} mx={1}>
                                    <Text style={{ ...styles.detailItem, marginTop: 0, marginBottom: 5 }} marginLeft={1}>
                                        {looseEnabled ? 'Loose Qty*' : 'Qty*'}
                                    </Text>
                                    <View style={styles.elevatedInput}>
                                        <Input
                                            borderColor='transparent'
                                            size="xl"
                                            placeholder="Bill Quantity"
                                            w="100%"
                                            defaultValue="1"
                                            value={(selectedItem.billQty === undefined) ? undefined : `${selectedItem.billQty}`} onChangeText={(text) => setSelectedItem({ ...selectedItem, billQty: +(text) })}
                                            _focus={{
                                                borderColor: 'transparent',
                                                backgroundColor: 'transparent',
                                            }}
                                        />
                                    </View>
                                </View>
                            </HStack>
                            <Button my={2} style={styles.submitButton} onPress={submit}>
                                Done
                            </Button>
                        </View>
                    )
                    : <LoadingScreen />
            }
        </>

    )
}

const ItemsSelect = (props: any) => {
    const saleIndex = props.route.params.saleIndex;
    const [mounted, setMounted] = useState(false);
    const [clearDialogOpen, setDialogOpen] = useState(false);
    const [excludeOutOfStock, setExcludeOutOfStock] = useState(false);
    const [searchItem, setSearchItem] = useState('');
    const [searchState, setSearchState] = useState({
        items: [],
        rawItems: [],
        inStock: [],
        searching: false
    })
    const [searchUnderFocus, setSearchUnderFocus] = useState(false);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

    const setPartialSearchState = (args: any) => setSearchState(searchState => ({ ...searchState, ...args }));

    const { bottom } = useSafeAreaInsets();

    const { APIGet } = useContext(APIContext);

    const { showToast } = useContext(ToastContext);

    const { saleFormState, getSalePatcherByIndex } = useContext(FormStateContext);

    const saleStatePatcher = getSalePatcherByIndex(saleIndex);

    const screenTitle = 'Bill Items';

    const loadItem = (item: any, resolve: Function = (() => { }), reject: Function = (() => { })) => {
        APIGet(
            {
                url: getURL({
                    key: 'SKU_STOCK',
                    pathParams: item.id,
                }),
                resolve: (response: any) => {
                    if (!response.data) {
                        throw response;
                    }


                    resolve(response.data)
                },
                reject: (error: any) => {
                    reject(error)
                    showToast(ToastProfiles.error)
                }
            }
        )
    }

    const debounce = (debounceHandler: Function, delay: number) => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        const timeout = setTimeout(() => {
            debounceHandler();
        }, delay);
        setTypingTimeout(timeout);
    };

    const performSearch = (searchItem: string) => {
        APIGet(
            {
                url: getURL({
                    key: 'SEARCH_SALES_ITEM',
                    queryParams: {
                        search: searchItem
                    }
                }),
                resolve: (response: any) => {
                    if (!response.data) {
                        throw response;
                    }

                    let items = response.data?.items;

                    const inStock = response.data?.items.filter(((item: any) => {
                        const unitStock = unitStockCount(item.stock);

                        return (unitStock > 0)
                    }));

                    setSearchState({
                        items: excludeOutOfStock ? inStock : response.data?.items,
                        rawItems: response.data?.items,
                        inStock,
                        searching: false
                    })
                },
                reject: (error: any) => {
                    showToast(ToastProfiles.error)
                }
            }
        )
    };

    const onSearchItemChange = (text: string) => {
        if (text.length >= 3) {
            setPartialSearchState({ searching: true })
            debounce(() => performSearch(text), 500);
        }

        setSearchItem(text);
    }

    useEffect(() => {
        if (!mounted) {
            setSelectedItems(saleFormState[saleIndex].items);
            setMounted(true);
        }
    }, [mounted])

    useEffect(() => {
        setPartialSearchState({
            items: (excludeOutOfStock ? searchState.inStock : searchState.rawItems)
        });
    }, [excludeOutOfStock])

    const addItem = (item: any) => {
        setSelectedItems([...selectedItems, item])
    }

    const submitItems = () => {
        saleStatePatcher({ items: [...saleFormState[saleIndex].items, ...selectedItems] });

        props.navigation.goBack();
    }

    const removeItem = (index: number) => {
        const saleItems = [...selectedItems];

        saleItems.splice(index, 1);

        setSelectedItems(saleItems)
    }

    const manipulateItemQty = (action: string, itemIndex: number) => {
        let items = [...selectedItems];

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
                        overallDiscount: saleFormState[saleIndex].discountPercent,
                        gst: item.gst
                    }))
                }
            )
        )

        setSelectedItems(items)
    }

    const clearCart = () => {
        setSelectedItems([]);
        toggleClearDialogOpen();
    }

    const toggleClearDialogOpen = () => setDialogOpen(!clearDialogOpen);

    const keyboardBottomInset = useKeyboardBottomInset();

    return (
        <>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <Box safeAreaTop bg="#FFFFFF" zIndex={10000} />
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

            <KeyboardAvoidingView behavior="padding" style={styles.formBase}>
                <View height="100%" style={{
                    height: '100%',
                    justifyContent: 'flex-end'
                }}>
                    <ScrollView keyboardShouldPersistTaps="handled" position="absolute" zIndex={-1} height="100%">
                        <View style={{
                            height: ((keyboardBottomInset > 0) ? 80 : 200),
                            width: Dimensions.get('window').width,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} >
                            {
                                ((searchItem.length >= 3) || (searchState.rawItems.length > 0))
                                    ? (
                                        searchState.searching
                                            ? <HStack alignItems="center">
                                                <Spinner color='#2E6ACF' marginRight={2} alignSelf='center' />
                                                <Text color="#A0A0A0">
                                                    Searching...
                                                </Text>
                                            </HStack>
                                            : <VStack alignItems="center">
                                                <Text style={{...styles.itemTitle, color: '#2E6ACF'}}>
                                                    Search Results: {searchState.items.length} item(s) found
                                                </Text>
                                                {
                                                    (searchState.rawItems.length - searchState.inStock.length) > 0
                                                    && <HStack marginTop={2} alignItems="center">
                                                        <Text>
                                                            {searchState.rawItems.length - searchState.inStock.length} item(s) out of stock
                                                        </Text>
                                                    </HStack>
                                                }
                                                <HStack alignItems="center">
                                                    <Text>
                                                        Exclude Out of Stock:
                                                    </Text>
                                                    <Switch isChecked={excludeOutOfStock} onToggle={setExcludeOutOfStock} onTrackColor="#2E6ACF" size="sm" />
                                                </HStack>
                                            </VStack>
                                    )
                                    : <Text style={{ ...styles.itemTitle, color: '#A0A0A0', fontWeight: '400' }}>
                                        Enter at least 3 characters to begin search
                                    </Text>
                            }
                        </View>
                        <FlatList
                            bounces={false}
                            data={searchState.items}
                            renderItem={({ item, index }: { item: any, index: number }) => (
                                <HStack key={item.id} style={styles.listItemCard}>
                                    <VStack width="75%">
                                        <View style={styles.itemTitleContainer}>
                                            <Text style={styles.itemTitle}>
                                                {item.name}
                                            </Text>
                                        </View>
                                        <Text style={styles.detailItem}>
                                            Pack: {item.packaging}
                                        </Text>
                                        <HStack>
                                            <Text style={styles.detailItem}>
                                                MRP: {item.mrp}
                                            </Text>
                                            <Text style={styles.detailItem}>
                                                Stock: {item.stock}
                                            </Text>
                                        </HStack>
                                    </VStack>
                                    <BottomActionSheet
                                        handle={(<View style={styles.addButton}>
                                            <Text color="#FFFFFF" fontSize={14}>
                                                + Add
                                            </Text>
                                        </View>)}
                                        beforeOpen={() => Keyboard.dismiss()}
                                        actionSheetStyle={styles.actionSheetStyle}
                                        SheetContent={({ onClose }: { onClose: Function }) => (
                                            <ItemDetailsForm
                                                itemAbstract={item}
                                                index={index}
                                                onSubmit={addItem}
                                                loadItem={loadItem}
                                                onClose={onClose}
                                            />
                                        )}
                                    />
                                </HStack>
                            )}
                            keyExtractor={((item: any, index: number) => item.id + index)}
                        />
                        <View height={150} />
                    </ScrollView>
                    <HStack safeAreaBottom style={styles.footer}>
                        <VStack>
                            <View style={styles.inputBox}>
                                <Input
                                    autoFocus
                                    borderColor='transparent'
                                    size="xl"
                                    placeholder="Search for an Item or Medicine"
                                    w="100%"
                                    value={searchItem} onChangeText={onSearchItemChange}
                                    InputLeftElement={<SearchIcon style={styles.searchIcon} />}
                                    _focus={{
                                        borderColor: 'transparent',
                                        backgroundColor: 'transparent',
                                    }}
                                    // onFocus={() => setSearchUnderFocus(true)}
                                    // onBlur={() => setSearchUnderFocus(false)}
                                />
                            </View>
                            <HStack style={styles.submissionFooter}>
                                <BottomActionSheet
                                    handle={(
                                        <VStack>
                                            <HStack>
                                                <Text style={{ marginRight: 5, color: '#2E6ACF' }}>
                                                    {selectedItems.length} Item(s)
                                                </Text>
                                                <Text style={{ marginRight: 5 }}>
                                                    {selectedItems.reduce((totalQuantity: number, currentItem: any) => {
                                                        return totalQuantity + currentItem.billQty
                                                    }, 0)} Quantity
                                                </Text>
                                            </HStack>
                                            <HStack>
                                                <Text style={{ marginRight: 5, color: '#2E6ACF', fontWeight: '700' }}>
                                                    ₹ {selectedItems.reduce((total: number, currentItem: any) => +(+(total) + currentItem.netItemAmount).toFixed(2), 0)}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    )}
                                    beforeOpen={() => Keyboard.dismiss()}
                                    handleContainerStyle={{ width: '75%' }}
                                    actionSheetStyle={{ ...styles.actionSheetStyle, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 }}
                                    SheetContent={
                                        ({ onClose }: { onClose: any }) => (
                                            <>
                                                <HStack style={styles.cartStatus} px={5} py={2}>
                                                    <VStack flex={1} borderRightWidth={1} borderRightColor="#3F3E60" marginRight={5}>
                                                        <Text style={{ ...styles.detailItem, color: '#606060', fontWeight: '700', marginTop: 0, marginRight: 0 }}>
                                                            Items: {selectedItems.length}
                                                        </Text>
                                                        <Text style={{ ...styles.detailItem, color: '#606060', fontWeight: '700', marginTop: 0, marginRight: 0 }}>
                                                            Quantity: {selectedItems.reduce((totalQuantity: number, currentItem: any) => {
                                                                return totalQuantity + currentItem.billQty
                                                            }, 0)}
                                                        </Text>
                                                    </VStack>
                                                    <Text width="55%" style={{ ...styles.cardTitle, fontWeight: '700', fontSize: 22, textAlign: 'right' }}>
                                                        Total: ₹ {selectedItems.reduce((total: number, currentItem: any) => +(+(total) + currentItem.netItemAmount).toFixed(2), 0)}
                                                    </Text>
                                                </HStack>
                                                {
                                                    (selectedItems.length === 0)
                                                        ? <View width="100%" height={250} justifyContent="center" alignItems="center">
                                                            <Text style={{ ...styles.itemTitle, color: '#3F3E60', textAlign: 'center' }}>
                                                                Items that you add to your cart
                                                            </Text>
                                                            <Text style={{ ...styles.itemTitle, color: '#3F3E60', textAlign: 'center' }}>
                                                                will show up here.
                                                            </Text>
                                                        </View>
                                                        : <>
                                                            <FlatList
                                                                bounces={false}
                                                                data={saleFormState[saleIndex].items}
                                                                renderItem={({ item, index: itemIndex }: { item: any, index: number }) => (
                                                                    <View key={itemIndex} style={styles.cartItemCard}>
                                                                        <HStack alignItems="center" justifyContent="space-between">
                                                                            <Text style={styles.cardTitle}>
                                                                                {item.name}
                                                                            </Text>
                                                                            <IconButton borderRadius={20} padding={0} icon={<FontAwesomeIcon icon="circle-xmark" size={15} />} onPress={() => removeItem(itemIndex)} />
                                                                        </HStack>
                                                                        <HStack justifyContent="space-between">
                                                                            <VStack width="60%">
                                                                                <HStack justifyContent="space-between">
                                                                                    <Text style={styles.cardCardDetailItem}>
                                                                                        B.No.: {item.batchNo}
                                                                                    </Text>
                                                                                    <Text style={styles.cardCardDetailItem}>
                                                                                        MRP: {item.price}
                                                                                    </Text>
                                                                                </HStack>
                                                                                <HStack justifyContent="space-between">
                                                                                    <Text style={styles.cardCardDetailItem}>
                                                                                        Stock: {item.stock}
                                                                                    </Text>
                                                                                    <Text style={styles.cardCardDetailItem}>
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
                                                                )}
                                                                keyExtractor={((item: any, index: number) => item.id + index)}
                                                            />
                                                        </>
                                                }
                                                <VStack style={styles.bottomSheetControlPanel}>
                                                    <HStack px={2} py={2} paddingBottom={(bottom > 0) ? 5 : 2}>
                                                        {
                                                            (selectedItems.length > 0)
                                                            && <Button style={{ ...styles.submitButton, backgroundColor: '#D00000', flex: 1, marginRight: 5 }} onPress={toggleClearDialogOpen}>
                                                                Clear Cart
                                                            </Button>
                                                        }
                                                        <Button style={{ ...styles.submitButton, flex: 1, marginLeft: 5 }} onPress={onClose}>
                                                            Close
                                                        </Button>
                                                    </HStack>
                                                </VStack>
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
                                            </>
                                        )
                                    }
                                />
                                <Button style={styles.submitButton} onPress={submitItems}>
                                    Done
                                </Button>
                            </HStack>
                        </VStack>
                    </HStack>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}

export default ItemsSelect;