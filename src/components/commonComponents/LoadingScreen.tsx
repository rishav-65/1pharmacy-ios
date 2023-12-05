import { Spinner, View } from "native-base";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const LoadingScreen = () => {
    return ( 
        <View style={styles.container}>
            <Spinner color="#2E6ACF" />
        </View>
     );
}
 
export default LoadingScreen;