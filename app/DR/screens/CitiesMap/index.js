import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { MaterialIcons } from 'react-native-vector-icons';
import firestore from '../../utils/firebase';
import Colors from '../../constants/Colors';

export default function CitiesMapScreen({ navigation }) {
  let webViewRef;
  const [form, setForm] = useState('');
  navigation.setOptions({
    headerShown: false,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // The screen is unfocused
      // Call any action
      webViewRef && webViewRef.reload();
    });

    return () => {
      unsubscribe;
    };
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <View>
        <TouchableOpacity
          style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons color="#3389ff" size={wp('4%') + 4} name="arrow-back" />
          <Text
            style={{
              color: '#3389ff',
              fontSize: wp('4%') + 3,
              fontFamily: 'OpenSans-Regular',
            }}
          >
            Atrás
          </Text>
        </TouchableOpacity>
      </View>
      <WebView
        ref={(ref) => (webViewRef = ref)}
        source={{
          uri: 'https://covidrd.page.link/map',
        }}
        onResponderReject={(res) => console.log(res)}
      />
    </View>
  );
}
