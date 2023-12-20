import P1Styles from "@P1StyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Image, Text, View } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
    cardBase: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        // padding: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        ...P1Styles.shadow
    },
    imageThumbnail: {
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        marginRight: 5
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 5,
        flexWrap: 'wrap',
        width: '80%'
    },
    detailsBlock: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
        marginTop: 2,
        marginLeft: 5
    },
    detailItem: {
        fontSize: 12,
        lineHeight: 17,
        color: '#707070',
        overflow: 'hidden',
        marginRight: 10
    },
    highlightDetailItem: {
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 17,
        overflow: 'hidden',
        marginRight: 10
    },
})

const ImageDetailsCard = (props: any) => {
    const { title, imgURL, details, highlightDetails } = props.item;

    return (
        <TouchableOpacity style={styles.cardBase}>
            {
                imgURL
                    ? <Image
                        source={{
                            uri: imgURL
                        }}
                        alt="IMG"
                        size="sm"
                        style={styles.imageThumbnail}
                    />
                    : <View backgroundColor="#2E6ACF" style={{...styles.imageThumbnail, height: 80, maxHeight: 120, width: 80, alignItems: 'center', justifyContent: 'center'}} >
                        <FontAwesomeIcon icon="pills" size={30} color="#FFFFFF" />
                        </View>
            }
            <View>
                <Text style={styles.title}>
                    {title}
                </Text>
                <View style={styles.detailsBlock}>
                    {
                        details.map((detailItem: any) => (
                            <Text style={styles.detailItem} numberOfLines={1} key={detailItem}>
                                {detailItem}
                            </Text>
                        ))
                    }
                </View>
                <View style={styles.detailsBlock}>
                    {
                        highlightDetails.map((detailItem: any) => (
                            <Text style={styles.highlightDetailItem} numberOfLines={1} key={detailItem}>
                                {detailItem}
                            </Text>
                        ))
                    }
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default ImageDetailsCard;