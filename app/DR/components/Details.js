import React from 'react';
import { TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';
import PDFReader from 'rn-pdf-reader-js';

// This function component is to show the details of a new, bulletin or recomendation for webView
const Details = ({
  navigation,
  route: {
    params: { source, switchScreenTo },
  },
}) => {
  navigation.setOptions({ headerShown: false });

  // This is to make the images responsive in the page of a new
  const fixerImage = `
    for (const image of document.images){

      image.style.width = "100%";

    };
    `;

  return (
    <>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons color="#3389ff" size={wp('4%') + 4} name="arrow-back" />
        <Text style={styles.textGobackButton}>Atrás</Text>
      </TouchableOpacity>

      {switchScreenTo === 'PDF' ? (
        <PDFReader
          source={source}
          useGoogleReader={Platform.OS === 'ios' ? false : true}
          withScroll={true}
          customStyle={{
            readerContainerDocument: { backgroundColor: 'white' },
          }}
        />
      ) : (
        <WebView
          source={source}
          startInLoadingState={true}
          injectedJavaScript={fixerImage}
          style={styles.WebViewStyle}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  goBackButton: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
  },
  textGobackButton: {
    color: '#3389ff',
    fontSize: wp('4%') + 3,
    fontFamily: 'OpenSans-Regular',
  },
  WebViewStyle: {
    marginTop: 20,
  },
});

export default Details;
