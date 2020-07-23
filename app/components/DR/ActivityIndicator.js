import React from 'react';
import { ActivityIndicator } from 'react-native';

import Colors from '../../constants/colors';

const activityIndicatorLoadingView = center => {
  //making a view to show to while loading the webpage

  return (
    <ActivityIndicator
      color={Colors.BLUE_RIBBON}
      size='large'
      style={{
        backgroundColor: Colors.WHITE,
        flex: 1,
        justifyContent: center ? 'center' : 'flex-start',
      }}
    />
  );
};

export default activityIndicatorLoadingView;
