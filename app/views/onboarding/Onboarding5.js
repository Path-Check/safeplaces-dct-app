import React, { Component } from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import BackgroundImage from './../../assets/images/launchScreenBackground.png';
import ButtonWrapper from '../../components/ButtonWrapper';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import { LOCATION_DATA } from '../../constants/storage';
import { GetStoreData } from '../../helpers/General';
import languages from '../../locales/languages';

const width = Dimensions.get('window').width;

class Onboarding extends Component {
  constructor(props) {
    super(props);

    let storedLocations = GetStoreData(LOCATION_DATA, false);
    storedLocations = Array.isArray(storedLocations) ? storedLocations : [];
    this.state = {
      locationData: storedLocations,
    };
  }

  hasLocationData = () => {
    return (
      Array.isArray(this.state.locationData) &&
      this.state.locationData.length > 0
    );
  };

  onGoToSettingsPress = () => {
    this.props.navigation.navigate('ImportScreen');
  };

  onButtonPress = () => {
    this.props.navigation.replace('Onboarding6');
  };

  render() {
    return (
      <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />
        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            <Typography style={styles.headerText}>
              {languages.t('label.maps_import_title')}
            </Typography>
            <Typography style={styles.subheaderText}>
              {languages.t('label.maps_import_text')}
            </Typography>
            <View style={styles.statusContainer}>
              <View style={styles.spacer} />
            </View>
          </View>
          <View style={styles.footerContainer}>
            {!this.hasLocationData() && (
              <ButtonWrapper
                title={languages.t('label.maps_import_button_text')}
                onPress={this.onGoToSettingsPress}
                buttonColor={Colors.VIOLET}
                bgColor={Colors.WHITE}
              />
            )}
            <View style={styles.spacer} />
            <ButtonWrapper
              testID='NextBtn'
              title={
                this.hasLocationData()
                  ? languages.t('label.launch_next')
                  : 'Skip'
              }
              onPress={this.onButtonPress}
              buttonColor={Colors.VIOLET}
              bgColor={Colors.WHITE}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    width: width * 0.9,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerText: {
    color: Colors.WHITE,
    fontSize: 26,
    width: width * 0.8,
    fontFamily: fontFamily.primaryMedium,
  },
  subheaderText: {
    marginTop: '3%',
    color: Colors.WHITE,
    fontSize: 15,
    width: width * 0.55,
    fontFamily: fontFamily.primaryRegular,
  },
  statusContainer: {
    marginTop: '5%',
  },
  spacer: {
    marginVertical: '5%',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: '10%',
    alignSelf: 'center',
  },
});

export default Onboarding;
