import React, { Component } from 'react';
import {
  BackHandler,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';

import { Icons, Images } from '../assets';
import { IconButton } from '../components/IconButton';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';
import { LAST_CHECKED } from '../constants/storage';
import { Theme } from '../constants/themes';
import { isGPS } from '../COVIDSafePathsConfig';
import { SetStoreData } from '../helpers/General';
import { checkIntersect } from '../helpers/Intersect';
import languages from '../locales/languages';
import { HCAService } from '../services/HCAService';

class AuthorityInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAutoSubscribed: false,
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    await this.fetchAutoSubscribeStatus();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    // set the LAST_CHECKED time to 0, so the intersection will kick off
    SetStoreData(LAST_CHECKED, 0);

    // Force update, this will download any changed Healthcare Authorities
    checkIntersect();
  }

  async fetchAutoSubscribeStatus() {
    const isAutoSubscribed = await HCAService.isAutosubscriptionEnabled();
    this.setState({ isAutoSubscribed });
  }

  async toggleAutoSubscribe() {
    this.setState(
      prevState => ({
        isAutoSubscribed: !prevState.isAutoSubscribed,
      }),
      async () => {
        this.state.isAutoSubscribed
          ? await HCAService.enableAutoSubscription()
          : await HCAService.disableAutoSubscription();
      },
    );
  }

  render() {
    return (
      <Theme>
        <NavigationBarWrapper
          title={languages.t('label.choose_provider_title')}
          onBackPress={this.backToMain.bind(this)}>
          <View style={{ flex: 1 }}>
            <View style={styles.main}>
              <Image source={Images.Doctors} style={styles.docImage} />
              <Typography style={styles.sectionDescription} use={'body1'}>
                {languages.t('authorities.authority_info')}
              </Typography>
            </View>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('SelectedHAsScreen')
              }>
              <View
                style={[
                  styles.toggaleContainer,
                  { backgroundColor: Colors.TRANSPARENT },
                ]}>
                <Typography
                  style={styles.viewAuthoritiesText}
                  use={'headline3'}>
                  {languages.t('authorities.view_your_health_authorities')}
                </Typography>
                <IconButton
                  style={{ marginRight: 10 }}
                  icon={Icons.ArrowNext}
                  size={18}
                />
              </View>
            </TouchableOpacity>
            {__DEV__ && isGPS && (
              <View style={styles.toggaleContainer}>
                <Typography
                  style={styles.automaticallyFollowText}
                  use={'body3'}>
                  {languages.t('authorities.automatically_follow_ha')}
                </Typography>
                <Switch
                  onValueChange={() => this.toggleAutoSubscribe()}
                  value={this.state.isAutoSubscribed}
                />
              </View>
            )}
          </View>
        </NavigationBarWrapper>
      </Theme>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  sectionDescription: {
    margin: 24,
    overflow: 'scroll',
    color: Colors.VIOLET_TEXT,
    fontSize: 18,
  },
  toggaleContainer: {
    padding: 20,
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
  },
  automaticallyFollowText: {
    paddingRight: 10,
    flex: 1,
    fontSize: 14,
  },
  viewAuthoritiesText: {
    paddingRight: 10,
    flex: 1,
    fontSize: 18,
  },
  docImage: {
    paddingHorizontal: -60,
  },
});

export default AuthorityInfoScreen;
