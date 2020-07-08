import React from 'react';
import { ActivityIndicator } from 'react-native';

const activityIndicatorLoadingView = () => {
  //making a view to show to while loading the webpage
  return (
    <ActivityIndicator
      color='#009688'
      size='large'
      style={{
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
      }}
    />
  );
};

export default activityIndicatorLoadingView;
