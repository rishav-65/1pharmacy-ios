import P1Styles from "@P1StyleSheet";
import { AuthContext } from "@contextProviders";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { Box, FavouriteIcon, ScrollView, Spinner, Text, View } from "native-base";
import React from "react";
import { Linking, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
    cardBase: {
        backgroundColor: '#2E6ACF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingTop: 5,
        paddingBottom: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        ...P1Styles.shadow
    },
    greetingContainer: {
        borderBottomColor: '#FFFFFF',
        borderBottomWidth: 0.5,
        padding: 7
    },
    greeting: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        lineHeight: 30,
    },
    summaryItemBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    summaryIcon: {
        marginHorizontal: 10,
        color: '#FFFFFF'
    },
    summaryTitle: {
        fontSize: 14,
        color: '#DDDDFF',
        lineHeight: 18,
        padding: 5
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        lineHeight: 20,
        paddingHorizontal: 5
    }
})

const GreetingSummaryCard = (props: any) => {
    const { authStatus: { loggedInUser: { userData } } } = React.useContext(AuthContext)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const itemClickActions: { [key: string]: any } = {
        push: navigation.push,
        link: (url: string) => Linking.openURL.call(Linking, url)
    }

    const loaded = props.loaded === false ? false : true;

    return (
        <View style={styles.cardBase}>
            <Box style={styles.greetingContainer}>
                <Text style={styles.greeting}>Hi, {userData.name}</Text>
            </Box>
            {
                loaded
                    ? <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                            props.data.map((item: any) => (
                                <TouchableOpacity onPress={() => (itemClickActions[item.action] || (() => { }))(...(item.actionParams || []))} style={styles.summaryItemBlock} key={item.title + item.value}>
                                    {item.icon && <FavouriteIcon size={30} style={styles.summaryIcon} />}
                                    <View>
                                        <Text style={styles.summaryTitle}>
                                            {item.title}
                                        </Text>
                                        <Text style={styles.summaryValue}>
                                            {item.value}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                    : <Spinner color='#FFFFFF' marginY={5} alignSelf='center' />
            }
        </View>
    );
}

export default GreetingSummaryCard;