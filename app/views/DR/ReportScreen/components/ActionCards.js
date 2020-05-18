import React, { useContext } from 'react';
import { Image, View, Linking } from 'react-native';
import {
  Badge, Card, CardItem, Text, Left, Button, Right,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import context from './reduces/context';
import styles from './styles';
import Colors from '../constants/Colors';

const { orange, green, mainBlue } = Colors;

export function Feels({ navigation }) {
  return (
    <View>
      <Card style={styles.bigCards}>
        <View
          style={{
            alignItems: 'center',
            height: wp('10%'),
            flexDirection: 'row',
          }}
        >
          <Icon name="heartbeat" color={orange} size={wp('7%')} />
          <Text style={[styles.textHeader, { marginLeft: 8 }]}>
            ¿Cómo te sientes?
          </Text>
        </View>
        <View style={styles.tester}>
          <Left>
            <Text style={styles.text}>
              Analizaremos tus síntomas para validar o descartar el COVID-19
            </Text>
          </Left>
          <Button
            onPress={() => navigation.navigate('Reportar')}
            style={[styles.buttons, { backgroundColor: green }]}
          >
            <Text style={styles.buttonText}>Evaluar</Text>
          </Button>
        </View>
      </Card>
    </View>
  );
}

export function LastBulletin() {
  const [globaState] = useContext(context);
  const { bulletins } = globaState;
  const lastBulletin = bulletins[0] || {};
  const { url } = lastBulletin;

  return (
    <View>
      <Card style={styles.bigCards}>
        <View
          style={{
            alignItems: 'center',
            height: wp('10%'),
            flexDirection: 'row',
          }}
        >
          <Icon name="clock-o" color={orange} size={wp('7%')} />
          <Text style={[styles.textHeader, { marginLeft: 8 }]}>
            ¿Quieres ver el último boletín?
          </Text>
        </View>
        <View style={styles.tester}>
          <Left>
            <Text style={styles.text}>
              Descarga el boletín oficial más reciente de COVID-19
            </Text>
          </Left>
          <Button
            onPress={() => (url ? Linking.openURL(url) : null)}
            style={[styles.buttons, { backgroundColor: green, marginLeft: 10 }]}
          >
            <Text style={styles.buttonText}>Ver</Text>
          </Button>
        </View>
      </Card>
    </View>
  );
}

export function Contact({ isProfile }) {
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
            backgroundColor: mainBlue,
            height: hp('15%'),
            justifyContent: 'center',
          },
        ]}
      >
        <View style={{ flexDirection: 'row' }}>
          <Left style={{ flexDirection: 'row' }}>
            <Image
              style={styles.image}
              // eslint-disable-next-line global-require
              source={require('../assets/images/logo_msp.png')}
            />
            <Left style={{ marginLeft: 15 }}>
              <Text style={[styles.text, { color: '#fff' }]}>
                Linea informativa
              </Text>
              <Text style={[styles.textHeader, { color: '#fff' }]}>*464</Text>
            </Left>
            <Button style={[buttonStyle, { backgroundColor: '#fff' }]}>
              <Text style={[buttonValueStyle, { color: '#0161F2' }]}>
                Chatear
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
            <Icon name="bell-o" color={mainBlue} size={30} />
            <Text style={styles.textHeader}>Alertas</Text>
          </Left>

          <Right style={{ backgroundColor: '#fff' }}>
            <Badge style={{ backgroundColor: mainBlue }}>
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
