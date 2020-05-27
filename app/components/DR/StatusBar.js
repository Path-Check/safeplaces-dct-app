import React, { useState } from 'react';
import { Dimensions, Platform, StatusBar, View } from 'react-native';
const { height, width } = Dimensions.get('window');

const Statusbar = ({ backgroundColor, ...props }) => {
  const [HEIGHT, setHeight] = useState(0);

  if (Platform.OS === 'ios') {
    if (height > 811 && width > 374 && HEIGHT === 0) {
      setHeight(44);
    } else if (height < 812 && width > 374 && HEIGHT === 0) {
      setHeight(20);
    }
  }
  return (
    <View style={[{ height: HEIGHT }, { backgroundColor }]}>
      <StatusBar traslucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
};

export default Statusbar;
