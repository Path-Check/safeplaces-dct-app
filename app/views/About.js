import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, BackHandler } from 'react-native';

import languages from './../locales/languages';
import { isPlatformiOS } from './../Util';
import Colors from '../constants/colors';
import fontFamily from './../constants/fonts';
import team from './../assets/svgs/team';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { SvgXml } from 'react-native-svg';
import lock from '../assets/svgs/lock';

class AboutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.backToMain();
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    return (
      <NavigationBarWrapper
        title={languages.t('label.about_title')}
        onBackPress={this.backToMain.bind(this)}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.spacer} />

          <View style={styles.spacer} />

          <SvgXml style={styles.aboutSectionIconLock} xml={lock} />
          <Text style={styles.aboutSectionTitles}>
            {languages.t('label.commitment')}
          </Text>
          <Text style={styles.aboutSectionPara}>
            {languages.t('label.commitment_para')}
          </Text>

          <SvgXml style={styles.aboutSectionIconTeam} xml={team} />
          <Text style={styles.aboutSectionTitles}>
            {languages.t('label.team')}
          </Text>
          <Text style={styles.aboutSectionPara}>
            {languages.t('label.team_para')}
          </Text>
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
    flex: 1,
  },
  section: {
    flexDirection: 'column',
    width: '87.5%',
    alignSelf: 'center',
    backgroundColor: Colors.WHITE,
  },
  aboutSectionIconTeam: {
    width: 40.38,
    height: 19,
    marginTop: 36,
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
  divider: {
    backgroundColor: Colors.DIVIDER,
    height: 1.5,
  },
  fullDivider: {
    backgroundColor: Colors.DIVIDER,
    height: 1,
    width: '100%',
  },
  spacer: {
    marginVertical: '2%',
  },
});

export default AboutScreen;
