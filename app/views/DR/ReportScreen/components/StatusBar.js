import React from 'react';
import { View, StatusBar, Platform } from 'react-native';
import Constants from 'expo-constants';

const Statusbar = ({ backgroundColor, ...props }) => (
  <View
    style={[
      { height: Platform.OS === 'ios' ? Constants.statusBarHeight : 0 },
      { backgroundColor }
    ]}>
    <StatusBar traslucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default Statusbar;
