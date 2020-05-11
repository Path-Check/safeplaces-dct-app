import React from 'react';
import { View, StatusBar, Platform } from 'react-native';
import Constants from 'expo-constants';


const Statusbar = ({ backgroundColor, ...props }) => (
  <View style={[{ height: Constants.statusBarHeight }, { backgroundColor }]}>
    <StatusBar traslucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default Statusbar;
