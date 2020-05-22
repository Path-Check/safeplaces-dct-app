import 'moment/locale/es';

import moment from 'moment';
import { Card, Left, Text } from 'native-base';
import React, { Component } from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';

import settingsIcon from '../../../assets/svgs/settingsIcon';
import {
  Aurora,
  Feels,
} from '../../../components/DR/ActionCards/ActionCards.js';
import Colors from '../../../constants/colors';
import languages from '../../../locales/languages';
import { getAllCases } from '../../../services/DR/getAllCases.js';
import styles from './style';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cases: 0,
      deaths: 0,
      recovered: 0,
      todayCases: 0,
      refreshing: false,
    };
  }

  getCases = () => {
    getAllCases().then(({ cases, deaths, recovered, todayCases }) => {
      this.setState(state => ({
        ...state,
        cases,
        deaths,
        recovered,
        todayCases,
        refreshing: false,
      }));
    });
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
    const date = moment(new Date(), 'DD/MM/YYYY').format('MMMM YYYY');
    const {
      props: { navigation },
      state: { cases, deaths, recovered, todayCases, updatedAt, refreshing },
    } = this;

    return (
      <View style={{ flex: 1, backgroundColor: Colors.MAIN_BLUE }}>
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
                  <Text style={[styles.text, { color: '#fff' }]}>
                    {date[0].toUpperCase() + date.slice(1)}
                  </Text>
                </Left>
              </View>
              <Text style={styles.headerText}>COVID-RD</Text>
            </View>
            <View style={{ marginHorizontal: wp('2%') }}>
              <View style={styles.marginAndAlign}>
                <Feels navigation={navigation} />
                <View style={styles.marginAndAlign}>
                  <View style={styles.actualSituationContent}>
                    <Text style={[styles.subtitles, { alignSelf: 'center' }]}>
                      {languages.t('label.current_situation_label')}
                    </Text>
                  </View>
                  <Text style={[styles.subtitles, { color: '#747474' }]}>
                    {updatedAt}
                  </Text>
                </View>
                <View style={styles.actualSituationContainer}>
                  <TouchableOpacity>
                    <Card style={styles.infoCards}>
                      <Text style={[styles.dataText]}>{cases}</Text>
                      <Text style={styles.text}>
                        {languages.t('label.positive_label')}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Card style={styles.infoCards}>
                      <Text
                        style={[
                          styles.dataText,
                          { color: Colors.BUTTON_LIGHT_TEX },
                        ]}>
                        {deaths}
                      </Text>
                      <Text style={styles.text}>
                        {languages.t('label.deceased_label')}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Card style={styles.infoCards}>
                      <Text style={[styles.dataText, { color: Colors.GREEN }]}>
                        {recovered}
                      </Text>
                      <Text style={styles.text}>
                        {languages.t('label.recovered_label')}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Card style={styles.infoCards}>
                      <Text style={[styles.dataText, { color: Colors.SUN }]}>
                        {todayCases}
                      </Text>
                      <Text style={styles.text}>
                        {languages.t('label.case_day_label')}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                </View>
                <Aurora navigation={this.props.navigation} />
                <View style={styles.footer}>
                  <View style={{ margin: wp('5%') }}>
                    <Text
                      style={[
                        styles.text,
                        { color: '#2f3133', textAlign: 'center' },
                      ]}>
                      {languages.t('label.home_screen_bottom_text')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {this.getSettings()}
          </ScrollView>
        </View>
      </View>
    );
  }
}
