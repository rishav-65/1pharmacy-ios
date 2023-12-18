import P1Styles from "@P1StyleSheet";
import { Button, FlatList, HStack, Input, ScrollView, SearchIcon, SectionList, Text, View, useKeyboardBottomInset } from "native-base";
import React from "react";
import { Dimensions, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { getCardByIndex } from "../HouseOfCards/CardsIndex";
import HorizontalScrollableSection from "./HorizontalScrollableSection";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { BottomActionSheet, InfoScreen } from "@commonComponents";
import { Chip } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
    searchBox: {
        backgroundColor: '#2E6ACF',
        borderRadius: 30,
        flex: 1
    },
    summarySection: {
        marginTop: 2,
        marginLeft: 10,
    },
    titleBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20
    },
    listTitle: {
        marginVertical: 2,
        fontSize: 20,
        fontWeight: '700',
    },
    sectionTitleContainer: {
        backgroundColor: '#FFFFFF'
    },
    sectionTitle: {
        fontSize: 18,
        color: '#A0A0A0',
        fontWeight: '400',
        marginHorizontal: 20,
        marginVertical: 2.5
    },
    searchIcon: {
        marginLeft: 10,
    },
    screenEndBuffer: {
        height: 500
    },
    filterIcon: {
        margin: 5
    },
    actionSheetStyle: {
        alignItems: 'flex-start'
    },
    actionSheetTitle: {
        color: '#3C3C3C',
        fontWeight: '700',
        fontSize: 22,
        marginVertical: 10
    },
    filterChip: {
        margin: 5
    },
    unSelectedChip: {
        borderColor: '#2E6ACF'
    },
    selectedChip: {
        backgroundColor: '#2E6ACF',
        borderColor: '#2E6ACF'
    },
    listContentContainer: {
        paddingBottom: 900
    },
    floatingPanel: {
        position: 'absolute',
        width: windowWidth - 40,
        marginHorizontal: 20,
        borderRadius: 30,
        ...P1Styles.shadowLarge
    },
    floatingAction: {
        height: 40,
        width: 40,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    }
})

