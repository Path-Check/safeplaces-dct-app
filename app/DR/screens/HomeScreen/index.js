import React, { Component } from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Card, Text, Left } from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import 'moment/locale/es';
import moment from 'moment';
import { Notifications } from 'expo';
import { Feels, LastBulletin, Aurora } from '../../components/ActionCards';
import { getAllCases } from '../../utils/requestManage';
import styles from '../../components/styles';
import Colors from '../../constants/Colors';

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

  getCases = async () => {
    try {
      const {
        cases,
        deaths,
        recovered,
        todayCases,
      } = await await getAllCases();

      this.setState({
        cases,
        deaths,
        recovered,
        todayCases,
        refreshing: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  refresh = () => {
    this.setState({ refreshing: true });
    this.getCases();
  };

  async componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions({ headerShown: false });
    this.getCases();
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = (notification) => {
    const { navigation } = this.props;
    const { data } = notification;

    if (data) {
      const { type } = data;
      if (type == 'bulletin') {
        navigation.navigate('App', {
          screen: 'Noticias',
          params: {
            screen: 'NewsNavigation',
            params: {
              screen: 'Boletines',
            },
          },
        });
      }
    }
  };

  render() {
    const date = moment(new Date(), 'DD/MM/YYYY').format('MMMM YYYY');
    const {
      props: { navigation },
      state: { cases, deaths, recovered, todayCases, refreshing },
    } = this;

    return (
      <View style={{ flex: 1, backgroundColor: Colors.mainBlue }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              tintColor={Colors.lightGray}
              refreshing={refreshing}
              onRefresh={this.refresh}
            />
          }
        >
          <View style={styles.mainHeader} />
          <View style={{ margin: wp('2%') }}>
            <View style={styles.HeaderView}>
              <View style={styles.rowAndCenter}>
                <Left>
                  <Text style={[styles.text, { color: '#fff' }]}>
                    {date[0].toUpperCase() + date.slice(1)}
                  </Text>
                </Left>
              </View>
              <Text style={styles.headerText}>COVID-RD</Text>
            </View>

            <View style={styles.marginAndAlign}>
              <Feels navigation={navigation} />
              <View style={styles.marginAndAlign}>
                <View style={styles.actualSituationContent}>
                  <Text style={[styles.subtitles, { alignSelf: 'center' }]}>
                    Situación actual
                  </Text>
                </View>
              </View>
              <View style={styles.actualSituationContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('map-cities')}
                >
                  <Card style={styles.infoCards}>
                    <Text style={[styles.dataText]}>{cases}</Text>
                    <Text style={styles.text}>Positivos</Text>
                  </Card>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('map-cities')}
                >
                  <Card style={styles.infoCards}>
                    <Text
                      style={[
                        styles.dataText,
                        { color: Colors.buttonLightText },
                      ]}
                    >
                      {deaths}
                    </Text>
                    <Text style={styles.text}>Fallecidos</Text>
                  </Card>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('map-cities')}
                >
                  <Card style={styles.infoCards}>
                    <Text style={[styles.dataText, { color: Colors.green }]}>
                      {recovered}
                    </Text>
                    <Text style={styles.text}>Recuperados</Text>
                  </Card>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('map-cities')}
                >
                  <Card style={styles.infoCards}>
                    <Text style={[styles.dataText, { color: Colors.orange }]}>
                      {todayCases}
                    </Text>
                    <Text style={styles.text}>Casos del día</Text>
                  </Card>
                </TouchableOpacity>
              </View>
              <Aurora navigation={navigation} />
              <LastBulletin navigation={navigation} />
              <View style={styles.footer}>
                <View style={{ margin: wp('5%') }}>
                  <Text
                    style={[
                      styles.text,
                      { color: '#2f3133', textAlign: 'center' },
                    ]}
                  >
                    Para más información marca *462 y si tienes una emergencia
                    marca 911
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
