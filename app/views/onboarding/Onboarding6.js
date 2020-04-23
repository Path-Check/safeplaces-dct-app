import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
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
import { AUTHORITY_SOURCE_SETTINGS } from '../../constants/storage';
import { GetStoreData } from '../../helpers/General';
import languages from '../../locales/languages';

const width = Dimensions.get('window').width;

class Onboarding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAuthorities: [],
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', this.getAuthorities);
    this.getAuthorities();
  }

  getAuthorities = () => {
    GetStoreData(AUTHORITY_SOURCE_SETTINGS, false).then(result => {
      if (result !== null) {
        console.log('Retrieving settings from async storage:');
        console.log(result);
        this.setState({
          selectedAuthorities: result,
        });
      } else {
        console.log('No stored authority settings.');
      }
    });
  };

  hasAuthorities = () => {
    return (
      Array.isArray(this.state.selectedAuthorities) &&
      this.state.selectedAuthorities.length > 0
    );
  };

  onGoToSettingsPress = () => {
    this.props.navigation.navigate('ChooseProviderScreen');
  };

  onButtonPress = () => {
    this.props.navigation.replace('Onboarding7');
  };

  renderAuthorities = () => {
    return this.hasAuthorities() ? (
      <FlatList
        data={this.state.selectedAuthorities}
        renderItem={({ item }) => (
          <View style={styles.flatlistRowView}>
            <Typography style={styles.item}>{item.key}</Typography>
          </View>
        )}
      />
    ) : (
      <Typography style={styles.subheaderText}>
        {languages.t('label.authorities_no_sources')}
      </Typography>
    );
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
            <Typography testID='Header' style={styles.headerText}>
              {languages.t('label.choose_provider_title')}
            </Typography>
            <Typography testID='Subheader' style={styles.subheaderText}>
              {languages.t('label.choose_provider_subtitle')}
            </Typography>
            <View style={styles.spacer} />
            <View style={styles.statusContainer}>
              <Typography style={styles.subheaderText}>
                {languages.t('label.authorities_title') + ':'}
              </Typography>
              {this.renderAuthorities()}
            </View>
          </View>
          <View style={styles.footerContainer}>
            <ButtonWrapper
              title={languages.t('label.choose_provider_title')}
              onPress={this.onGoToSettingsPress}
              buttonColor={Colors.VIOLET}
              bgColor={Colors.WHITE}
            />
            <View style={styles.spacer} />
            <ButtonWrapper
              testID='NextButton'
              title={languages.t('label.launch_next')}
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
  statusContainer: {},
  spacer: {
    marginVertical: '5%',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: '10%',
    alignSelf: 'center',
  },
  item: {
    fontFamily: fontFamily.primaryRegular,
    fontSize: 16,
    padding: 10,
    maxWidth: '90%',
    color: Colors.WHITE,
  },
});

export default Onboarding;
