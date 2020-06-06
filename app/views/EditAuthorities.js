import React, { Component } from 'react';
import {
  BackHandler,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

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

class EditAuthoritiesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allHealthAuthorities: [],
      displayUrlEntry: 'none',
      urlEntryInProgress: false,
      urlText: '',
      usersAuthorities: [],
      isAuthorityFilterActive: false,
      isAutoSubscribed: false,
      isTester: true,
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
    this.loadData();
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.loadData();
  }

  async loadData() {
    await this.fetchAllAuthoritiesFromYML();
    await this.fetchSelectedAuthorities();
    await this.setSelection();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  async fetchAllAuthoritiesFromYML() {
    let ymlAuthorities = await HCAService.getAuthoritiesList();
    ymlAuthorities = ymlAuthorities.map(function(item) {
      const key = Object.keys(item)[0];
      const url = Object.values(item)[0][0].url;
      return { key, url };
    });
    this.setState({ allHealthAuthorities: ymlAuthorities });
  }

  async fetchSelectedAuthorities() {
    const usersAuthorities = await HCAService.getUserAuthorityList();
    this.setState({ usersAuthorities });
  }

  async setSelection() {
    let { usersAuthorities, allHealthAuthorities } = this.state;
    const selectedAuthoritiesKeys = usersAuthorities.map(function(item) {
      if (item.isManual) {
        allHealthAuthorities.push(item);
      }
      return item.key;
    });
    const modifiedArray = allHealthAuthorities.map(item =>
      Object.assign({
        ...item,
        isSelected: selectedAuthoritiesKeys.includes(item.key),
      }),
    );
    this.setState({ allHealthAuthorities: modifiedArray });
  }

  handleSaveClick() {
    const { allHealthAuthorities } = this.state;
    const selectedArray = allHealthAuthorities.filter(item => {
      return item.isSelected;
    });
    SetStoreData(AUTHORITY_SOURCE_SETTINGS, selectedArray);
    this.props.route.params.refreshList();
    this.props.navigation.goBack();
  }

  handleToggle(index) {
    let tempArray = this.state.allHealthAuthorities;
    let item = tempArray[index];
    item.isSelected = !item.isSelected;
    this.setState({ allHealthAuthorities: tempArray });
    console.log(tempArray);
  }

  renderRowItem(item, index) {
    return (
      <TouchableOpacity
        onPress={() => this.handleToggle(index)}
        style={styles.flatlistRowView}>
        <View style={styles.innerRowContainer}>
          <Typography style={styles.item} use={'body3'}>
            {item.key}
            {index}
          </Typography>
          {item.isSelected && (
            <IconButton onPress={null} icon={Icons.GreenCheck} size={24} />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Theme>
        <NavigationBarWrapper
          title={languages.t('label.choose_provider_title')}
          rightTitle={'Save'}
          onRightPress={this.handleSaveClick.bind(this)}
          onBackPress={this.backToMain.bind(this)}>
          <View style={{ flex: 1 }}>
            <Typography style={styles.header} use={'body3'}>
              {languages.t('authorities.all_health_care_authorities')}
            </Typography>
            <FlatList
              data={this.state.allHealthAuthorities}
              renderItem={({ item, index }) => this.renderRowItem(item, index)}
            />
            {this.state.isTester && (
              <View style={styles.footerContainer}>
                <Button
                  label={'Manually Add Via URL'}
                  onPress={() => {
                    this.props.navigation.navigate('AddManualURLScreen', {
                      refreshList: () => this.refreshList(),
                    });
                  }}
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
  header: {
    paddingVertical: 12,
    paddingHorizontal: 21,
    color: Colors.DIVIDER,
    fontSize: 18,
    fontFamily: fontFamily.primaryMedium,
  },
  footerContainer: {
    padding: 20,
  },
  innerRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default EditAuthoritiesScreen;
