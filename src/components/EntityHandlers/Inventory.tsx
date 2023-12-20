import { getURL } from "@APIRepository";
import { ListView } from "@Containers";
import P1Styles from "@P1StyleSheet";
import { ToastProfiles } from "@ToastProfiles";
import { LoadingScreen } from "@commonComponents";
import { APIContext, AuthContext, ToastContext } from "@contextProviders";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import moment from "moment";
import { AddIcon, Fab, View } from "native-base";
import { useContext, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const cardPropParser = (item: any) => ({
    id: item.id,
    title: item.name || '',
    details: [
        `${item.packaging || '-'}`
    ],
    highlightDetails: [
        `Stock: ${item.stock}`,
        `MRP: ₹ ${item.mrp.toFixed(2)}`
    ],
    imgURL: item.appImage
})

const Inventory = ({ isFocused, bottomTabsMounted }: { isFocused: boolean, bottomTabsMounted?: boolean }) => {
    const [mounted, setMounted] = useState(false);
    const [inventoryData, setInventoryData] = useState<{ [key: string]: any | undefined }>({ loaded: false });
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedFilter, setSelectedFilter] = useState('');
    let { bottom } = useSafeAreaInsets();

    const alphabetArray = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));

    const quickFilters = ['#', ...alphabetArray].map((alphabet)=> ({title: alphabet, key: alphabet}))

    const FABBottom = bottom + 5;

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const { APIGet } = useContext(APIContext);

    const { authStatus } = useContext(AuthContext)

    const { showToast } = useContext(ToastContext);

    const fetchRenderData = ({ onCompleteCallback, isRefreshing }: { onCompleteCallback?: Function, isRefreshing?: boolean }) => {
        if (!isRefreshing) {
            setLoading(true);
            setInventoryData({ ...inventoryData, loaded: false })
        }
        APIGet({
            url: getURL({
                key: 'ALL_SKU'
            }),
            resolve: (response: any) => {
                if (!response.data) {
                    throw response;
                }

                const itemsWithCardID = (response.data?.items || []).map((item: any) => ({ ...item, card_id: 'card_7' }));

                setInventoryData({ ...response.data, items: itemsWithCardID, rawItems: itemsWithCardID, loaded: true });

                if (!mounted) {
                    setMounted(true);
                }

                (onCompleteCallback || (() => { }))()
            },
            reject: (error: any) => {
                showToast(ToastProfiles.error)

                if (!mounted) {
                    setMounted(true);
                }

                (onCompleteCallback || (() => { }))()
            }
        })
    }

    useEffect(() => {
            let filteredItems;

            if(selectedFilter === '#'){
                filteredItems = inventoryData.rawItems.filter((item: any) => /^[0-9]/.test(item.name))
            } else if(alphabetArray.includes(selectedFilter)) {
                filteredItems = inventoryData.rawItems.filter((item: any) => ((new RegExp(`^${selectedFilter}`, 'i')).test(item.name)))
            }

            setInventoryData({...inventoryData, items: filteredItems});
    }, [selectedFilter])

    useEffect(() => {
        if (!mounted) {
            fetchRenderData({});
        }
    }, [mounted])

    useEffect(() => {
        if (inventoryData.loaded) {
            setLoading(false);
        }
    }, [inventoryData.loaded])

    useEffect(() => {
        fetchRenderData({});
    }, [authStatus])

    const onFilterSelect = (filter: any) => {
        setSelectedFilter(filter.key)
    }

    const onRefresh = (setRefreshing: Function) => {
        setRefreshing(true);
        fetchRenderData({
            onCompleteCallback: () => setRefreshing(false),
            isRefreshing: true
        })
    }

    return (
        <View>
            {
                loading
                    ? <LoadingScreen />
                    : <ListView
                        title={`Products (${(inventoryData.items || []).length} items)`}
                        searchPlaceholder='Search Product'
                        bottomTabsMounted={bottomTabsMounted}
                        filtersEnabled
                        filters={quickFilters}
                        selectedFilter={selectedFilter}
                        onFilterSelect={onFilterSelect}
                        onRefresh={onRefresh}
                        list={(inventoryData.items || []).map((item: any) => ({
                            ...item,
                            action: 'push',
                            actionParams: [
                                'TabScreen',
                                {
                                    url: getURL({
                                        key: 'BILL_ENTRY',
                                        pathParams: item.id
                                    }),
                                    detailsDisplayProfile: 'bill',
                                    screenTitle: item.billedNo
                                }
                            ]
                        }))}
                        searchFilter={(keyword: string, item: any) => item.name.split(' ').reduce((matchFound: boolean, word: string) => (matchFound || (new RegExp(`^${keyword}`, 'i')).test(word)), false)}
                        cardPropParser={cardPropParser}
                    />
            }
            {/* {
                isFocused
                && <Fab
                    placement="bottom-right"
                    bgColor="#2E6ACF"
                    icon={<AddIcon color="#FFFFFF" />}
                    label="New Sale"
                    bottom={bottomTabsMounted ? FABBottom + 70 : FABBottom}
                    style={{ ...P1Styles.shadow }}
                    onPress={() => navigation.push('CreateBill')}
                />
            } */}
        </View>
    );
}

export default Inventory;