import P1Styles from "@P1StyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { IconButton, Text, ThreeDotsIcon, View } from "native-base";
import { Linking, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    cardBase: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 15,
        marginHorizontal: 20,
        marginVertical: 10,
        ...P1Styles.shadow
    },
    headBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleBlock: {
        paddingRight: 10,
        paddingBottom: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#C0C0C0'
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 14,
        color: '#808080',
    },
    actionsBlock: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
    },
    detailsBlock: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
    },
    detailItem: {
        fontSize: 14,
        color: '#505050',
        marginRight: 10
    }
})

const DescActionsCard = (props: any) => {
    const { title, subtitle, actions, detailItems } = props.item;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const itemClickActions: { [key: string]: any } = {
        push: navigation.push,
        link: (url: string) => Linking.openURL.call(Linking, url)
    }

    return (
        <View style={styles.cardBase}>
            <View style={styles.headBlock}>
                <View style={styles.titleBlock}>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                    {
                        !!subtitle
                        && <Text style={styles.subtitle}>
                            {subtitle}
                        </Text>
                    }
                </View>
                <View style={styles.actionsBlock}>
                    {
                        (actions || []).map((action: any) => (
                            <IconButton
                                icon={<FontAwesomeIcon icon={action.icon} size={20} style={{ color: '#2E6ACF' }} />}
                                onPress={() => itemClickActions[action.action](...action.actionParams)}
                                key={JSON.stringify(action)}
                            />
                        ))
                    }
                </View>
            </View>
            {
                detailItems
                && <View style={styles.detailsBlock}>
                    {
                        detailItems.map((item: string) => (
                            <Text style={styles.detailItem} key={item}>
                                {item}
                            </Text>
                        ))
                    }
                </View>
            }
        </View>
    );
}

export default DescActionsCard;