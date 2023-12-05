import { Text, View, useToast } from 'native-base';
import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';

type ShowToastArgs = {
  title: string;
  description?: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
}

type ShowToastMethod = (args: ShowToastArgs) => void;

const initialState: { showToast: ShowToastMethod } = {
  showToast: (args: ShowToastArgs) => { },
};

export const ToastContext = React.createContext(initialState);

const ToastProvider = (props: { children: React.ReactNode }) => {
  const toast = useToast();

  const showToast: ShowToastMethod = ({ title, description, containerStyle, titleStyle, descriptionStyle }) => toast.show({
    render: () => (<View style={containerStyle}>
      <Text style={titleStyle}>
        {title}
      </Text>
      {description && <Text style={descriptionStyle || titleStyle}>
        {description}
      </Text>}
    </View>),
    placement: 'top'
  })

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}>
      {props.children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
