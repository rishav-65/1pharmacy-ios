import P1Styles from "@P1StyleSheet";
import { Image, Text, View } from "native-base";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
    cardBase: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        ...P1Styles.shadow
    },
    imageThumbnail: {
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
        marginRight: 5
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 5
    },
    detailsBlock: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
        marginTop: 2,
        marginLeft: 5
    },
    detailItem: {
        fontSize: 14,
        lineHeight: 17,
        color: '#707070',
        overflow: 'hidden',
        marginRight: 10
    },
    highlightDetailItem: {
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 17,
        color: '#707070',
        overflow: 'hidden',
    },
})

const ImageDetailsCard = (props: any) => {
    const { title, imgURL, details, highlightDetails } = props.item;

    return (
        <TouchableOpacity style={styles.cardBase}>
            {
                imgURL
                && <Image source={{
                uri: imgURL
            }}
                alt="IMG"
                size="sm"
                style={styles.imageThumbnail}
            />
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