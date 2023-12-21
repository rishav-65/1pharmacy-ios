import { ArrowBackIcon, Box, HStack, IconButton, StatusBar, Text, VStack } from "native-base";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    header: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})

const CreatePurchase = (props: any) => {
    const screenTitle = 'Create Purchase';

    return (
        <>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <Box safeAreaTop bg="#FFFFFF" />
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
            <VStack width="100%" height={300} justifyContent="center" alignItems="center">
                <Text fontSize={18} fontWeight="700">
                    Coming Soon!
                </Text>
            </VStack>
        </>
    );
}

export default CreatePurchase;