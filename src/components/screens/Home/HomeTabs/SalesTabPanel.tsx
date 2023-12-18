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
import { AddIcon, Fab, View } from "native-base";
import { useContext, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

const cardPropParser = (item: any) => ({
    id: item.id,
    title: `Bill: #${item.billedNo}`,
    subtitle: `₹ ${item.netAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
    details: [
        `${moment.unix(item.billedOn).format('DD-MMM-YYYY | hh:mm A')}`,
        `Customer: ${item.name}`,
        `Billed by: ${item.billerName}`,
        `Created On: ${moment.unix(item.createdOn).format('DD-MMM-YYYY | hh:mm A')}`
    ],
})

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

const SalesTabPanel = () => {
    const [mounted, setMounted] = useState(false);
    const [salesData, setSalesData] = useState<{ [key: string]: any | undefined }>({ loaded: false });
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
            setSalesData({ ...salesData, loaded: false })
        }
        APIGet({
            url: getURL({
                key: 'SALE_DASHBOARD',
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

                setSalesData({ ...response.data, items: (response.data?.items || []).map((item: any) => ({ ...item, card_id: 'card_5' })), loaded: true });

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
        if (salesData.loaded) {
            setLoading(false);
        }
    }, [salesData.loaded])

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
                        title='Sales'
                        searchPlaceholder='Search Sale'
                        bottomTabsMounted
                        filtersEnabled
                        filters={quickFilters}
                        floatingAction={{
                            icon: <AddIcon color="#FFFFFF" />,
                            action: ()=>navigation.push('CreateBill')
                        }}
                        selectedFilter={selectedFilter}
                        onFilterSelect={onFilterSelect}
                        onRefresh={onRefresh}
                        list={(salesData.items || []).map((item: any) => ({
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
                        searchFilter={(keyword: string, item: any) => ((new RegExp(`^${keyword}`, 'i')).test(item.billedNo))}
                        cardPropParser={cardPropParser}
                        summaryBlocks={
                            summaryProfile.map((item: any) => ({
                                title: item.title,
                                key: item.key,
                                card_id: item.card_id,
                                value: (item.valueReducer || ((value: number) => value))(salesData[item.key])
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
                    label="New Sale"
                    bottom={bottom + 75}
                    style={{ ...P1Styles.shadow }}
                    onPress={()=>navigation.push('CreateBill')}
                />
            } */}
        </View>
    );
}

export default SalesTabPanel;