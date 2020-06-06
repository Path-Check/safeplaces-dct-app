import React, { Component } from 'react';
import { Alert, BackHandler, StyleSheet, TextInput, View } from 'react-native';
import validUrl from 'valid-url';

import { Icons } from '../assets';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import { AUTHORITY_SOURCE_SETTINGS } from '../constants/storage';
import { Theme } from '../constants/themes';
import { SetStoreData } from '../helpers/General';
import languages from '../locales/languages';
import { HCAService } from '../services/HCAService';

class AddManualURLScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAuthorities: [],
      displayUrlEntry: 'none',
      urlEntryInProgress: false,
      urlText: 'https://www.google.com',
      authoritiesList: [],
      isAuthorityFilterActive: false,
      isAutoSubscribed: false,
      showError: false,
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  refreshList() {
    this.props.route.params.refreshList();
    this.props.navigation.goBack();
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    await this.fetchUserAuthorities();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  async fetchUserAuthorities() {
    const selectedAuthorities = await HCAService.getUserAuthorityList();
    console.log('Hey' + JSON.stringify(selectedAuthorities));
    if (selectedAuthorities) {
      this.setState({ selectedAuthorities });
    } else {
      console.log('No stored authority settings.');
    }
  }

  triggerInvalidUrlAlert() {
    Alert.alert(
      languages.t('authorities.invalid_url_title'),
      languages.t('authorities.invalid_url_body'),
      [
        {
          text: languages.t('common.ok'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }

  setUrlText = urlText => this.setState({ urlText });

  /**
   * Checks if the user selected any authorities whose `url` matches
   * the `url` param.
   * @param {string} url
   */
  hasExistingAuthorityWithUrl = url => {
    return this.state.selectedAuthorities.some(x => x.url === url);
  };
  /**
   * Reset the URL input field to it's original/default settings
   */
  resetUrlInput = () =>
    this.setState({
      displayUrlEntry: 'none',
      urlEntryInProgress: false,
      urlText: '',
    });

  addCustomUrlToState = () => {
    let { urlText: url, selectedAuthorities } = this.state;
    if (this.hasExistingAuthorityWithUrl(url)) {
      this.setState({ showError: true });
      return;
    } else {
      const newAuthority = { key: url, url, isManual: true };
      const newAuthorities = selectedAuthorities.concat(newAuthority);
      this.setState({ selectedAuthorities: newAuthorities }, () => {
        SetStoreData(AUTHORITY_SOURCE_SETTINGS, this.state.selectedAuthorities);
      });
      this.refreshList();
    }
    this.resetUrlInput();
  };

  renderURLInput() {
    return (
      <View style={[styles.inputMainContainer, styles.inputContainer]}>
        <IconButton
          style={{ marginRight: 10 }}
          icon={Icons.URLIcon}
          size={18}
        />
        <TextInput
          placeholder={'www.healthauthority.com'}
          onChangeText={urlText => this.setState({ urlText, showError: false })}
          value={this.state.urlText}
          style={{
            flex: 1,
            fontSize: 18,
            fontFamily: fontFamily.primaryRegular,
          }}
        />
      </View>
    );
  }

  render() {
    const { showError } = this.state;
    return (
      <Theme>
        <NavigationBarWrapper
          title={languages.t('label.add_manual_url_title')}
          onBackPress={this.backToMain.bind(this)}>
          <Typography style={styles.sectionDescription} use={'boady1'}>
            {languages.t('authorities.authority_input_title')}
          </Typography>
          {this.renderURLInput()}
          {showError && (
            <Typography style={styles.authorityExistError} use={'boady1'}>
              {languages.t('authorities.authority_already_exist')}
            </Typography>
          )}
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }} />
            <View style={styles.footerContainer}>
              <Button
                disabled={!validUrl.isWebUri(this.state.urlText)}
                label={'ADD'}
                onPress={() => {
                  this.addCustomUrlToState();
                }}
              />
            </View>
          </View>
        </NavigationBarWrapper>
      </Theme>
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    padding: 20,
  },
  sectionDescription: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: fontFamily.primaryMedium,
    marginHorizontal: 21,
    marginTop: 58,
    color: Colors.VIOLET_TEXT_DARK,
  },
  authorityExistError: {
    fontSize: 14,
    fontFamily: fontFamily.primaryRegular,
    marginHorizontal: 23,
    color: Colors.RED_TEXT,
  },
  inputContainer: {
    borderColor: Colors.VIOLET_BUTTON_LIGHT,
  },
  inputMainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginTop: 25,
    marginHorizontal: 23,
  },
});

export default AddManualURLScreen;
