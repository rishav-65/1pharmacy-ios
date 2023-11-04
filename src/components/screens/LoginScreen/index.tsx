import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Heading, Image, Input, KeyboardAvoidingView, Text, VStack } from 'native-base';
import { useToast } from 'native-base';
import { APIContext, ToastContext } from '@contextProviders';
import { getURL } from '@APIRepository';
import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import { requestOTP } from '@auth';
import { ToastProfiles, getCustomToastProfile } from '@ToastProfiles';

const styles = StyleSheet.create({
});

const LoginScreen = (props: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const [phone, setPhone] = React.useState('');

  const { APIPost } = React.useContext(APIContext);

  const { showToast } = React.useContext(ToastContext);

  const submitPhone = () => {
    if (!phone || phone === '' || phone.length < 10) {
      showToast(getCustomToastProfile({
        title: 'Please enter a valid phone number.',
        template: 'error'
      }))

      return;
    }

    requestOTP(phone).then(response => {
      if (response?.data?.otpSent === true) {
        showToast({...ToastProfiles.success, title: 'OTP Sent!'})
      } else {
        throw response
      }

      props.navigation.push('VerifyOTP', { phone })
    }).catch(error => {
      showToast(ToastProfiles.error)
    })
  }

  return <>
    <SafeAreaView>
      <KeyboardAvoidingView width="100%" behavior="padding">
        <VStack space={1} alignItems="center" justifyContent="flex-end" height="100%" padding={4}>
          <Image source={require('@assets/1p_logo.png')} width={32} height={48} accessibilityLabel='1p_logo' marginBottom={32} />
          <Heading size="2xl" marginY={5}>Welcome!</Heading>
          <Input size="xl" mx="3" placeholder="Enter your mobile number" w="100%" value={phone} onChangeText={setPhone} />
          <Text textAlign="center" color="#a0a0a0" marginY={5}>
            By providing the phone number, I hereby agree and accept the <Text fontWeight="bold">Terms of Service</Text> and <Text fontWeight="bold">Privacy Policy</Text>
          </Text>
          <Button onPress={submitPhone} width="100%" backgroundColor="#2364C8">
            Submit
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </>;
};
export default LoginScreen;
