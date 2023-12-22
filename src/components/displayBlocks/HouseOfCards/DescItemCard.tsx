import P1Styles from "@P1StyleSheet";
import { HStack, ScrollView, Text, View } from "native-base";
import React from "react";
import { Animated, Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    cardBase: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        // paddingTop: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        ...P1Styles.shadow
    },
    titleBlock: {
        position: 'relative',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        minHeight: 40,
        width: '100%',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 1,
        borderBottomColor: '#2E6ACF',
        borderBottomWidth: 1,
    },
    skewBackground: {
        position: 'absolute',
        left: -100,
        backgroundColor: '#2E6ACF',
        height: 450,
        width: 300,
        transform: [{ skewY: '60deg' }]
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        flexWrap: 'wrap',
        maxWidth: 50 * (windowWidth - 80) / 100
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '700',
        maxWidth: 30 * (windowWidth - 80) / 100,
        height: 25,
        justifyContent: 'center'
    },
    descBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginHorizontal: 15
    },
    detailsBlock: {
        marginTop: 2,
        maxWidth: 72 * (windowWidth - 80) / 100
    },
    detailsBlockWithoutBadge: {
        marginTop: 2,
    },
    badgeBlock: {
        alignSelf: 'flex-end',
    },
    detailItem: {
        fontSize: 12,
        lineHeight: 17,
        color: '#707070',
        overflow: 'hidden',
    },
    collapsibleList: {
        marginTop: 10,
        borderBottomColor: '#2E6ACF',
        borderBottomWidth: 1,
    },
    nestedListItem: {
        borderTopColor: '#E5E5E8',
        borderTopWidth: 1,
        backgroundColor: '#EFEFEF',
        padding: 10,
        paddingHorizontal: 20
    },
    badgeHighlight: {
        borderRadius: 20,
    },
    nestedListItemHeadBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 7
    },
    nestedListItemActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    nestedListItemDetailsBlock: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        backgroundColor: '#E0E0E0',
        borderRadius: 20
    },
    nestedListTitle: {
        marginBottom: 5,
        fontSize: 14,
        lineHeight: 17,
        fontWeight: '700',
        color: '#303030',
        overflow: 'hidden',
    },
    nestedListSubtitle: {
        marginBottom: 5,
        fontSize: 14,
        lineHeight: 17,
        color: '#707070',
        overflow: 'hidden',
    },
    nestedListDetailItem: {
        fontSize: 14,
        lineHeight: 17,
        color: '#707070',
        overflow: 'hidden',
    },
    endBuffer: {
        height: 15,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    }
})

const DescItemCard = (props: any) => {
    const [collapsed, setCollapsed] = React.useState(true);
    const [contentHeight, setContentHeight] = React.useState(
        windowWidth >= 414 ? 500 : windowWidth >= 375 ? 300 : 200,
    );
    const maxHeight =
        windowWidth >= 414 ? 600 : windowWidth >= 375 ? 450 : 300;

    const openCLoseAnim = React.useRef(new Animated.Value(0)).current;

    const { item } = props;

    const collapse = (event: any) => {
        event.stopPropagation();

        setCollapsed(true);
        Animated.timing(openCLoseAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false
        }).start();
    };

    const expand = (event: any) => {
        event.stopPropagation();

        setCollapsed(false);
        Animated.timing(openCLoseAnim, {
            toValue: contentHeight,
            duration: 150,
            useNativeDriver: false
        }).start();
    };


    return (
        <TouchableOpacity onPress={props.onPress} style={styles.cardBase}>
            <View style={styles.titleBlock}>
                <View style={styles.skewBackground} />
                <HStack alignItems="center" justifyContent="space-between" width="100%" paddingX={2} paddingY={1}>
                    <Text style={styles.title}>
                        {item.title}
                    </Text>
                    <Text style={styles.subtitle}>
                        {item.subtitle}
                    </Text>
                </HStack>
            </View>
            <View style={styles.descBlock}>
                <View style={!!item.badge ? styles.detailsBlock : styles.detailsBlockWithoutBadge}>
                    {
                        item.details.map((detailItem: any) => (
                            <Text style={styles.detailItem} numberOfLines={1} key={detailItem}>
                                {detailItem}
                            </Text>
                        ))
                    }
                </View>
                {!!item.badge && <View style={styles.badgeBlock}>
                    {
                        item.nestedList
                            ? (
                                <TouchableHighlight style={styles.badgeHighlight} underlayColor="#3C3C3C00" onPress={collapsed ? expand : collapse}>
                                    {item.badge}
                                </TouchableHighlight>
                            )
                            : item.badge
                    }
                </View>}
            </View>
            {
                item.nestedList
                &&
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
                        }}>
                        {item.nestedList.map((listItem: any, index: number) => (
                            <View id={listItem.id} style={styles.nestedListItem} key={listItem.title + listItem.subtitle + `${index}`}>
                                <View style={styles.nestedListItemHeadBlock}>
                                    <View>
                                        <Text style={styles.nestedListTitle}>
                                            {listItem.title}
                                        </Text>
                                        {
                                            listItem.subtitle
                                            && <Text style={styles.nestedListSubtitle}>
                                                {listItem.subtitle}
                                            </Text>
                                        }
                                    </View>
                                    <View style={styles.nestedListItemActions}>
                                    </View>
                                </View>
                                {
                                    listItem.details?.length > 0
                                    &&
                                    <View style={styles.nestedListItemDetailsBlock}>
                                        {
                                            listItem.details.map((detailItem: any) => (
                                                <Text style={styles.nestedListDetailItem} key={detailItem}>
                                                    {detailItem || ''}
                                                </Text>
                                            ))
                                        }
                                    </View>
                                }
                            </View>
                        ))}
                    </ScrollView>
                </Animated.View>

            }
            <View style={styles.endBuffer} />
        </TouchableOpacity>
    );
}

export default DescItemCard;
