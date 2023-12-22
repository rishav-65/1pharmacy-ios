import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ArrowBackIcon, Heading, IconButton, KeyboardAvoidingView, Text, VStack } from 'native-base';
import OTPTextView from 'react-native-otp-textinput';
import { APIContext, AuthContext, ToastContext } from '@contextProviders';
import { getURL } from '@APIRepository';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import { submitOTP } from '@auth';
import { ToastProfiles } from '@ToastProfiles';

const styles = StyleSheet.create({
    backButtonIcon: {
        color: '#aaaaaa',
    },
    backButton: {
        borderColor: '#aaaaaa'
    },
    OTPFieldStyleBase: {
        borderWidth: 1,
        borderColor: '#aaaaaa',
        borderBottomWidth: 1,
        borderRadius: 4
    }
});

const VerifyOTP = (props: NativeStackScreenProps<RootStackParamList, 'VerifyOTP'>) => {
    const [OTP, setOTP] = React.useState('');

    const { APIPost } = React.useContext(APIContext);

    const { showToast } = React.useContext(ToastContext);

    const { setLoggedInUser } = React.useContext(AuthContext);

    const phone = props.route?.params?.phone;

    const handleOTPChange = (OTP: string) => {
        if (OTP.length === 4) {
            submitOTP(phone as string, OTP).then(response => {
                if (!response.data) {
                    throw response;
                }

                setLoggedInUser(response.data.sessions)

                showToast(ToastProfiles.success);

            }).catch(error => {
                showToast({...ToastProfiles.error, title: error.error.userMessage})
            })
        }
        setOTP(OTP)
    }

    return <>
        <SafeAreaView>
            <KeyboardAvoidingView width="100%" behavior="padding">
                <VStack alignItems="center" padding={4}>
                    <IconButton alignSelf="flex-start" colorScheme="indigo" variant="outline" icon={<ArrowBackIcon style={styles.backButtonIcon} />}
                        onPress={props.navigation.goBack}
                        style={styles.backButton}
                    />
                    <Heading size="lg" marginY={5}>Verify your</Heading>
                    <Heading size="lg" marginBottom={5}>Mobile Number</Heading>
                    <Text textAlign="center" fontSize={18} color="#a0a0a0" marginBottom={5}>
                        We sent an OTP to +91 {phone}
                    </Text>
                    <Text textAlign="center" fontSize={14} fontWeight="bold" marginBottom={5}>Click here to change number</Text>
                    <OTPTextView
                        textInputStyle={styles.OTPFieldStyleBase}
                        tintColor='#2364C8'
                        autoFocus
                        defaultValue={OTP}
                        handleTextChange={handleOTPChange}
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