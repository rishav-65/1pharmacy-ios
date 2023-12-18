import P1Styles from "@P1StyleSheet";
import { ChevronRightIcon, FavouriteIcon, Text, View } from "native-base";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    cardBase: {
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#FFFFFF',
        ...P1Styles.shadow,
        paddingBottom: 12,
        width: windowWidth - 40,
    },
    cardHeader: {
        backgroundColor: '#2E6ACF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
        ...P1Styles.shadow,
    },
    cardHeadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardHeading: {
        color: '#FFFFFF',
        fontSize: 22,
        lineHeight:24,
        fontWeight: '500'
    },
    cardHeaderIcon: {
        color: '#FFFFFF',
        marginRight: 10
    },
    rootDescBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
        marginHorizontal: 5
    },
    rootDescItemBlock: {
        marginRight: 10,
        marginVertical: 10
    },
    rootDescTitle: {
        fontSize: 16,
        lineHeight: 18,
        padding: 5
    },
    rootDescValue: {
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 22,
        padding: 5
    },
    sectionBlock: {
        width: '100%'
    },
    sectionTitleContainer: {
        borderTopWidth: 1,
        borderTopColor: '#DDDDDD',
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 22,
        textAlign: 'center',
        padding: 5
    },
    sectionDescItemBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
        marginHorizontal: 10
    },
    sectionDescTitle: {
        fontSize: 16,
        lineHeight: 18,
        padding: 5
    },
    sectionDescValue: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 18,
        padding: 5
    }
})

const SectionDescriptionListCard = (props: any) => {

    return (
        <View style={styles.cardBase}>
            <TouchableOpacity style={styles.cardHeader}>
                <View style={styles.cardHeadingContainer}>
                    {props.data.icon && <FavouriteIcon size={5} style={styles.cardHeaderIcon} />}
                    <Text style={styles.cardHeading}>
                        {props.data.title}
                    </Text>
                </View>
                <ChevronRightIcon style={{ ...styles.cardHeaderIcon, justifySelf: 'flex-end' }} />
            </TouchableOpacity>
            {<>
                {
                    !!props.data.rootSectionItems
                    && <View style={styles.rootDescBlock}>
                        {
                            (props.data.rootSectionItems || []).map((item: any) => (
                                <View style={styles.rootDescItemBlock} key={item.title + item.value}>
                                    <Text style={styles.rootDescTitle}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.rootDescValue}>
                                        {item.value}
                                    </Text>
                                </View>
                            ))
                        }
                    </View>}
                {
                    (props.data.sections || []).map((section: any) => (
                        <View key={section.title}>
                            <View style={styles.sectionTitleContainer}>
                                <Text style={styles.sectionTitle}>
                                    {section.title}
                                </Text>
                            </View>
                            <View>
                                {
                                    section.contents.map((item: any) => (
                                        <View style={styles.sectionDescItemBlock} key={item.title + item.value}>
                                            <Text style={styles.sectionDescTitle}>
                                                {item.title}
                                            </Text>
                                            <Text style={styles.sectionDescValue}>
                                                {item.value}
                                            </Text>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    ))
                }
            </>}
        </View>
    );
}

export default SectionDescriptionListCard;