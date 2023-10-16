import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ArrowBackIcon, Heading, IconButton, KeyboardAvoidingView, Text, VStack } from 'native-base';
import OTPTextView from 'react-native-otp-textinput';

const VerifyOTP = (props) => {
    const [OTP, setOTP] = React.useState('');

    return <>
        <SafeAreaView>
            <KeyboardAvoidingView width={"100%"} behavior="padding">
                <VStack alignItems="center" padding={4}>
                    <IconButton alignSelf="flex-start" colorScheme="indigo" variant="outline" icon={<ArrowBackIcon style={styles.backButtonIcon} />}
                        onPress={props.navigation.goBack}
                        style={styles.backButton}
                    />
                    <Heading size="lg" marginY={5}>Verify your</Heading>
                    <Heading size="lg" marginBottom={5}>Mobile Number</Heading>
                    <Text textAlign="center" fontSize={18} color="#a0a0a0" marginBottom={5}>
                        We sent an OTP to +91 {props.route.params.phone}
                    </Text>
                    <Text textAlign="center" fontSize={14} fontWeight="bold" marginBottom={5}>Click here to change number</Text>
                    <OTPTextView
                        textInputStyle={styles.OTPFieldStyleBase}
                        tintColor='#2364C8'
                        autoFocus
                        defaultValue={OTP}
                        handleTextChange={setOTP}
                    />
                    <Text textAlign="center" color="#a0a0a0" marginY={5}>
                        Didn't receive OTP? <Text fontWeight="bold">Resend OTP</Text>
                    </Text>
                </VStack>
            </KeyboardAvoidingView>
        </SafeAreaView>
    </>;
};
export default VerifyOTP;

const styles = StyleSheet.create({
    backButtonIcon: {
        color: '#aaaaaa',
    },
    backButton:{
        borderColor: '#aaaaaa'
    },
    OTPFieldStyleBase: {
        borderWidth: 1,
        borderColor: '#aaaaaa',
        borderBottomWidth: 1,
        borderRadius: 4
    }
});