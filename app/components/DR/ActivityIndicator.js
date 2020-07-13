import React from 'react';
import { ActivityIndicator } from 'react-native';

import Colors from '../../constants/colors';

const activityIndicatorLoadingView = isSponsorsScreen => {
  //making a view to show to while loading the webpage

  const contentPosition = isSponsorsScreen ? 'flex-start' : 'center';

  return (
    <ActivityIndicator
      color={Colors.BLUE_RIBBON}
      size='large'
      style={{
        backgroundColor: 'white',
        flex: 1,
        justifyContent: contentPosition,
      }}
    />
  );
};

export default activityIndicatorLoadingView;
