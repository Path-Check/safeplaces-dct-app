import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';

import NavigationBarWrapper from '../../../components/NavigationBarWrapper';

// This is to make the images responsive in the page of a new
const fixerImage = `
  var imgs = document.images;
  for(var i=0; i < imgs.length; i+=1 ) {
    imgs[i].style.width = "100%";
  }
`;

const Details = ({
  navigation,
  route: {
    params: { source },
  },
}) => {
  navigation.setOptions({ headerShown: false });

  const backToMain = () => {
    navigation.goBack();
  };

  const handleBackPress = () => {
    backToMain();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  return (
    <NavigationBarWrapper title='Atrás' onBackPress={backToMain.bind(this)}>
      <WebView
        source={source}
        startInLoadingState
        injectedJavaScript={fixerImage}
      />
    </NavigationBarWrapper>
  );
};

export default Details;