const ListView = (props: any) => {
    const [rawList, setRawList] = React.useState(props.list || []);
    const [summaryBlocks, setSummaryBlocks] = React.useState(props.summaryBlock || [])
    const [displayList, setDisplayList] = React.useState([]);
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [refreshing, setRefreshing] = React.useState(false);
    const [itemsCount, setItemsCount] = React.useState(
        props.list
            ? props.list.length
            : (
                props.sections
                    ? (
                        props.sections.reduce(
                            (count: number, section: any) => (
                                count += (
                                    section.cards
                                        ? section.cards.length
                                        : 0
                                )
                            ),
                            0
                        )
                    )
                    : 0
            )
    );

    const bottomInset = useKeyboardBottomInset();

    const searchEnabled = (props.searchEnabled == false) ? false : true;

    const itemClickActions: { [key: string]: any } = {
        push: navigation.push
    }

    React.useEffect(() => {
        setRawList(props.list)
    }, [props.list]);

    React.useEffect(() => {
        setSummaryBlocks(props.summaryBlocks)
    }, [props.summaryBlocks]);

    React.useEffect(() => {
        setDisplayList(rawList);
    }, [rawList]);

    React.useEffect(() => {
        setItemsCount(
            props.list
                ? props.list.length
                : (
                    props.sections
                        ? (
                            props.sections.reduce(
                                (count: number, section: any) => (
                                    count += (
                                        section.cards
                                            ? section.cards.length
                                            : 0
                                    )
                                ),
                                0
                            )
                        )
                        : 0
                )
        )
    }, [props.list, props.sections])

    React.useEffect(() => {
        if (searchKeyword.length >= 3) {
            setDisplayList(rawList.filter((item: any) => (
                (
                    props.searchFilter
                    || ((keyword: string, item: any) => (true))
                )
                    (searchKeyword, item)
            )))
        }
        if (searchKeyword.length === 0) {
            setDisplayList(rawList)
        }
    }, [searchKeyword])

    const { bottom } = useSafeAreaInsets();

    const tabBarTop = 60 + ((bottom > 0) ? (bottom + 15) : 0);

    const floatingPanelTop = windowHeight - (props.bottomTabsMounted ? (tabBarTop + 40) : 20) - (props.summaryBlocks ? 100 : 0);

    return (
        <>
            <View {...((!searchEnabled && !summaryBlocks) ? { paddingTop: 3 } : {})}>
                {
                    summaryBlocks &&
                    <View>
                        <HorizontalScrollableSection containerStyle={styles.summarySection}>
                            {
                                summaryBlocks.map((item: any) => {
                                    const Component: React.FC<any> = getCardByIndex(item.card_id);

                                    return (<Component key={item.key + item.title} {...item} />)
                                })
                            }
                        </HorizontalScrollableSection>
                    </View>
                }
                <View style={styles.titleBlock}>
                    {props.title && <Text style={styles.listTitle}>{props.title}</Text>}
                    {
                        props.filtersEnabled
                        && <BottomActionSheet
                            handle={(<FontAwesomeIcon style={styles.filterIcon} icon='filter' size={20} color='#505050' />)}
                            actionSheetStyle={styles.actionSheetStyle}
                            SheetContent={({ onClose }: { onClose: Function }) => (<View px={2} w='100%'>
                                <Text style={styles.actionSheetTitle}>Filters</Text>
                                <ScrollView horizontal>
                                    {
                                        (props.filters || []).map((filter: any) => (
                                            <Chip
                                                key={filter.title}
                                                title={filter.title}
                                                type={(filter.key === props.selectedFilter) ? 'solid' : 'outline'}
                                                onPress={() => (props.onFilterSelect || (() => { }))(filter)}
                                                containerStyle={styles.filterChip}
                                                buttonStyle={(filter.key === props.selectedFilter) ? styles.selectedChip : styles.unSelectedChip}
                                            />
                                        ))
                                    }
                                </ScrollView>
                            </View>)}
                        />
                    }
                </View>
                {
                    ((itemsCount === 0) || props.error)
                        ? <InfoScreen
                            title={props.emptyListTitle || props.errorTitle || 'No items to display.'}
                            message={props.emptyListMesssage || props.errorMessage || undefined}
                        />
                        : (
                            props.sections
                                ? <SectionList
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={() => props.onRefresh(setRefreshing)} />
                                    }
                                    contentContainerStyle={styles.listContentContainer}
                                    sections={props.sections.map((section: any) => (
                                        {
                                            title: section.title,
                                            data: section.cards || displayList.filter(section.filter)
                                        }
                                    ))}
                                    keyExtractor={(item: any, index: number) => 'card-' + index + '-' + JSON.stringify(item)}
                                    renderItem={({ item }) => {
                                        const Component: React.FC<any> = getCardByIndex(item.card_id);

                                        return (<Component key={item.card_id + '-' + JSON.stringify(item)} onPress={() => (itemClickActions[item.action as string])(...(item.actionParams || []))} id={item.id} item={(props.cardPropParser || ((item: any) => item))(item)} />)
                                    }}
                                    renderSectionHeader={({ section }: { section: { title: string } }) => (
                                        <View style={styles.sectionTitleContainer}>
                                            <Text style={styles.sectionTitle}>{section.title}</Text>
                                        </View>
                                    )}
                                />
                                : <FlatList
                                    refreshControl={
                                        <RefreshControl refreshing={refreshing} onRefresh={() => props.onRefresh(setRefreshing)} />
                                    }
                                    contentContainerStyle={styles.listContentContainer}
                                    data={displayList}
                                    renderItem={
                                        ({ item }: { item: any }) => {
                                            const Component: React.FC<any> = getCardByIndex(item.card_id);

                                            return (<Component key={item.card_id + '-' + JSON.stringify(item)} onPress={() => (itemClickActions[item.action as string])(...(item.actionParams || []))} id={item.id} item={(props.cardPropParser || ((item: any) => item))(item)} />)
                                        }
                                    }
                                />
                        )
                }

                <View style={styles.screenEndBuffer} />
            </View>
            {
                searchEnabled
                && <HStack alignItems="center" style={{ ...styles.floatingPanel, top: ((bottomInset > 0) ? (floatingPanelTop - (bottomInset + 65)) : floatingPanelTop) }}>
                    {/* <View px={3} flex={1}>
                        <Text color="#A0A0A0" fontSize={16}>
                            {props.title}
                        </Text>
                    </View> */}
                    <View style={styles.searchBox}>
                        <Input
                            borderColor='transparent'
                            size="xl"
                            placeholder={props.searchPlaceholder || 'Search'}
                            w="100%"
                            placeholderTextColor="#FFFFFF"
                            value={searchKeyword} onChangeText={setSearchKeyword}
                            InputLeftElement={<SearchIcon color="#FFFFFF" style={styles.searchIcon} />}
                            InputRightElement={
                                props.floatingAction
                                    ? <View flex={1} alignItems="flex-end">
                                        <TouchableOpacity style={styles.floatingAction} onPress={props.floatingAction.action}>
                                            {props.floatingAction.icon}
                                        </TouchableOpacity>
                                    </View>
                                    : undefined
                            }
                            _focus={{
                                borderColor: 'transparent',
                                backgroundColor: 'transparent',
                            }}
                        />
                    </View>
                </HStack>
            }
        </>
    );
}

export default ListView;