import { AuthContext } from '@contextProviders';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import { Text, View } from 'native-base';
import React from 'react';
import {SafeAreaView} from 'react-native';

const Home = (props: NativeStackScreenProps<RootStackParamList, 'Home'>) => {

  const { authStatus } = React.useContext(AuthContext);

  return <SafeAreaView>
    <View style={{
      width: '100%',
      padding:2,
      alignItems: 'center',
      backgroundColor: '#3F3E60'
    }}>
      <Text style={{
        color: '#FFFFFF'
      }}>
        {authStatus.loggedInUser?.userData?.name as string}
      </Text>
    </View>
  </SafeAreaView>;
};

export default Home;
