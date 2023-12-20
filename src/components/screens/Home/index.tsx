import { BottomActionSheet } from '@commonComponents';
import { AuthContext } from '@contextProviders';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import { Box, ChevronDownIcon, HStack, IconButton, StatusBar, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import HomeTabs from './HomeTabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { DrawerActions } from '@react-navigation/native';
import Emitter from '@Emitter';

const styles = StyleSheet.create({
  userName: {
    color: '#3C3C3C',
    fontWeight: '600',
    fontSize: 18,
    marginRight: 5
  },
  userCompany: {
    color: '#b0b0b0',
    fontSize: 16
  },
  actionSheetStyle: {
    alignItems: 'flex-start'
  },
  accountListTitle: {
    color: '#3C3C3C',
    fontWeight: '700',
    fontSize: 22,
    marginVertical: 10
  },
  accountListItem: {
    paddingVertical: 15,
    borderBottomColor: '#EFEFEF',
    borderBottomWidth: 2,
    width: '100%'
  },
  accountListItemText: {
    color: '#808080',
    fontWeight: '500',
    fontSize: 18
  },
});

const Home = (props: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const [mounted, setMounted] = useState(false);

  const { authStatus, setActiveSession } = React.useContext(AuthContext);

  const onPush = (event: any) => {
    props.navigation.push(event.screen, event.params)
  }
  
  useEffect(()=>{
    if(!mounted){
      Emitter.on('PUSH', onPush);
    }
    return (()=>{
      Emitter.off('PUSH', onPush);
    })
  }, [mounted])

  return <>
    <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
    <Box safeAreaTop bg="#FFFFFF" />
    <HStack bg="#FFFFFF" px="1" py="2" justifyContent="space-between" alignItems="center" w="100%">
      <HStack alignItems="center">
        <IconButton icon={<FontAwesomeIcon icon='bars' size={20} color='#2E6ACF' />} onPress={()=>props.navigation.dispatch(DrawerActions.toggleDrawer())} />
        <BottomActionSheet
          handle={(<View>
            <HStack maxW={200} alignItems='center'>
              <Text style={styles.userName}>
                {authStatus.loggedInUser?.userData?.name as string}
              </Text>
              <ChevronDownIcon />
            </HStack>
            <Text maxW={200} numberOfLines={1} style={styles.userCompany}>
              {(authStatus.loggedInUser?.userData?.company as string).trim()}
            </Text>
          </View>)}
          actionSheetStyle={styles.actionSheetStyle}
          SheetContent={({ onClose }: { onClose: Function }) => (<View px={2} w='100%'>
            <Text style={styles.accountListTitle}>Select Account</Text>
            {
              (authStatus.sessions || []).map((session, index) => (
                <TouchableHighlight
                  key={`${session.userData.name}-${session.userData.company}`}
                  underlayColor="#EFEFEF"
                  onPress={() => {
                    setActiveSession(index);
                    onClose();
                  }}
                  style={styles.accountListItem}
                >
                  <Text style={styles.accountListItemText}>{(session.userData?.company as string).trim()}</Text>
                </TouchableHighlight>
              ))
            }
          </View>)}
        />
      </HStack>
      <HStack>
        {/* <IconButton icon={<FavouriteIcon />} />
        <IconButton icon={<MoonIcon />} /> */}
      </HStack>
    </HStack>
    <HomeTabs />
  </>;
};

export default Home;
