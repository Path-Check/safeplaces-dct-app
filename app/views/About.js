import React, { Component } from 'react';
import {
  BackHandler,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';

import packageJson from '../../package.json';
import team from './../assets/svgs/team';
import fontFamily from './../constants/fonts';
import languages from './../locales/languages';
import lock from '../assets/svgs/lock';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import Colors from '../constants/colors';
import DynamicText from '../components/DynamicText';
import { DEBUG_MODE } from '../constants/storage';
import { GetStoreData } from '../helpers/General';
import { disableDebugMode, enableDebugMode } from '../helpers/Intersect';

class AboutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tapCount: 0, // tracks number of taps, for debugging
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.setState({ tapCount: 0 });
    this.backToMain();
    return true;
  };

  componentDidMount() {
    GetStoreData(DEBUG_MODE).then(dbgMode => {
      if (dbgMode == 'true') {
        this.setState({ tapCount: 4 });
      }
    });

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleTapTeam = () => {
    // debug builds only until we have feature flagging.
    if (__DEV__) {
      this.setState({ tapCount: this.state.tapCount + 1 });
      if (this.state.tapCount >= 3) {
        if (this.state.tapCount == 3) {
          enableDebugMode();
        } else if (this.state.tapCount == 7) {
          this.setState({ tapCount: 0 });
          disableDebugMode();
        }
      }
    }
  };

  handleExitDebugModePress = () => {
    this.setState({ tapCount: 0 });
    disableDebugMode();
  };

  render() {
    return (
      <NavigationBarWrapper
        title={languages.t('label.about_title')}
        onBackPress={this.backToMain.bind(this)}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.spacer} />
          <View style={styles.spacer} />

          <SvgXml style={styles.aboutSectionIconLock} xml={lock} />
          <DynamicText style={styles.aboutSectionTitles}>
            {languages.t('label.commitment')}
          </DynamicText>
          <DynamicText style={styles.aboutSectionPara}>
            {languages.t('label.commitment_para')}
          </DynamicText>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              marginTop: 36,
            }}>
            <SvgXml
              onPress={this.handleTapTeam}
              style={styles.aboutSectionIconTeam}
              xml={team}
              stroke={this.state.tapCount > 3 ? 'red' : undefined}
            />
            {this.state.tapCount > 3 && (
              <TouchableOpacity onPress={this.handleExitDebugModePress}>
                <DynamicText
                  style={{
                    color: Colors.RED_TEXT,
                    marginLeft: 12,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  }}>
                  In exposure demo mode, tap to disable
                </DynamicText>
              </TouchableOpacity>
            )}
          </View>
          <DynamicText style={styles.aboutSectionTitles}>
            {languages.t('label.team')}
          </DynamicText>
          <DynamicText style={styles.aboutSectionPara}>
            {languages.t('label.team_para')}
          </DynamicText>

          <View style={styles.spacer} />
          <View style={styles.spacer} />

          <View style={styles.main}>
            <View style={styles.row}>
              <DynamicText style={styles.aboutSectionParaBold}>Version: </DynamicText>
              <DynamicText style={styles.aboutSectionPara}>{packageJson.version}</DynamicText>
            </View>

            <View style={styles.row}>
              <DynamicText style={styles.aboutSectionParaBold}>OS:</DynamicText>
              <DynamicText style={styles.aboutSectionPara}>
                {' '}
                {Platform.OS + ' v' + Platform.Version}
              </DynamicText>
            </View>

            <View style={styles.row}>
              <DynamicText style={styles.aboutSectionParaBold}>Dimensions:</DynamicText>
              <DynamicText style={styles.aboutSectionPara}>
                {' '}
                {Math.trunc(Dimensions.get('screen').width) +
                  ' x ' +
                  Math.trunc(Dimensions.get('screen').height)}
              </DynamicText>
            </View>
          </View>

          <View style={styles.spacer} />
          <View style={styles.spacer} />
        </ScrollView>
      </NavigationBarWrapper>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: Colors.INTRO_WHITE_BG,
    paddingHorizontal: 26,
    // flex: 1,
    paddingBottom: 42,
  },
  aboutSectionIconTeam: {
    width: 40.38,
    height: 19,
  },
  aboutSectionIconLock: {
    width: 20,
    height: 26.67,
    marginTop: 36,
  },
  aboutSectionTitles: {
    color: Colors.VIOLET_TEXT,
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
    marginTop: 9,
  },
  aboutSectionPara: {
    color: Colors.VIOLET_TEXT,
    fontSize: 16,
    lineHeight: 22.5,
    marginTop: 12,
    alignSelf: 'center',
    fontFamily: fontFamily.primaryRegular,
  },
  aboutSectionParaBold: {
    color: Colors.VIOLET_TEXT,
    fontSize: 16,
    lineHeight: 22.5,
    marginTop: 12,
    alignSelf: 'center',
    fontFamily: fontFamily.primaryBold,
  },
  spacer: {
    marginVertical: '2%',
  },
  row: {
    flexDirection: 'row',
    color: Colors.PRIMARY_TEXT,
    alignItems: 'flex-start',
  },
});

export default AboutScreen;
