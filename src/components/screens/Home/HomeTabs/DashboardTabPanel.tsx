import { APIURLCollection, getURL } from "@APIRepository";
import { HorizontalScrollableSection } from "@Containers";
import { GreetingSummaryCard, HorizontalDescriptionListCard, SectionDescriptionListCard, VerticalDescriptionListCard } from "@HouseOfCards";
import P1Styles from "@P1StyleSheet";
import { ToastProfiles } from "@ToastProfiles";
import { APIContext, AuthContext, ToastContext } from "@contextProviders";
import moment from "moment";
import { ScrollView, View } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { Chip } from "react-native-elements";

const styles = StyleSheet.create({
    screenEndBuffer: {
        height: 100
    },
    filterChip: {
        padding: 5,
        paddingVertical: 7.5
    },
    unSelectedChip: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        ...P1Styles.shadow
    },
    selectedChip: {
        backgroundColor: '#2E6ACF',
        borderColor: '#FFFFFF',
        ...P1Styles.shadow
    }
})

const paymentTypesKeyNameMap: { [key: string]: string } = {
    cash: 'Cash',
    pending: 'Pending',
    upi: 'UPI',
    card: 'Card',
    paytm: 'Paytm',
    'rtgs/neft': 'RTGS/NEFT',
    '1p pay': '1P Pay'
}

const dashboardItems = [
    {
        SectionComponent: React.Fragment,
        contents: [
            {
                key: 'comparisonDashboard',
                url: APIURLCollection.COMPARISON_DASHBOARD,
                Component: GreetingSummaryCard
            },
            {
                key: 'inventoryStatus',
                url: APIURLCollection.COMPARISON_DASHBOARD,
                Component: HorizontalDescriptionListCard
            }
        ]
    },
    {
        SectionComponent: HorizontalScrollableSection,
        contents: [
            {
                key: 'salesSummary',
                url: APIURLCollection.COMPARISON_DASHBOARD,
                Component: VerticalDescriptionListCard
            },
            {
                key: 'purchaseSummary',
                url: APIURLCollection.COMPARISON_DASHBOARD,
                Component: VerticalDescriptionListCard
            },
            {
                key: 'pendingCustomers',
                url: APIURLCollection.COMPARISON_DASHBOARD,
                Component: VerticalDescriptionListCard
            },
            {
                key: 'pendingSuppliers',
                url: APIURLCollection.COMPARISON_DASHBOARD,
                Component: VerticalDescriptionListCard
            },
            {
                key: 'topCustomers',
                url: APIURLCollection.COMPARISON_DASHBOARD,
                Component: VerticalDescriptionListCard
            },
            {
                key: 'topSuppliers',
                url: APIURLCollection.COMPARISON_DASHBOARD,
                Component: VerticalDescriptionListCard
            }
        ]
    },
    {
        SectionComponent: React.Fragment,
        contents: [
            {
                key: 'salesDesc',
                url: APIURLCollection.COMPARISON_DASHBOARD,
                Component: SectionDescriptionListCard
            },
            {
                key: 'expiryItems',
                url: APIURLCollection.COMPARISON_DASHBOARD,
                Component: VerticalDescriptionListCard
            }
        ]
    }
];

const initialState: { [key: string]: any } = {
    comparisonDashboard: {
        loaded: false
    },
    inventoryStatus: {
        title: 'Inventory Status',
        loaded: false,
        data: {
            title: 'Inventory Status',
        }
    },
    salesSummary: {
        loaded: false,
        data: {
            title: 'Sales Summary',
        }
    },
    purchaseSummary: {
        loaded: false,
        data: {
            title: 'Purchase Summary',
        }
    },
    pendingCustomers: {
        loaded: false,
        data: {
            title: 'Need to Collect',
        }
    },
    pendingSuppliers: {
        loaded: false,
        data: {
            title: 'Need to Pay',
        }
    },
    topCustomers: {
        loaded: false,
        data: {
            title: 'Top Customers',
        }
    },
    topSuppliers: {
        loaded: false,
        data: {
            title: 'Top Suppliers',
        }
    },
    expiryItems: {
        loaded: false,
        data: {
            title: 'Expiry Items',
        }
    },
    salesDesc: {
        loaded: false,
        data: {
            title: 'Sales',
        }
    }
}

