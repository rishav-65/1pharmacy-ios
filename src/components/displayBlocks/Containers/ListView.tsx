import P1Styles from "@P1StyleSheet";
import { FlatList, IconButton, Input, ScrollView, SearchIcon, SectionList, Text, View } from "native-base";
import React, { ExoticComponent, ReactNode } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { getCardByIndex } from "../HouseOfCards/CardsIndex";
import HorizontalScrollableSection from "./HorizontalScrollableSection";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { BottomActionSheet, InfoScreen } from "@commonComponents";
import { Chip } from "react-native-elements";

const styles = StyleSheet.create({
    searchBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 20,
        marginTop: 10,
        ...P1Styles.shadow
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
    serchIcon: {
        marginLeft: 10
    },
    screenEndBuffer: {
        height: 350
    },
    filterIcon: {
        margin: 5
    },
    actionSheetStyle: {
        alignItems: 'flex-start'
    },
    actionSheetTitle: {
        color: '#000000',
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

    return (
        <>
            {
                searchEnabled
                && <View style={styles.searchBox}>
                    <Input
                        borderColor='transparent'
                        size="xl"
                        placeholder={props.searchPlaceholder || 'Search'}
                        w="100%"
                        value={searchKeyword} onChangeText={setSearchKeyword}
                        InputLeftElement={<SearchIcon style={styles.serchIcon} />}
                    />
                </View>
            }
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
                                        <RefreshControl refreshing={refreshing} onRefresh={()=>props.onRefresh(setRefreshing)} />
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
                                        <RefreshControl refreshing={refreshing} onRefresh={()=>props.onRefresh(setRefreshing)} />
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
        </>
    );
}

export default ListView;