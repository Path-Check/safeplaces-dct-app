import React, { useEffect } from 'react';
import { BackHandler, Dimensions } from 'react-native';
import PDFView from 'react-native-pdf';
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
    params: { source, switchScreenTo = 'WebView' },
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
    const unsubscribe = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      unsubscribe;
    };
  }, [navigation]);

  return (
    <NavigationBarWrapper title='Atrás' onBackPress={backToMain.bind(this)}>
      {switchScreenTo === 'PDFView' && (
        <PDFView
          source={source}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'white',
          }}
        />
      )}
      {switchScreenTo === 'WebView' && (
        <WebView
          source={source}
          startInLoadingState
          injectedJavaScript={fixerImage}
        />
      )}
    </NavigationBarWrapper>
  );
};

export default Details;
