import { getURL } from "@APIRepository";
import { ListView } from "@Containers";
import { ToastProfiles } from "@ToastProfiles";
import { LoadingScreen } from "@commonComponents";
import { APIContext, AuthContext, ToastContext } from "@contextProviders";
import moment from "moment";
import { Text, View } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";

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
        title: 'Total Orders',
        key: 'totalOrders',
        card_id: 'card_6',
        valueReducer: (value: number) => value
    },
    {
        title: 'Total Delivered',
        key: 'totalDelivered',
        card_id: 'card_6',
        valueReducer: (value: number) => value
    },
    {
        title: 'Total Sales',
        key: 'totalSales',
        card_id: 'card_6',
        valueReducer: (value: number) => `₹ ${value.toLocaleString('en-US', {maximumFractionDigits:2})}`
    },
]

const statusProfiles: {
    [key: string]: {
        title: string,
        color: string
    }
} = {
    picked: { title: 'Picked', color: '#EEEEFF' },
    pending: { title: 'Pending', color: '#FF0000' },
    to_pick: { title: 'Ready to Pick', color: '#FFAAAA' },
    request_payment: { title: 'Request Payment', color: '#EEFFEE' },
    delivered: { title: 'Delivered', color: '#0000FF' },
    shipped: { title: 'Shipped', color: '#AAAAFF' },
    rejected: { title: 'Rejected', color: '#FF5555' }
}

const sections = [
    {
        SectionComponent: React.Fragment,
        title: 'Pending',
        filter: ((item: any) => (item.status == 'pending'))
    },
    // {
    //     SectionComponent: React.Fragment,
    //     title: 'Dunzo Pending',
    //     filter: ((item: any) => (item.status == 'pending'))
    // },
    // {
    //     SectionComponent: React.Fragment,
    //     title: 'Ready to Ship',
    //     filter: ((item: any) => (item.status == 'pending'))
    // },
    {
        SectionComponent: React.Fragment,
        title: 'Ready to be Picked',
        filter: ((item: any) => (item.status == 'to_pick'))
    },
    {
        SectionComponent: React.Fragment,
        title: 'Delivery In-Progress',
        filter: ((item: any) => (item.status == 'shipped'))
    },
    {
        SectionComponent: React.Fragment,
        title: 'Delivered',
        filter: ((item: any) => (item.status == 'delivered'))
    },
    {
        SectionComponent: React.Fragment,
        title: 'Picked Up',
        filter: ((item: any) => (item.status == 'picked'))
    },
    {
        SectionComponent: React.Fragment,
        title: 'Cancelled',
        filter: ((item: any) => (item.status == 'rejected'))
    }
]

const cardPropParser = (item: any) => ({
    id: item.id,
    title: `Order: #${item.orderNo}`,
    subtitle: `${item.orderAmt}`,
    details: [
        `${item.createdOn}`,
        `Ordered by: ${item.buyerName}`,
    ],
    badge: (
        <Text style={{ ...styles.itemsQtyBadge, color: statusProfiles[item.status as string].color }}>
            {statusProfiles[item.status as string].title}
        </Text>
    )
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

const OrdersTabPanel = () => {
    const [mounted, setMounted] = useState(false);
    const [ordersData, setOrdersData] = useState<{ [key: string]: any | undefined }>({ loaded: false });
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedFilter, setSelectedFilter] = useState('today');
    const [selectedDateRange, setSelectedDateRange] = useState({
        from: Math.floor(moment().unix()),
        to: Math.floor(moment().unix())
    })

    const { APIGet } = useContext(APIContext);

    const { authStatus } = useContext(AuthContext)

    const { showToast } = useContext(ToastContext);

    const fetchRenderData = ({ onCompleteCallback, isRefreshing }: { onCompleteCallback?: Function, isRefreshing?: boolean }) => {
        if(!isRefreshing){
            setLoading(true);
            setOrdersData({ ...ordersData, loaded: false })
        }
        APIGet({
            url: getURL({
                key: 'ORDER_DASHBOARD',
                queryParams: {
                    from: selectedDateRange.from,
                    to: selectedDateRange.to
                }
            }),
            resolve: (response: any) => {
                if(!response.data){
                    throw response;
                }

                setOrdersData({
                    ...response.data,
                    items: (response.data?.orders || []).map((item: any) => (
                        {
                            ...item, card_id: 'card_5'
                        })),
                    totalOrders: (response.data?.orders || []).length,
                    totalSales: (response.data?.orders || []).reduce((total: number, item: any) => (
                        total + (typeof item.paidAmt == 'number' ? item.paidAmt : 0)
                    ),
                        0
                    ),
                    totalDelivered: (response.data?.orders || []).filter((item: any) => item.status === 'delivered').length,
                    loaded: true
                });

                if(!mounted){
                    setMounted(true);
                }
                
                (onCompleteCallback || (()=>{}))()
            },
            reject: (error: any) => {
                showToast(ToastProfiles.error)
                
                if(!mounted){
                    setMounted(true);
                }
                
                (onCompleteCallback || (()=>{}))()
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
        if (ordersData.loaded) {
            setLoading(false);
        }
    }, [ordersData.loaded])

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
            onCompleteCallback: ()=>setRefreshing(false),
            isRefreshing: true
        })
    }

    return (
        <View>
            {
                loading
                    ? <LoadingScreen />
                    : <ListView
                        title='Online Orders'
                        searchPlaceholder='Search Orders'
                        filtersEnabled
                        filters={quickFilters}
                        selectedFilter={selectedFilter}
                        onFilterSelect={onFilterSelect}
                        onRefresh={onRefresh}
                        list={(ordersData.items || []).map((item: any) => ({
                            ...item,
                            action: 'push',
                            actionParams: [
                                'TabScreen',
                                {
                                    url: getURL({
                                        key: 'ORDER_ENTRY',
                                        pathParams: item.id
                                    }),
                                    detailsDisplayProfile: 'order',
                                    screenTitle: item.orderNo
                                }
                            ]
                        }))}
                        sections={sections}
                        searchFilter={(keyword: string, item: any) => ((new RegExp(`^${keyword}`, 'i')).test(item.orderNo))}
                        cardPropParser={cardPropParser}
                        summaryBlocks={
                            summaryProfile.map((item: any) => ({
                                title: item.title,
                                key: item.key,
                                card_id: item.card_id,
                                value: (item.valueReducer || ((value: number) => value))(ordersData[item.key])
                            }))
                        }
                    />}
        </View>
    );
}

export default OrdersTabPanel;