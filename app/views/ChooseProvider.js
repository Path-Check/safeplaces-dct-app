import React, { Component } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
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

import backArrow from './../assets/images/backArrow.png';
import closeIcon from './../assets/images/closeIcon.png';
import saveIcon from './../assets/images/saveIcon.png';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import { AUTHORITY_SOURCE_SETTINGS } from '../constants/storage';
import { SetStoreData } from '../helpers/General';
import { checkIntersect } from '../helpers/Intersect';
import languages from '../locales/languages';
import HCAService from '../services/HCAService';

const { SlideInMenu } = renderers;

const width = Dimensions.get('window').width;

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
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.fetchAuthoritiesList(this.state.isAuthorityFilterActive);

    HCAService.getUserAuthorityList().then(authorities => {
      // Update user settings state from async storage
      if (authorities) {
        this.setState({ selectedAuthorities: authorities });
      } else {
        console.log('No stored authority settings.');
      }
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  /**
   *
   * @param {boolean} filterByGPSHistory - used to filter the list of HCAs based on the
   * 28 day location history of the user
   * @returns void
   */
  async fetchAuthoritiesList(filterByGPSHistory) {
    let authoritiesList = [];

    if (filterByGPSHistory) {
      authoritiesList = await HCAService.getAuthoritiesFromUserLocHistory();
    } else {
      authoritiesList = await HCAService.getAuthoritiesList();
    }

    this.setState({ authoritiesList });
  }

  // Add selected authorities to state, for display in the FlatList
  addAuthorityToState(authority) {
    let authorityIndex = this.state.authoritiesList.findIndex(
      x => Object.keys(x)[0] === authority,
    );

    if (
      this.state.selectedAuthorities.findIndex(x => x.key === authority) === -1
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
          ).then(() => {
            // Force updates immediately.
            checkIntersect();
          });
        },
      );
    } else {
      console.log('Not adding the duplicate to sources list');
    }
  }

  addCustomUrlToState(urlInput) {
    if (urlInput === '') {
      console.log('URL input was empty, not saving');
    } else if (
      this.state.selectedAuthorities.findIndex(x => x.url === urlInput) != -1
    ) {
      console.log('URL input was duplicate, not saving');
    } else {
      this.setState(
        {
          selectedAuthorities: this.state.selectedAuthorities.concat({
            key: urlInput,
            url: urlInput,
          }),
          displayUrlEntry: 'none',
          urlEntryInProgress: false,
        },
        () => {
          // Add current settings state to async storage.
          SetStoreData(
            AUTHORITY_SOURCE_SETTINGS,
            this.state.selectedAuthorities,
          ).then(() => {
            // Force updates immediately.
            checkIntersect();
          });
        },
      );
    }
  }

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
                ).then(() => {
                  // Force updates immediately.
                  checkIntersect();
                });
              },
            );
          },
        },
      ],
      { cancelable: false },
    );
  }

  async filterAuthoritesByGPSHistory(isAuthorityFilterActive) {
    await this.fetchAuthoritiesList(isAuthorityFilterActive);
    this.setState({ isAuthorityFilterActive });
  }

  render() {
    return (
      <NavigationBarWrapper
        title={languages.t('label.choose_provider_title')}
        onBackPress={this.backToMain.bind(this)}>
        <View style={styles.main}>
          <Text style={styles.headerTitle}>
            {languages.t('label.authorities_title')}
          </Text>
          <Text style={styles.sectionDescription}>
            {languages.t('label.authorities_desc')}
          </Text>
        </View>

        <View style={styles.listContainer}>
          {Object.keys(this.state.selectedAuthorities).length == 0 ? (
            <>
              <Text
                style={
                  (styles.sectionDescription,
                  {
                    textAlign: 'center',
                    fontSize: 24,
                    paddingTop: 30,
                    color: '#dd0000',
                  })
                }>
                {languages.t('label.authorities_no_sources')}
              </Text>
              <View
                style={[
                  styles.flatlistRowView,
                  { display: this.state.displayUrlEntry },
                ]}>
                <TextInput
                  onChangeText={text => {
                    this.setState({
                      urlText: text,
                    });
                  }}
                  value={this.state.urlText}
                  autoFocus={this.state.urlEntryInProgress}
                  style={[styles.item, styles.textInput]}
                  placeholder={languages.t(
                    'label.authorities_input_placeholder',
                  )}
                  onSubmitEditing={() =>
                    this.addCustomUrlToState(this.state.urlText)
                  }
                />
                <TouchableOpacity
                  onPress={() => this.addCustomUrlToState(this.state.urlText)}>
                  <Image source={saveIcon} style={styles.saveIcon} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View
                style={[
                  styles.flatlistRowView,
                  { display: this.state.displayUrlEntry },
                ]}>
                <TextInput
                  onChangeText={text => {
                    this.setState({
                      urlText: text,
                    });
                  }}
                  value={this.state.urlText}
                  autoFocus={this.state.urlEntryInProgress}
                  style={[styles.item, styles.textInput]}
                  placeholder='Paste your URL here'
                  onSubmitEditing={() =>
                    this.addCustomUrlToState(this.state.urlText)
                  }
                />
                <TouchableOpacity
                  onPress={() => this.addCustomUrlToState(this.state.urlText)}>
                  <Image source={saveIcon} style={styles.saveIcon} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={this.state.selectedAuthorities}
                renderItem={({ item }) => (
                  <View style={styles.flatlistRowView}>
                    <Text style={styles.item}>{item.key}</Text>
                    <TouchableOpacity
                      onPress={() => this.removeAuthorityFromState(item)}>
                      <Image source={closeIcon} style={styles.closeIcon} />
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
          style={{ flex: 1, justifyContent: 'center' }}>
          <MenuTrigger>
            <TouchableOpacity
              style={styles.startLoggingButtonTouchable}
              onPress={() =>
                this.props.ctx.menuActions.openMenu('AuthoritiesMenu')
              }
              disabled={this.state.urlEditInProgress}>
              <Text style={styles.startLoggingButtonText}>
                {languages.t('label.authorities_add_button_label')}
              </Text>
            </TouchableOpacity>
          </MenuTrigger>
          <MenuOptions>
            <View style={styles.authorityFilter}>
              <Text style={styles.authorityFilterText}>
                {languages.t('label.filter_authorities_by_gps_history')}
              </Text>
              <Switch
                onValueChange={val => this.filterAuthoritesByGPSHistory(val)}
                value={this.state.isAuthorityFilterActive}
              />
            </View>
            {this.state.authoritiesList === undefined
              ? null
              : this.state.authoritiesList.map(item => {
                  let name = Object.keys(item)[0];
                  let key = this.state.authoritiesList.indexOf(item);

                  return (
                    <MenuOption
                      key={key}
                      onSelect={() => {
                        this.addAuthorityToState(name);
                      }}
                      disabled={this.state.authoritiesList.length === 1}>
                      <Text style={styles.menuOptionText}>{name}</Text>
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
              <Text style={styles.menuOptionText}>
                {languages.t('label.authorities_add_url')}
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </NavigationBarWrapper>
    );
  }
}

const styles = StyleSheet.create({
  // Container covers the entire screen
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
  },
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
    flex: 3,
    flexDirection: 'column',
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
    padding: 20,
    width: '96%',
    alignSelf: 'center',
    backgroundColor: colors.WHITE,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
  },
  value: {
    fontSize: 20,
    fontWeight: '200',
  },
  startLoggingButtonTouchable: {
    borderRadius: 12,
    backgroundColor: '#665eff',
    height: 52,
    alignSelf: 'center',
    width: '79%',
    justifyContent: 'center',
  },
  startLoggingButtonText: {
    fontFamily: fontFamily.primaryBold,
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },

  buttonTouchable: {
    borderRadius: 12,
    backgroundColor: '#665eff',
    height: 52,
    alignSelf: 'center',
    width: width * 0.7866,
    marginTop: 30,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: fontFamily.primaryBold,
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fontFamily.primaryBold,
    color: colors.VIOLET_TEXT,
  },
  backArrow: {
    height: 18,
    width: 18.48,
  },
  sectionDescription: {
    fontSize: 18,
    lineHeight: 24,
    marginTop: 12,
    overflow: 'scroll',
    color: colors.VIOLET_TEXT,
    fontFamily: fontFamily.primaryRegular,
  },
  authorityFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  authorityFilterText: {
    padding: 10,
    fontSize: 16,
    color: colors.VIOLET_TEXT,
  },
  menuOptionText: {
    fontFamily: fontFamily.primaryRegular,
    fontSize: 14,
    padding: 10,
  },
  flatlistRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 7,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#999999',
  },
  item: {
    fontFamily: fontFamily.primaryRegular,
    fontSize: 16,
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
});

export default withMenuContext(ChooseProviderScreen);
