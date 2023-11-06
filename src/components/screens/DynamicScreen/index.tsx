import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'App';
import {View} from 'react-native';

const DynamicScreen = (props: NativeStackScreenProps<RootStackParamList, 'DynamicScreen'>) => {
  return <View />;
};

export default DynamicScreen;
