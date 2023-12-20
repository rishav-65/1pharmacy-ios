import { getURL } from "@APIRepository";
import { ListView } from "@Containers";
import { ToastProfiles } from "@ToastProfiles";
import { LoadingScreen } from "@commonComponents";
import { APIContext, AuthContext, ToastContext } from "@contextProviders";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import moment from "moment";
import { View } from "native-base";
import { useContext, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const cardPropParser = (item: any) => ({
    id: item.id,
    tag: 'Contact :',
    title: item.name || '',
    detailItems: [
        `Phone: ${item.phone || '-'}`,
        `Email: ${item.email || '-'}`
    ],
    highlightDetails: [
        `GSTIN: ${item.gstin || '-'}`
    ],
    badge: `₹ ${(item.dueAmount || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
    actions: [
        {
            action: 'link',
            icon: 'phone',
            actionParams: [`tel:${item.phone}`]
        },
        {
            action: 'link',
            icon: ['fab', 'whatsapp'],
            actionParams: [`https://wa.me/${item.phone}`]
        }
    ],
})

const Suppliers = ({ isFocused, bottomTabsMounted }: { isFocused: boolean, bottomTabsMounted?: boolean }) => {
    const [mounted, setMounted] = useState(false);
    const [inventoryData, setInventoryData] = useState<{ [key: string]: any | undefined }>({ loaded: false });
    const [loading, setLoading] = useState<boolean>(true);
    let { bottom } = useSafeAreaInsets();

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
                key: 'SUPPLIER_LISTING'
            }),
            resolve: (response: any) => {
                if (!response.data) {
                    throw response;
                }

                const itemsWithCardID = (response.data?.items || []).map((item: any) => ({ ...item, card_id: 'card_10' }));

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
                        title={`Suppliers (${(inventoryData.items || []).length} suppliers)`}
                        searchPlaceholder='Search Supplier'
                        bottomTabsMounted={bottomTabsMounted}
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

export default Suppliers;