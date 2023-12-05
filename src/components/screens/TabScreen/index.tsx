import { getURL } from "@APIRepository";
import { ToastProfiles } from "@ToastProfiles";
import { APIContext, ToastContext } from "@contextProviders";
import { ArrowBackIcon, Box, HStack, IconButton, Pressable, ShareIcon, StatusBar, Text, ThreeDotsIcon, View } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { TabView, SceneMap } from 'react-native-tab-view';
import { parseDataByProfile } from "./displayProfiles";
import { ListView } from "@Containers";
import { LoadingScreen } from "@commonComponents";
import P1Styles from "@P1StyleSheet";

const styles = StyleSheet.create({
    tabBar: {
        flex: 0,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        ...P1Styles.shadow
    },
    tab: {
        alignItems: 'center',
        flex: 0,
        borderBottomWidth: 3,
        backgroundColor: '#FFFFFF',
    }
})

const initialLayout = {
    width: Dimensions.get('window').width,
};

const sceneTypeIndex: { [key: string]: React.FC } = {
    list: ListView
}


const TabScreen = (props: any) => {
    const [mounted, setMounted] = useState(false);
    const [data, setData] = useState<{ icons?: [], tabs?: [] }>({})
    const [loading, setLoading] = useState<boolean>(true);
    const [index, setIndex] = useState(0);
    const [routes, setRoutes] = useState<Array<{ key: string; title: string }>>([]);

    const { APIGet } = useContext(APIContext);

    const { showToast } = useContext(ToastContext);

    const { url, detailsDisplayProfile, screenTitle } = props.route.params;

    const fetchRenderData = () => {
        setLoading(true);
        APIGet({
            url: url,
            resolve: (response: any) => {
                if (!response.data) {
                    throw response;
                }

                console.log(response.data.netAmount, response.data.totalAmount, response.data.discount, response.data.gst, JSON.stringify(response.data))

                setData(parseDataByProfile(detailsDisplayProfile, response.data));
                setMounted(true);
                setLoading(false)
            },
            reject: (error: any) => {
                console.log(error)
                showToast(ToastProfiles.error)
                setMounted(true)
            }
        })
    }

    useEffect(() => {
        if (!mounted) {
            fetchRenderData();
        }
    }, [mounted])

    useEffect(() => {
        if (data.tabs) [
            setRoutes(data.tabs.map((tab: any) => ({
                key: tab.key,
                title: tab.title
            })))
        ]
    }, [data.tabs])

    const renderScene = SceneMap(data.tabs?.reduce(((tabBar: { [key: string]: React.FC }, tab: any) => {
        const SceneComponent = sceneTypeIndex[tab.sceneType]
        return ({
            ...tabBar,
            [tab.key]: () => <SceneComponent {...(tab.content || {})} />
        })
    }), {}) || {});

    const renderTabBar = (props: any) => {
        return <Box style={styles.tabBar}>
            {routes.map((route: any, i) => {
                const color = index === i ? '#2E6ACF' : '#505050';
                const borderColor = index === i ? '#2E6ACF' : '#00000000';
                return <TouchableOpacity key={route.title + `${i}`}  onPress={() => setIndex(i)}>
                    <Box borderColor={borderColor} style={styles.tab} p={3}>
                        <Animated.Text style={{ color }}>
                            {route.title}
                        </Animated.Text>
                    </Box>
                </TouchableOpacity>;
            })}
        </Box>;
    };

    return (
        <>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <Box safeAreaTop bg="#FFFFFF" />
            <HStack bg="#FFFFFF" px="1" py="2" justifyContent="space-between" alignItems="center" w="100%">
                <HStack alignItems="center">
                    <IconButton icon={<ArrowBackIcon style={{ color: '#2E6ACF' }} />} onPress={props.navigation.goBack} />
                    <Text color="#000000" fontSize="20" >
                        {screenTitle}
                    </Text>
                </HStack>
                <HStack>
                    {/* <IconButton icon={<ShareIcon style={{ color: '#2E6ACF' }} />} />
                    <IconButton icon={<ThreeDotsIcon style={{ color: '#2E6ACF' }} />} /> */}
                </HStack>
            </HStack>
            {
                loading
                    ? <LoadingScreen />
                    : <TabView
                        navigationState={{ index, routes }}
                        renderTabBar={renderTabBar}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={initialLayout}
                    />
            }
        </>
    );
}

export default TabScreen;