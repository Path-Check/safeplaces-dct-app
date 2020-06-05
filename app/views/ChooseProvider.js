import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
  withMenuContext,
} from 'react-native-popup-menu';
import validUrl from 'valid-url';

import { Icons } from '../assets';
import {
  Button,
  Checkbox,
  DynamicTextInput,
  NavigationBarWrapper,
  Typography,
} from '../components';
import Colors from '../constants/colors';
import { AUTHORITY_SOURCE_SETTINGS, LAST_CHECKED } from '../constants/storage';
import { Theme } from '../constants/themes';
import { isGPS } from '../COVIDSafePathsConfig';
import { SetStoreData } from '../helpers/General';
import { checkIntersect } from '../helpers/Intersect';
import languages from '../locales/languages';
import { HCAService } from '../services/HCAService';
import { KeyboardAvoidingView } from './common/KeyboardAvoidingView';

const { SlideInMenu } = renderers;

class ChooseProviderScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAuthorities: [],
      displayUrlEntry: 'none',
      urlEntryInProgress: false,
      urlText: '',
      authoritiesList: [],
      isAuthorityFilterActive: false,
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
    await this.fetchAuthoritiesList(this.state.isAuthorityFilterActive);
    await this.fetchUserAuthorities();
    __DEV__ && (await this.fetchAutoSubscribeStatus());
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    // set the LAST_CHECKED time to 0, so the intersection will kick off
    SetStoreData(LAST_CHECKED, 0);

    // Force update, this will download any changed Healthcare Authorities
    checkIntersect();
  }

  async fetchUserAuthorities() {
    const selectedAuthorities = await HCAService.getUserAuthorityList();

    if (selectedAuthorities) {
      this.setState({ selectedAuthorities });
    } else {
      console.log('No stored authority settings.');
    }
  }

  async fetchAutoSubscribeStatus() {
    const isAutoSubscribed = await HCAService.isAutosubscriptionEnabled();
    this.setState({ isAutoSubscribed });
  }

  /**
   *
   * @param {boolean} filterByGPSHistory - used to filter the list of HCAs based on the
   * 28 day location history of the user
   * @returns void
   */
  async fetchAuthoritiesList(filterByGPSHistory) {
    let authoritiesList = [];

    if (filterByGPSHistory && isGPS) {
      authoritiesList = await HCAService.getAuthoritiesFromUserLocHistory();
    } else {
      authoritiesList = await HCAService.getAuthoritiesList();
    }

    this.setState({ authoritiesList });
  }

  // Add selected authorities to state, for display in the FlatList
  addAuthorityToState(authority) {
    let authorityIndex = this.state.authoritiesList.findIndex(
      (x) => Object.keys(x)[0] === authority,
    );

    if (
      this.state.selectedAuthorities.findIndex((x) => x.key === authority) ===
      -1
    ) {
      this.setState(
        {
          selectedAuthorities: this.state.selectedAuthorities.concat({
            key: authority,
            url: this.state.authoritiesList[authorityIndex][authority][0].url,
          }),
        },
        () => {
          // Add current settings state to async storage.
          SetStoreData(
            AUTHORITY_SOURCE_SETTINGS,
            this.state.selectedAuthorities,
          );
        },
      );
    } else {
      console.log('Not adding the duplicate to sources list');
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

  setUrlText = (urlText) => this.setState({ urlText });

  /**
   * Checks if the user selected any authorities whose `url` matches
   * the `url` param.
   * @param {string} url
   */
  hasExistingAuthorityWithUrl = (url) => {
    return this.state.selectedAuthorities.some((x) => x.url === url);
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

    if (!validUrl.isWebUri(url) || this.hasExistingAuthorityWithUrl(url)) {
      this.triggerInvalidUrlAlert();
    } else {
      const newAuthority = { key: url, url };
      const newAuthorities = selectedAuthorities.concat(newAuthority);

      this.setState({ selectedAuthorities: newAuthorities }, () => {
        SetStoreData(AUTHORITY_SOURCE_SETTINGS, this.state.selectedAuthorities);
      });
    }
    this.resetUrlInput();
  };

  removeAuthorityFromState(authority) {
    Alert.alert(
      languages.t('label.authorities_removal_alert_title'),
      languages.t('label.authorities_removal_alert_desc'),
      [
        {
          text: languages.t('label.authorities_removal_alert_cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: languages.t('label.authorities_removal_alert_proceed'),
          onPress: () => {
            let removalIndex = this.state.selectedAuthorities.indexOf(
              authority,
            );
            this.state.selectedAuthorities.splice(removalIndex, 1);

            this.setState(
              {
                selectedAuthorities: this.state.selectedAuthorities,
              },
              () => {
                // Add current settings state to async storage.
                SetStoreData(
                  AUTHORITY_SOURCE_SETTINGS,
                  this.state.selectedAuthorities,
                );
              },
            );
          },
        },
      ],
      { cancelable: false },
    );
  }

  toggleFilterAuthoritesByGPSHistory() {
    this.filterAuthoritesByGPSHistory({
      val: !this.state.isAuthorityFilterActive,
    });
  }

  async filterAuthoritesByGPSHistory(isAuthorityFilterActive) {
    await this.fetchAuthoritiesList(isAuthorityFilterActive.val);
    this.setState({ isAuthorityFilterActive: isAuthorityFilterActive.val });
  }

  async toggleAutoSubscribe() {
    this.setState(
      (prevState) => ({
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
      <Theme use='default'>
        <NavigationBarWrapper
          title={languages.t('label.choose_provider_title')}
          onBackPress={this.backToMain.bind(this)}>
          <KeyboardAvoidingView behavior='padding'>
            <View style={styles.main}>
              <Typography style={styles.sectionDescription} use={'body1'}>
                {languages.t('label.authorities_desc')}
              </Typography>
              {__DEV__ && isGPS && (
                <TouchableOpacity style={styles.autoSubscribe}>
                  <Checkbox
                    label={languages.t('label.auto_subscribe_checkbox')}
                    checked={this.state.isAutoSubscribed}
                    onPress={() => this.toggleAutoSubscribe()}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.listContainer}>
              {this.state.selectedAuthorities.length == 0 &&
              !this.state.urlEntryInProgress ? (
                <Typography
                  style={[styles.sectionDescription, styles.noDataSourceText]}
                  use={'headline2'}>
                  {languages.t('label.authorities_no_sources')}
                </Typography>
              ) : (
                <>
                  <View
                    style={[
                      styles.flatlistRowView,
                      { display: this.state.displayUrlEntry },
                    ]}>
                    <DynamicTextInput
                      onChangeText={this.setUrlText}
                      value={this.state.urlText}
                      autoFocus={this.state.urlEntryInProgress}
                      style={[styles.item, styles.textInput]}
                      placeholder={languages.t('label.enter_authority_url')}
                      onSubmitEditing={this.addCustomUrlToState}
                    />
                    <TouchableOpacity onPress={this.addCustomUrlToState}>
                      <Image source={Icons.SaveIcon} style={styles.saveIcon} />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={this.state.selectedAuthorities}
                    renderItem={({ item }) => (
                      <View style={styles.flatlistRowView}>
                        <Typography style={styles.item} use={'body3'}>
                          {item.key}
                        </Typography>
                        <TouchableOpacity
                          onPress={() => this.removeAuthorityFromState(item)}>
                          <Image
                            source={Icons.CloseIcon}
                            style={styles.closeIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </>
              )}
            </View>
            <Menu
              name='AuthoritiesMenu'
              renderer={SlideInMenu}
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: 12,
              }}>
              <MenuTrigger>
                <Button
                  label={languages.t('label.authorities_add_button_label')}
                  onPress={() =>
                    this.props.ctx.menuActions.openMenu('AuthoritiesMenu')
                  }
                  disabled={this.state.urlEditInProgress}
                />
              </MenuTrigger>
              <MenuOptions>
                {__DEV__ && isGPS && (
                  <TouchableOpacity
                    style={styles.authorityFilter}
                    onPress={() => this.toggleFilterAuthoritesByGPSHistory()}>
                    <Typography
                      style={styles.authorityFilterText}
                      use={'body2'}>
                      {languages.t('label.filter_authorities_by_gps_history')}
                    </Typography>
                    <Switch
                      onValueChange={(val) =>
                        this.filterAuthoritesByGPSHistory({ val })
                      }
                      value={this.state.isAuthorityFilterActive}
                    />
                  </TouchableOpacity>
                )}
                {this.state.authoritiesList === undefined
                  ? null
                  : this.state.authoritiesList.map((item) => {
                      let name = Object.keys(item)[0];
                      let key = this.state.authoritiesList.indexOf(item);

                      return (
                        <MenuOption
                          key={key}
                          onSelect={() => {
                            this.addAuthorityToState(name);
                          }}
                          disabled={this.state.authoritiesList.length === 1}>
                          <Typography
                            style={styles.menuOptionText}
                            use={'body2'}>
                            {name}
                          </Typography>
                        </MenuOption>
                      );
                    })}
                <MenuOption
                  onSelect={() => {
                    this.setState({
                      displayUrlEntry: 'flex',
                      urlEntryInProgress: true,
                    });
                  }}>
                  <Typography style={styles.menuOptionText} use={'body2'}>
                    {languages.t('label.authorities_add_url')}
                  </Typography>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </KeyboardAvoidingView>
        </NavigationBarWrapper>
      </Theme>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 2,
    flexDirection: 'column',
    textAlignVertical: 'top',
    // alignItems: 'center',
    padding: 20,
    width: '96%',
    alignSelf: 'center',
  },
  listContainer: {
    flex: 2,
    flexDirection: 'column',
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
    padding: 10,
    width: '96%',
    alignSelf: 'center',
  },
  sectionDescription: {
    marginTop: 12,
    overflow: 'scroll',
    color: Colors.VIOLET_TEXT,
  },
  authorityFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: Colors.LIGHT_GRAY,
    borderTopWidth: 3,
    borderTopColor: Colors.DIVIDER,
    justifyContent: 'space-between',
  },
  authorityFilterText: {
    padding: 10,
    color: Colors.VIOLET_TEXT,
  },
  menuOptionText: {
    padding: 10,
  },
  // eslint-disable-next-line react-native/no-color-literals
  flatlistRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 7,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#999999',
  },
  item: {
    padding: 10,
    maxWidth: '90%',
  },
  closeIcon: {
    width: 15,
    height: 15,
    opacity: 0.5,
    marginTop: 14,
  },
  saveIcon: {
    width: 17,
    height: 17,
    opacity: 0.5,
    marginTop: 14,
  },
  textInput: {
    marginLeft: 10,
  },
  autoSubscribe: {
    paddingTop: 25,
  },
  noDataSourceText: {
    textAlign: 'center',
    fontSize: 18,
  },
});

export default withMenuContext(ChooseProviderScreen);
