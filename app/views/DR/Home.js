import React, { Component } from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Card, Text, Left } from 'native-base';
import {
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import 'moment/locale/es';
import moment from 'moment';
//import { Notifications } from 'expo';
import { Feels, LastBulletin, Aurora } from '../../DR/components/ActionCards'; // <LastBulletin navigation={navigation} />
//import { getAllCases } from '../../DR/utils/requestManage';
import styles from '../../DR/components/styles';
import Colors from '../../DR/constants/Colors';
import { SvgXml } from 'react-native-svg';
import settingsIcon from './../../assets/svgs/settingsIcon';

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
      // const {
      //   cases,
      //   deaths,
      //   recovered,
      //   todayCases,
      // } = await await getAllCases();

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
    // this._notificationSubscription = Notifications.addListener(
    //   this._handleNotification
    // );
  }

  getSettings() {
    return (
      <TouchableOpacity
        style={stylesSavePath.settingsContainer}
        onPress={() => {
          this.props.navigation.navigate('SettingsScreen');
        }}>
        {/* Is there is a reason there's this imageless image tag here? Can we delete it? */}
        <Image resizeMode={'contain'} />
        <SvgXml xml={settingsIcon} width={30} height={30} color='white' />
      </TouchableOpacity>
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
      <View style={stylesSavePath.settingsContainer}>
          
        <View
          tyle={styles.scrollContainer}
        >
          <View style={styles.mainHeader} />
          <View style={{ margin: wp('2%') }} >
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
            </View>
          </View>
        </View>
        {this.getSettings()}
      </View>
    );
  }
}

const stylesSavePath = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
    justifyContent: 'flex-end',
  },
  mainContainer: {
    position: 'absolute',
    flex: 1,
    // resizeMode: 'contain',
    // aligns the center of the main container with center of pulse
    // so that two `flex: 1` views will be have a reasonable chance at natural
    // flex flow for above and below the pulse.
    top: '-10%',
    left: 0.5,
    right: 0,
    height: '100%',
    paddingHorizontal: '12%',
    paddingBottom: 12,
  },
  settingsContainer: {
    position: 'absolute',
    top: 0,
    marginTop: '14%',
    marginRight: '7%',
    alignSelf: 'flex-end',
  },
});