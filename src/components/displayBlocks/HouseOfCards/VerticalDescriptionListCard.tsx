import P1Styles from "@P1StyleSheet";
import { ChevronRightIcon, FavouriteIcon, ScrollView, Spinner, Text, View } from "native-base";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    cardBase: {
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#FFFFFF',
        ...P1Styles.shadow,
        width: windowWidth - 40,
        paddingBottom: 12
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
    descItemBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2
    },
    descTitle: {
        fontSize: 16,
        lineHeight: 18,
        padding: 5
    },
    descValue: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 18,
        padding: 5
    }
})

const VerticalDescriptionListCard = (props: any) => {

    const loaded = props.loaded === false ? false : true;

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
            <View paddingX={2}>
                {
                    loaded
                    ? (props.data.items || []).map((item: any) => (
                        <View style={styles.descItemBlock} key={item.title + item.value}>
                            <Text style={styles.descTitle}>
                                {item.title}
                            </Text>
                            <Text style={styles.descValue}>
                                {item.value}
                            </Text>
                        </View>
                    ))
                    : <Spinner color='#FFFFFF' marginY={5} alignSelf='center' />
                }
            </View>
        </View>
    );
}

export default VerticalDescriptionListCard;