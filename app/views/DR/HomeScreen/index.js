import 'moment/locale/es';

import moment from 'moment';
import { Button, Card, Left, Text } from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';

import settingsIcon from '../../../assets/svgs/settingsIcon';
import {
  Aurora,
  Feels,
  LocationMatch,
} from '../../../components/DR/ActionCards/ActionCards.js';
import Colors from '../../../constants/colors';
import { getAllCases } from '../../../services/DR/getAllCases.js';
import styles from './style';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updated: 0,
      cases: 0,
      deaths: 0,
      recovered: 0,
      todayCases: 0,
      refreshing: false,
    };
    this.handler = this.handler.bind(this);
  }

  handler() {
    this.setState({
      isPositiveConfirmed: true,
    });
  }

  // This fuction is to abreviate or separate numbers, ex: 1000 => 1,000, 100000 => 100K
  separateOrAbreviate = data => {
    const { cases, deaths, recovered, todayCases } = data;

    const oldCases = [cases, deaths, recovered, todayCases];

    const newCases = oldCases.map(number => {
      switch (number > 0) {
        case number < 1e3:
          return number;

        case number >= 1e3 && number < 1e5:
          return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

        case number >= 1e5 && number < 1e6:
          return +(number / 1e3).toFixed(1) + 'K';

        default:
          return +(number / 1e6).toFixed(1) + 'M';
      }
    });
    return {
      cases: newCases[0],
      deaths: newCases[1],
      recovered: newCases[2],
      todayCases: newCases[3],
    };
  };

  getCases = () => {
    getAllCases().then(({ updated, cases, deaths, recovered, todayCases }) => {
      this.setState(state => ({
        ...state,
        updated,
        ...this.separateOrAbreviate({ cases, deaths, recovered, todayCases }), // To take all the cards' content and abreviate them
        refreshing: false,
      }));
    });
  };

  getUpdateDate = () => {
    const { updated } = this.state;

    const dateOfCase = new Date(updated);

    let month = dateOfCase.getMonth() + 1;
    month = month <= 9 ? '0' + month : month;
    let day = dateOfCase.getDate();
    day = day <= 9 ? '0' + day : day;
    const year = dateOfCase.getFullYear();

    return `${day}/${month}/${year}`;
  };

  refresh = () => {
    this.setState(state => ({ ...state, refreshing: true }), this.getCases);
  };

  componentDidMount() {
    this.getCases();
  }

  getSettings() {
    return (
      <TouchableOpacity
        style={styles.settingsContainer}
        onPress={() => {
          this.props.navigation.navigate('SettingsScreen');
        }}>
        <SvgXml xml={settingsIcon} width={30} height={30} color='white' />
      </TouchableOpacity>
    );
  }

  render() {
    const { t } = this.props;
    const date = moment(new Date(), 'DD/MM/YYYY').format('MMMM YYYY');
    const {
      getUpdateDate,
      props: { navigation },
      state: { cases, deaths, recovered, todayCases, refreshing },
    } = this;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: Colors.BLUE_RIBBON }}>
          <View>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              refreshControl={
                <RefreshControl
                  tintColor={Colors.LIGHT_GRAY}
                  refreshing={refreshing}
                  onRefresh={this.refresh}
                />
              }>
              <View style={styles.mainHeader}>
                <View style={styles.rowAndCenter}>
                  <Left>
                    <Text style={[styles.text, { color: Colors.WHITE }]}>
                      {date[0].toUpperCase() + date.slice(1)}
                    </Text>
                  </Left>
                </View>
                <Text style={styles.headerText}>COVID-RD</Text>
              </View>
              <View style={{ marginHorizontal: wp('2%') }}>
                <View style={styles.marginAndAlign}>
                  <Feels navigation={navigation} handler={this.handler} />
                  <View style={styles.marginAndAlign}>
                    <View style={styles.actualSituationContent}>
                      <Text
                        style={[
                          styles.subtitles,
                          { alignSelf: 'center', marginVertical: hp('1%') },
                        ]}>
                        {t('label.current_situation_label')}
                      </Text>
                      <Text
                        style={[styles.dateSubtitle, { alignSelf: 'center' }]}>
                        {getUpdateDate()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.actualSituationContainer}>
                    <Card style={styles.infoCards}>
                      <Text style={[styles.dataText]}>{cases}</Text>
                      <Text style={styles.text}>
                        {t('label.positive_label')}
                      </Text>
                    </Card>

                    <Card style={styles.infoCards}>
                      <Text
                        style={[
                          styles.dataText,
                          { color: Colors.BUTTON_LIGHT_TEX },
                        ]}>
                        {deaths}
                      </Text>
                      <Text style={styles.text}>
                        {t('label.deceased_label')}
                      </Text>
                    </Card>

                    <Card style={styles.infoCards}>
                      <Text style={[styles.dataText, { color: Colors.GREEN }]}>
                        {recovered}
                      </Text>
                      <Text style={styles.text}>
                        {t('label.recovered_label')}
                      </Text>
                    </Card>
                    <Card style={styles.infoCards}>
                      <Text style={[styles.dataText, { color: Colors.SUN }]}>
                        {todayCases}
                      </Text>
                      <Text style={styles.text}>
                        {t('label.case_day_label')}
                      </Text>
                    </Card>
                  </View>
                  <LocationMatch navigation={this.props.navigation} />
                  <Aurora navigation={this.props.navigation} />
                  <View style={styles.footer}>
                    <View style={{ margin: wp('5%') }}>
                      <Text
                        style={[
                          styles.text,
                          { color: Colors.GRAY, textAlign: 'center' },
                        ]}>
                        {t('label.home_screen_bottom_text')}
                      </Text>
                    </View>
                  </View>
                  <Button
                    small
                    bordered
                    rounded
                    info
                    onPress={() => navigation.navigate('Sponsors')}
                    style={{ marginBottom: 10, padding: 15 }}>
                    <Text
                      style={[
                        styles.text,
                        {
                          fontSize: 12,
                          color: Colors.BLUE_LINK,
                          textAlign: 'center',
                        },
                      ]}>
                      {t('label.sponsor_title')}
                    </Text>
                  </Button>
                </View>
              </View>
              {this.getSettings()}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(HomeScreen);
