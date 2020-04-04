import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Linking,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  BackHandler,
  ImageBackground,
  StatusBar,
} from 'react-native';

import languages from './../locales/languages';
import Colors from './../constants/colors';
import fontFamily from './../constants/fonts';

import { SvgXml } from 'react-native-svg';

const width = Dimensions.get('window').width;

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
    };
  }

  componentDidMount() {
    //
  }

  render() {
    return (
      <View>
        <StatusBar
          barStyle='dark-content'
          backgroundColor='transparent'
          translucent={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //
});

export default SettingsScreen;
