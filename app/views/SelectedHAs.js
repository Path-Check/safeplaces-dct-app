import React, { Component } from 'react';
import { Alert, BackHandler, FlatList, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import { AUTHORITY_SOURCE_SETTINGS } from '../constants/storage';
import { Theme } from '../constants/themes';
import { SetStoreData } from '../helpers/General';
import languages from '../locales/languages';
import { HCAService } from '../services/HCAService';

class SelectedHAsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAuthorities: [],
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  moveToEdit() {
    this.props.navigation.navigate('EditAuthoritiesScreen', {
      refreshList: () => this.refreshList(),
    });
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  async refreshList() {
    await this.fetchUserAuthorities();
  }

  async componentDidMount() {
    this.addFocusListener();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    await this.fetchUserAuthorities();
  }

  addFocusListener() {
    this.props.navigation.addListener('willFocus', () => {
      this.fetchUserAuthorities();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  async fetchUserAuthorities() {
    const selectedAuthorities = await HCAService.getUserAuthorityList();
    console.log('selectedAuthorities: ' + JSON.stringify(selectedAuthorities));
    if (selectedAuthorities) {
      this.setState({ selectedAuthorities });
    } else {
      console.log('No stored authority settings.');
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
                );
              },
            );
          },
        },
      ],
      { cancelable: false },
    );
  }

  renderRowItem(item) {
    return (
      <TouchableOpacity
        onLongPress={() => {
          this.removeAuthorityFromState(item);
        }}
        style={styles.flatlistRowView}>
        <Typography style={styles.item} use={'body3'}>
          {item.key}
        </Typography>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Theme>
        <NavigationBarWrapper
          title={languages.t('label.choose_provider_title')}
          rightTitle={'Edit'}
          onRightPress={this.moveToEdit.bind(this)}
          onBackPress={this.backToMain.bind(this)}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.selectedAuthorities}
              renderItem={({ item, index }) => this.renderRowItem(item, index)}
            />
          </View>
        </NavigationBarWrapper>
      </Theme>
    );
  }
}

const styles = StyleSheet.create({
  flatlistRowView: {
    padding: 21,
    borderColor: Colors.VIOLET_BUTTON_LIGHT,
    borderWidth: 0.5,
  },
  item: {
    flex: 1,
    fontSize: 18,
    fontFamily: fontFamily.primaryMedium,
  },
});

export default SelectedHAsScreen;
