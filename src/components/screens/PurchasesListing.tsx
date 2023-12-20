import { Purchases } from "@EntityHandlers";
import { ArrowBackIcon, Box, HStack, IconButton, StatusBar, Text } from "native-base";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    header: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10000
    },
})

const SalesListing = (props: any) => {
    const screenTitle = 'Purchases';

    return (<>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        <Box safeAreaTop bg="#FFFFFF" zIndex={10000} />
        <HStack px="1" py="2" style={styles.header}>
            <HStack alignItems="center">
                <IconButton icon={<ArrowBackIcon style={{ color: '#2E6ACF' }} />} onPress={props.navigation.goBack} />
                <Text color="#3C3C3C" fontSize="20" >
                    {screenTitle}
                </Text>
            </HStack>
            <HStack>
                {/* <IconButton icon={<ShareIcon style={{ color: '#2E6ACF' }} />} />
                <IconButton icon={<ThreeDotsIcon style={{ color: '#2E6ACF' }} />} /> */}
            </HStack>
        </HStack>
        <Purchases isFocused={true} />
    </>);
}

export default SalesListing;