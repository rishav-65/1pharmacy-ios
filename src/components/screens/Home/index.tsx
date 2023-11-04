import { AuthContext } from '@contextProviders';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import { Text, View } from 'native-base';
import React from 'react';
import {SafeAreaView} from 'react-native';

const Home = (props: NativeStackScreenProps<RootStackParamList, 'Home'>) => {

  const { authStatus, setActiveSession } = React.useContext(AuthContext);

  return <SafeAreaView>
    {/* <View style={{
      width: '100%',
      padding:2,
      alignItems: 'center',
      backgroundColor: '#3F3E60'
    }}>
      <Text style={{
        color: '#FFFFFF'
      }}>
        {authStatus.loggedInUser?.userData?.name as string}
        {authStatus.loggedInUser?.userData?.company as string}
      </Text>
      <View padding = {2}>
        {authStatus.sessions?.map((session, index) => (
          <View marginX={2} marginY={1}>
            <Text onPress={()=>setActiveSession(index)} marginY={1} color="#FFFFFF">{session.userData.name}</Text>
            <Text marginY={1} color="#FFFFFF">{session.userData.company}</Text>
          </View>
        ))}
      </View>
    </View> */}
  </SafeAreaView>;
};

export default Home;