const dashboardContents = [
    {
        urlKey: 'COMPARISON_DASHBOARD',
        key: 'comparisonDashboard',
        source: 'comparisonDashboard',
        propParser: (response: any) => {
            const summary = {
                sales: 0,
                purchase: 0,
                sales_count: 0
            };

            Object.values(response.data).forEach((stat: any) => {
                summary.sales += (stat.sales || 0);
                summary.purchase += (stat.purchase || 0);
                summary.sales_count += (stat.sales_count || 0);
            })

            return ([
                {
                    title: 'Total Sales',
                    value: `₹ ${summary.sales.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
                    action: 'push',
                    actionParams: [
                        'SalesListing'
                    ]
                },
                {
                    title: 'Total Purchase',
                    value: `₹ ${summary.purchase.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
                    action: 'push',
                    actionParams: [
                        'PurchasesListing'
                    ]
                },
                {
                    title: 'Total Orders',
                    value: `₹ ${summary.sales_count}`,
                    action: 'push',
                    actionParams: [
                        'OrdersListing'
                    ]
                },
            ])
        }
    },
    {
        urlKey: 'NEW_STOCK',
        key: 'inventoryStatus',
        source: 'inventoryStatus',
        propParser: (response: any) => {

            return ({
                title: 'Inventory Status',
                action: 'push',
                    actionParams: [
                        'InventoryListing'
                    ],
                items: [
                    {
                        title: 'Inventory value by MRP',
                        value: `₹ ${Math.round(response.data.salesValue || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    },
                    {
                        title: 'Inventory value by PTR',
                        value: `₹ ${Math.round(response.data.purchaseValue || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    }
                ]
            })
        }
    },
    {
        urlKey: 'NEW_SALES_DASHBOARD',
        key: 'salesSummary',
        source: 'salesSummary',
        propParser: (response: any) => {
            return ({
                title: 'Sales Summary',
                action: 'push',
                    actionParams: [
                        'SalesListing'
                    ],
                items: [
                    {
                        title: 'Sales Count',
                        value: response.data.sales_summary.sales_count || 0
                    },
                    {
                        title: 'Item Count',
                        value: response.data.sales_summary.sales_item_count || 0
                    },
                    {
                        title: 'Sales Value',
                        value: `₹ ${(response.data.sales_summary.sales_value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    },
                    {
                        title: 'Sales Return Value',
                        value: `₹ ${(response.data.sales_summary.sales_return_value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    },
                    {
                        title: 'Total Tax Amount',
                        value: `₹ ${(response.data.sales_summary.total_tax_amt || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    },
                    {
                        title: 'Pending Amount',
                        value: `₹ ${(response.data.sales_summary.pending_sales_value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    }
                ]
            })
        }
    },
    {
        urlKey: 'NEW_PURCHASE_DASHBOARD',
        key: 'purchaseSummary',
        source: 'purchaseSummary',
        propParser: (response: any) => {

            return ({
                title: 'Purchase Summary',
                action: 'push',
                    actionParams: [
                        'PurchasesListing'
                    ],
                items: [
                    {
                        title: 'Purchase Count',
                        value: response.data.purchase_summary.purchase_count || 0
                    },
                    {
                        title: 'Item Count',
                        value: response.data.purchase_summary.purchase_item_count || 0
                    },
                    {
                        title: 'Purchase Value',
                        value: `₹ ${(response.data.purchase_summary.purchase_value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    },
                    {
                        title: 'Purchase Return Value',
                        value: `₹ ${(response.data.purchase_summary.purchase_return_value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    },
                    {
                        title: 'Pending Amount',
                        value: `₹ ${(response.data.purchase_summary.total_tax_amt || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    },
                    {
                        title: 'Due Purchase Count',
                        value: response.due_purchase_count || 0
                    }
                ]
            })
        }
    },
    {
        urlKey: 'NEW_SALES_DASHBOARD',
        key: 'pendingCustomers',
        source: 'salesSummary',
        propParser: (response: any) => {

            return ({
                title: 'Need to Collect',
                action: 'push',
                    actionParams: [
                        'CustomersListing'
                    ],
                items: response.data.pending_customers.map((customer: any) => ({ title: customer.name, value: `₹ ${customer.netTotalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}` }))
            })
        }
    },
    {
        urlKey: 'NEW_PURCHASE_DASHBOARD',
        key: 'pendingSuppliers',
        source: 'purchaseSummary',
        propParser: (response: any) => {

            return ({
                title: 'Need to Pay',
                action: 'push',
                    actionParams: [
                        'SuppliersListing'
                    ],
                items: response.data.pending_suppliers.sort((a: any, b: any) => (b.netTotalAmount - a.netTotalAmount)).slice(0, 5).map((supplier: any) => ({ title: supplier.supplierName || supplier.name, value: `₹ ${supplier.netTotalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}` }))
            })
        }
    },
    {
        urlKey: 'NEW_SALES_DASHBOARD',
        key: 'topCustomers',
        source: 'salesSummary',
        propParser: (response: any) => {

            return ({
                title: 'Top Customers',
                action: 'push',
                    actionParams: [
                        'CustomersListing'
                    ],
                items: response.data.top_customers.map((customer: any) => ({ title: customer.name, value: `₹ ${customer.netTotalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}` }))
            })
        }
    },
    {
        urlKey: 'NEW_PURCHASE_DASHBOARD',
        key: 'topSuppliers',
        source: 'purchaseSummary',
        propParser: (response: any) => {

            return ({
                title: 'Top Suppliers',
                action: 'push',
                    actionParams: [
                        'SuppliersListing'
                    ],
                items: response.data.supplier_summary.sort((a: any, b: any) => (b.netTotalAmount - a.netTotalAmount)).slice(0, 5).map((supplier: any) => ({ title: supplier.supplierName || supplier.name, value: `₹ ${supplier.netTotalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}` }))
            })
        }
    },
    {
        urlKey: 'NEW_SALES_DASHBOARD',
        key: 'salesDesc',
        source: 'salesSummary',
        propParser: (response: any) => {

            return ({
                title: 'Sales',
                sections: [
                    {
                        title: 'Payment Type',
                        contents: (response.data.type_of_payment || []).map((payment: { [key: string]: number }) => {
                            const paymentTypeKey = Object.keys(payment)[0];
                            return ({
                                title: paymentTypesKeyNameMap[paymentTypeKey],
                                value: `₹ ${(payment[paymentTypeKey] || 0).toLocaleString()}`
                            })
                        })
                    }
                ]
            })
        }
    },
    {
        urlKey: 'NEW_STOCK',
        key: 'expiryItems',
        source: 'inventoryStatus',
        propParser: (response: any) => {

            return ({
                title: 'Expiring Items',
                action: 'push',
                    actionParams: [
                        'ExpiryReport'
                    ],
                items: response.data.near_expiry_dashboard.map((item: any) => ({ title: item.name, value: item.expiry }))
            })
        }
    },
]

const timeFilterStateReducers: { [key: string]: any } = {
    today: () => ({
        from: Math.floor(moment().unix()),
        to: Math.floor(moment().unix())
    }),
    'last-7-days': () => ({
        from: Math.floor(moment().subtract(7, 'days').startOf('day').unix()),
        to: Math.floor(moment().unix())
    }),
    'last-30-days': () => ({
        from: Math.floor(moment().subtract(30, 'days').startOf('day').unix()),
        to: Math.floor(moment().unix())
    }),
}

const DashboardTabPanel = () => {
    const [mounted, setMounted] = useState(false);

    const [refreshing, setRefreshing] = React.useState(false);

    const [rawData, setRawData] = useState<{ [key: string]: any }>({});

    const [data, setData] = useState(initialState);

    const { APIGet } = useContext(APIContext);

    const { authStatus } = useContext(AuthContext)

    const { showToast } = useContext(ToastContext);

    const [selectedFilter, setSelectedFilter] = useState('last-7-days');

    const [selectedDateRange, setSelectedDateRange] = useState({
        from: Math.floor(moment().subtract(7, 'days').startOf('day').unix()),
        to: Math.floor(moment().unix())
    })

    const fetchRenderData = ({ onCompleteCallback = (() => { }) }: { onCompleteCallback?: Function }) => {
        const localRawData: { [key: string]: any } = {};
        dashboardContents.forEach(entity => {
            setData(
                data => (
                    {
                        ...data,
                        [entity.key]: {
                            ...(data[entity.key] || {}),
                            loaded: false,
                        }
                    }
                )
            );

            if (!!localRawData[entity.source]) {
                setData(
                    data => ({
                        ...data,
                        [entity.key]: {
                            ...(data[entity.key] || {}),
                            loaded: true,
                            data: entity.propParser(rawData[entity.source])
                        }
                    })
                );
                onCompleteCallback()
            } else {
                APIGet({
                    url: getURL({
                        key: entity.urlKey,
                        queryParams: {
                            from: selectedDateRange.from,
                            to: selectedDateRange.to
                        }
                    }),
                    resolve: (response: any) => {
                        if (!response.data) {
                            throw response;
                        }

                        setRawData({ ...rawData, [entity.key]: response })
                        localRawData[entity.key] = response;
                        setData(
                            data => (
                                {
                                    ...data,
                                    [entity.key]: {
                                        ...(data[entity.key] || {}),
                                        loaded: true,
                                        data: entity.propParser(response)
                                    }
                                }
                            )
                        );
                        onCompleteCallback()
                        setMounted(true)
                    },
                    reject: (error: any) => {
                        onCompleteCallback()
                        showToast(ToastProfiles.error)
                        setMounted(true)
                    }
                })
            }
        })
    }

    useEffect(() => {
        if (!['none', 'custom'].includes(selectedFilter)) {
            setSelectedDateRange(timeFilterStateReducers[selectedFilter]())
        }
    }, [selectedFilter])

    const onRefresh = () => {
        setRefreshing(true);
        fetchRenderData({ onCompleteCallback: () => setRefreshing(false) })
    }

    useEffect(() => {
        if (!mounted) {
            fetchRenderData({});
        }
    }, [mounted])

    useEffect(() => {
        if (mounted) {
            fetchRenderData({});
        }
    }, [selectedDateRange])

    useEffect(() => {
        if (mounted) {
            fetchRenderData({});
        }
    }, [authStatus])

    const filters = [
        {
            title: 'Today',
            key: 'today'
        },
        {
            title: 'Last 7 Days',
            key: 'last-7-days'
        },
        {
            title: 'Last 30 Days',
            key: 'last-30-days'
        },
    ]

    const onFilterSelect = (filter: any) => {
        setSelectedFilter(filter.key)
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <ScrollView horizontal px={5}>
                {
                    (filters || []).map((filter: any) => (
                        <Chip
                            key={filter.title}
                            title={filter.title}
                            type={(filter.key === selectedFilter) ? 'solid' : 'outline'}
                            onPress={() => (onFilterSelect || (() => { }))(filter)}
                            containerStyle={styles.filterChip}
                            buttonStyle={(filter.key === selectedFilter) ? styles.selectedChip : styles.unSelectedChip}
                        />
                    ))
                }
            </ScrollView>
            {
                dashboardItems.map(({ SectionComponent, contents }, index) => (
                    <SectionComponent key={index}>
                        {
                            contents.map((({ key, Component }) => (<Component key={key} loaded={data[key].loaded} data={data[key].data} />)))
                        }
                    </SectionComponent>
                ))
            }
            <View style={styles.screenEndBuffer} />
        </ScrollView>
    );
}

export default DashboardTabPanel;