import { getURL } from "@APIRepository";
import { ListView } from "@Containers";
import P1Styles from "@P1StyleSheet";
import { ToastProfiles } from "@ToastProfiles";
import { LoadingScreen } from "@commonComponents";
import { APIContext, AuthContext, ToastContext } from "@contextProviders";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import moment from "moment";
import { AddIcon, Fab, Text, View } from "native-base";
import { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const styles = StyleSheet.create({
    itemsQtyBadge: {
        color: '#2E6ACF',
        fontWeight: '700'
    },
    itemsQtyBadgeButton: {
        backgroundColor: '#2E6ACF',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 2
    },
    itemsQtyBadgeButtonLabel: {
        color: '#FFFFFF',
        fontWeight: '700'
    },
})

const summaryProfile = [
    {
        title: 'Total Bills',
        key: 'billCount',
        card_id: 'card_6',
        valueReducer: (value: number) => value
    },
    {
        title: 'Net Amount',
        key: 'totalNetAmount',
        card_id: 'card_6',
        valueReducer: (value: number) => `₹ ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
    },
    {
        title: 'Total Tax',
        key: 'totalTax',
        card_id: 'card_6',
        valueReducer: (value: number) => `₹ ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
    },
]

const timeFilterStateReducers: { [key: string]: any } = {
    today: () => ({
        from: Math.floor(moment().unix()),
        to: Math.floor(moment().unix())
    }),
    'this-week': () => ({
        from: Math.floor(moment().startOf('week').unix()),
        to: Math.floor(moment().unix())
    }),
    'this-month': () => ({
        from: Math.floor(moment().startOf('month').unix()),
        to: Math.floor(moment().unix())
    }),
    'last-3-months': () => ({
        from: Math.floor(moment().subtract(2, 'months').startOf('month').unix()),
        to: Math.floor(moment().unix())
    }),
}

const cardPropParser = (item: any) => ({
    id: item.id,
    title: `Invoice: #${item.invoiceNo}`,
    subtitle: `₹ ${item.netTotalAmount.toFixed(2)}`,
    details: [
        `${moment.unix(item.invoicedOn).format('DD-MMM-YYYY | hh:mm A')}`,
        `Purchase ID: ${item.purchaseNo}`,
        `Supplier: ${item.supplierName}`,
        `Created On: ${moment.unix(item.createdOn).format('DD-MMM-YYYY | hh:mm A')}`
    ],
    badge: (
        item.items.length > 0
            ? (
                <View style={styles.itemsQtyBadgeButton}>
                    <Text style={styles.itemsQtyBadgeButtonLabel}>
                        {`${(item.items || []).length} item(s)`}
                    </Text>
                </View>
            )
            :
            <Text style={styles.itemsQtyBadge}>
                {`${(item.items || []).length} item(s)`}
            </Text>
    ),
    nestedList: item.items.map((nestedListItem: any) => ({
        id: item.id,
        title: nestedListItem.name,
        subtitle: nestedListItem.packaging,
        details: [
            `Quantity: ${nestedListItem.qty || ''}`,
            `Total: ${nestedListItem.netItemAmount || ''}`
        ]
    }))
})

const PurchasesTabPanel = () => {
    const [mounted, setMounted] = useState(false);
    const [purchasesData, setPurchasesData] = useState<{ [key: string]: any | undefined }>({ loaded: false });
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedFilter, setSelectedFilter] = useState('today');
    const [selectedDateRange, setSelectedDateRange] = useState({
        from: Math.floor(moment().unix()),
        to: Math.floor(moment().unix())
    })
    const { bottom } = useSafeAreaInsets();

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const isFocused = useIsFocused();

    const { APIGet } = useContext(APIContext);

    const { authStatus } = useContext(AuthContext)

    const { showToast } = useContext(ToastContext);

    const fetchRenderData = ({ onCompleteCallback, isRefreshing }: { onCompleteCallback?: Function, isRefreshing?: boolean }) => {
        if (!isRefreshing) {
            setLoading(true);
            setPurchasesData({ ...purchasesData, loaded: false })
        }
        APIGet({
            url: getURL({
                key: 'PURCHASE_DASHBOARD',
                queryParams: {
                    from: selectedDateRange.from,
                    to: selectedDateRange.to,
                    type: 'bills'
                }
            }),
            resolve: (response: any) => {
                if (!response.data) {
                    throw response;
                }

                setPurchasesData({ ...response.data, items: (response.data?.items || []).map((item: any) => ({ ...item, card_id: 'card_5' })), loaded: true });

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
        if (!['none', 'custom'].includes(selectedFilter)) {
            setSelectedDateRange(timeFilterStateReducers[selectedFilter]())
        }
    }, [selectedFilter])

    useEffect(() => {
        if (!mounted) {
            fetchRenderData({});
        }
    }, [mounted])

    useEffect(() => {
        fetchRenderData({});
    }, [selectedDateRange])

    useEffect(() => {
        if (purchasesData.loaded) {
            setLoading(false);
        }
    }, [purchasesData.loaded])

    useEffect(() => {
        fetchRenderData({});
    }, [authStatus])

    const quickFilters = [
        {
            title: 'Today',
            key: 'today'
        },
        {
            title: 'This Week',
            key: 'this-week'
        },
        {
            title: 'This Month',
            key: 'this-month'
        }, ,
        {
            title: 'Last 3 Months',
            key: 'last-3-months'
        },
    ]

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
                        title='Purchases'
                        searchPlaceholder='Search Purchase'
                        bottomTabsMounted
                        filtersEnabled
                        filters={quickFilters}
                        floatingAction={{
                            icon: <AddIcon color="#2E6ACF" />,
                            action: ()=>navigation.push('CreatePurchase')
                        }}
                        selectedFilter={selectedFilter}
                        onFilterSelect={onFilterSelect}
                        onRefresh={onRefresh}
                        list={(purchasesData.items || []).map((item: any) => ({
                            ...item,
                            action: 'push',
                            actionParams: [
                                'TabScreen',
                                {
                                    url: getURL({
                                        key: 'PURCHASE_ENTRY',
                                        pathParams: item.id
                                    }),
                                    detailsDisplayProfile: 'purchase',
                                    screenTitle: item.invoiceNo
                                }
                            ]
                        }))}
                        searchFilter={(keyword: string, item: any) => ((new RegExp(`^${keyword}`, 'i')).test(item.invoiceNo))}
                        cardPropParser={cardPropParser}
                        summaryBlocks={
                            summaryProfile.map((item: any) => ({
                                title: item.title,
                                key: item.key,
                                card_id: item.card_id,
                                value: (item.valueReducer || ((value: number) => value))(purchasesData[item.key])
                            }))
                        }
                    />
            }
            {/* {
                isFocused
                && <Fab
                    placement="bottom-right"
                    bgColor="#2E6ACF"
                    icon={<AddIcon color="#FFFFFF" />}
                    label="New Purchase"
                    bottom={bottom + 75}
                    style={{ ...P1Styles.shadow }}
                    onPress={()=>navigation.push('CreatePurchase')}
                />
            } */}
        </View>
    );
}

export default PurchasesTabPanel;