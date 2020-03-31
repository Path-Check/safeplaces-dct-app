import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import Yaml from 'js-yaml';
import RNFetchBlob from 'rn-fetch-blob';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
  withMenuContext,
} from 'react-native-popup-menu';
const { SlideInMenu } = renderers;
import { GetStoreData, SetStoreData } from '../helpers/General';
import colors from '../constants/colors';
import backArrow from './../assets/images/backArrow.png';
import closeIcon from './../assets/images/closeIcon.png';
import saveIcon from './../assets/images/saveIcon.png';
import languages from './../locales/languages';

const authoritiesListURL =
  'https://raw.githubusercontent.com/tripleblindmarket/safe-places/develop/healthcare-authorities.yaml';

// Temporary test object with authorities data
/*
let authoritiesList = {
  "Sam's Example Health Authority": {
    url:
      'https://raw.githack.com/tripleblindmarket/safe-places/develop/examples/safe-paths.json',
  },
  "Ramesh's Example Health Org": {
    url:
      'https://raw.githack.com/tripleblindmarket/safe-places/develop/examples/anotherlocale-safe-paths.json',
  },
}; */

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAuthorities: [],
      displayUrlEntry: 'none',
      urlEntryInProgress: false,
      urlText: '',
      authoritiesList: [],
    };
  }

  backToMain() {
    this.props.navigation.navigate('LocationTrackingScreen', {});
  }

  handleBackPress = () => {
    this.props.navigation.navigate('LocationTrackingScreen', {});
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.fetchAuthoritiesList();

    // Update user settings state from async storage
    GetStoreData('AUTHORITY_SOURCE_SETTINGS', false).then(result => {
      this.setState({
        selectedAuthorities: result,
      });
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  fetchAuthoritiesList() {
    try {
      RNFetchBlob.config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
      })
        .fetch('GET', authoritiesListURL, {
          //some headers ..
        })
        .then(result => {
          RNFetchBlob.fs.readFile(result.path(), 'utf8').then(list => {
            // If unable to load the file, change state to display error in appropriate menu
            let parsedFile = Yaml.safeLoad(list).Authorities;
            {
              parsedFile !== undefined
                ? this.setState({
                    authoritiesList: parsedFile,
                  })
                : this.setState({
                    authoritiesList: [
                      {
                        'Unable to load authorities list': [{ url: 'No URL' }],
                      },
                    ],
                  });
            }
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  // Add selected authorities to state, for display in the FlatList
  addAuthorityToState(authority) {
    let authorityIndex = this.state.authoritiesList.findIndex(
      x => Object.keys(x)[0] === authority,
    );

    if (
      this.state.selectedAuthorities.findIndex(x => x.key === authority) === -1
    ) {
      this.setState({
        selectedAuthorities: this.state.selectedAuthorities.concat({
          key: authority,
          url: this.state.authoritiesList[authorityIndex][authority][0].url,
        }),
      });
      // Add current settings state to async storage.
      SetStoreData('AUTHORITY_SOURCE_SETTINGS', this.state.selectedAuthorities);
    } else {
      console.log('Not adding the duplicate to sources list');
    }
  }

  addCustomUrlToState(urlInput) {
    console.log('attempting to add custom URL to state');

    if (urlInput === '') {
      console.log('URL input was empty, not saving');
    } else if (
      this.state.selectedAuthorities.findIndex(x => x.url === urlInput) != -1
    ) {
      console.log('URL input was duplicate, not saving');
    } else {
      this.setState({
        selectedAuthorities: this.state.selectedAuthorities.concat({
          key: urlInput,
          url: urlInput,
        }),
        displayUrlEntry: 'none',
        urlEntryInProgress: false,
      });
      // Add current settings state to async storage.
      SetStoreData('AUTHORITY_SOURCE_SETTINGS', this.state.selectedAuthorities);
    }
  }

  removeAuthorityFromState(authority) {
    console.log('State upon element removal:');
    console.log(this.state.selectedAuthorities);

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

            this.setState({
              selectedAuthorities: this.state.selectedAuthorities,
            });

            // Add current settings state to async storage.
            SetStoreData(
              'AUTHORITY_SOURCE_SETTINGS',
              this.state.selectedAuthorities,
            );
          },
        },
      ],
      { cancelable: false },
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backArrowTouchable}
            onPress={() => this.backToMain()}>
            <Image style={styles.backArrow} source={backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {languages.t('label.settings_title')}
          </Text>
        </View>

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
              <Text style={(styles.sectionDescription, { color: '#dd0000' })}>
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
      </SafeAreaView>
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
  valueName: {
    fontSize: 20,
    fontWeight: '800',
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
    fontFamily: 'OpenSans-Bold',
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
    width: '79%',
    marginTop: 30,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  mainText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '400',
    textAlignVertical: 'center',
    padding: 20,
  },
  smallText: {
    fontSize: 10,
    lineHeight: 24,
    fontWeight: '400',
    textAlignVertical: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
  },
  headerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(189, 195, 199,0.6)',
    alignItems: 'center',
  },
  backArrowTouchable: {
    width: 60,
    height: 60,
    paddingTop: 21,
    paddingLeft: 20,
  },
  backArrow: {
    height: 18,
    width: 18.48,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    overflow: 'scroll',
    fontFamily: 'OpenSans-Regular',
  },
  menuOptionText: {
    fontFamily: 'OpenSans-Regular',
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
    fontFamily: 'OpenSans-Regular',
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

export default withMenuContext(SettingsScreen);
