import { Badge, Button, Card, CardItem, Left, Right, Text } from 'native-base';
import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../../constants/colors';
import { GetStoreData } from '../../../helpers/General';
import languages from '../../../locales/languages';
import styles from './styles';

const { ORANGE, GREEN, BLUE_RIBBON } = Colors;

export class Feels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      positive: false,
    };
  }

  isPositiveCovid = async () => {
    const positive = await GetStoreData('positive', false);
    if (positive) this.props.handler();
    return positive;
  };

  async componentDidMount() {
    this.setState({ positive: await this.isPositiveCovid() });
  }

  render() {
    const {
      props: { navigation },
      state: { positive },
    } = this;
    return (
      <View>
        <Card style={styles.bigCards}>
          <View style={styles.auroraContainer}>
            <Icon name='heartbeat' color={ORANGE} size={wp('7%')} />
            <Text style={[styles.textHeader, { marginLeft: 8 }]}>
              {languages.t('label.report_symptoms_title')}
            </Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={[styles.text, { width: '90%' }]}>
              {positive
                ? languages.t('label.positive_symptoms_description')
                : languages.t('label.report_symptoms_description')}
            </Text>
            <View style={{ justifyContent: 'center' }}>
              <Button
                onPress={() =>
                  navigation.navigate(
                    positive ? 'EpidemiologicResponse' : 'ReportScreen',
                  )
                }
                style={[
                  styles.buttons,
                  {
                    backgroundColor: GREEN,
                    width: wp('70%'),
                    marginTop: 15,
                  },
                ]}>
                <Text style={styles.buttonText}>
                  {positive
                    ? languages.t('label.positive_symptoms_label')
                    : languages.t('label.report_symptoms_label')}
                </Text>
              </Button>
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

export function Aurora({ navigation }) {
  const { t } = useTranslation();
  return (
    <View>
      <Card style={styles.bigCards}>
        <View style={styles.auroraContainer}>
          <Image
            style={styles.auroraImage}
            source={require('../../../assets/images/aurora_logo.png')}
          />
          <Text style={[styles.textHeader, { marginLeft: 8 }]}>
            {t('label.auroraMsp_title')}
          </Text>
        </View>
        <View style={styles.tester}>
          <Left>
            <Text style={styles.text}>{t('label.auroraMsp_description')}</Text>
          </Left>
          <Button
            onPress={() => navigation.navigate('AuroraScreen')}
            style={[
              styles.buttons,
              { backgroundColor: BLUE_RIBBON, marginLeft: 10 },
            ]}>
            <Text style={styles.buttonText}>{t('label.conversar_label')}</Text>
          </Button>
        </View>
      </Card>
    </View>
  );
}

export function LocationMatch({ navigation }) {
  const { t } = useTranslation();
  return (
    <View>
      <Card style={styles.bigCards}>
        <View style={styles.auroraContainer}>
          <Icon name='search-location' color={BLUE_RIBBON} size={wp('6%')} />
          <Text style={[styles.textHeader, { marginLeft: 8 }]}>
            {t('label.location_match_title')}
          </Text>
        </View>
        <View style={styles.tester}>
          <Left>
            <Text style={styles.text}>
              {t('label.location_match_description')}
            </Text>
          </Left>
          <Button
            onPress={() => navigation.navigate('Location')}
            style={[
              styles.buttons,
              { backgroundColor: BLUE_RIBBON, marginLeft: 10 },
            ]}>
            <Text style={styles.buttonText}>
              {t('label.location_match_button')}
            </Text>
          </Button>
        </View>
      </Card>
    </View>
  );
}

export function Contact({ isProfile }) {
  const { t } = useTranslation();
  const buttonStyle = isProfile
    ? {
        alignSelf: 'center',
        backgroundColor: '#0161f2',
        borderRadius: 25,
        justifyContent: 'center',
        height: hp('6%'),
        width: wp('27%'),
      }
    : styles.buttons;

  const buttonValueStyle = isProfile
    ? {
        color: 'white',
        fontSize: hp('2.1%'),
        fontWeight: '500',
        textAlign: 'center',
        letterSpacing: 0.9,
      }
    : styles.buttonText;

  return (
    <View>
      <Card
        style={[
          styles.bigCards,
          {
            backgroundColor: BLUE_RIBBON,
            height: hp('15%'),
            justifyContent: 'center',
          },
        ]}>
        <View style={styles.tester}>
          <Left style={styles.tester}>
            <Image
              style={styles.image}
              // eslint-disable-next-line global-require
              source={require('../../../assets/images/logo_msp.png')}
            />
            <Left style={{ marginLeft: 15 }}>
              <Text style={[styles.text, { color: '#fff' }]}>
                {t('label.phone_line_label')}
              </Text>
              <Text style={[styles.textHeader, { color: '#fff' }]}>*464</Text>
            </Left>
            <Button style={[buttonStyle, { backgroundColor: '#fff' }]}>
              <Text style={[buttonValueStyle, { color: '#0161F2' }]}>
                {t('label.chat_label')}
              </Text>
            </Button>
          </Left>
        </View>
      </Card>
    </View>
  );
}

export function Alerts() {
  return (
    <View>
      <Card style={styles.bigCards}>
        <CardItem header>
          <Left>
            <Icon name='bell-o' color={BLUE_RIBBON} size={30} />
            <Text style={styles.textHeader}>Alertas</Text>
          </Left>

          <Right style={{ backgroundColor: '#fff' }}>
            <Badge style={{ backgroundColor: BLUE_RIBBON }}>
              <Text>9 +</Text>
            </Badge>
          </Right>
        </CardItem>
        <CardItem bordered>
          <Text>Sustituir con al data de la API</Text>
        </CardItem>
      </Card>
    </View>
  );
}
