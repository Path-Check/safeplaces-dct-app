import 'moment/locale/es';

import moment from 'moment';
import { Button, Card, Container, Content, Text } from 'native-base';
import React, { useContext, useState } from 'react';
import { ScrollView, TouchableHighlight, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Dialog } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/FontAwesome';

import CalendarButton from '../../../components/DR/CalendarButton/index';
import Header from '../../../components/DR/Header';
import styles from '../../../components/DR/Header/style';
import Input from '../../../components/DR/Input/index';
import PhoneInput from '../../../components/DR/PhoneInput/index';
import context from '../../../components/DR/Reduces/context.js';
import Colors from '../../../constants/colors';

export default function UserInfo({ navigation }) {
  navigation.setOptions({
    headerShown: false,
  });
  const [showDialog, setShowDialog] = useState(false);
  const [usePassport, setUsePassport] = useState(false);
  const [useIdCard, setUseIdCard] = useState(false);
  const [useNss, setUseNss] = useState(false);
  const [error, setError] = useState(false);
  const [
    {
      answers: {
        birth,
        cid = '',
        passportId = '',
        passportName = '',
        nssId = '',
        phoneNumber,
      },
    },
    setGlobalState,
  ] = useContext(context);

  const closeDialog = final => {
    setError(false);
    setShowDialog(false);
    setUseIdCard(false);
    setUseNss(false);
    setUsePassport(false);
    final && setGlobalState({ type: 'CLEAN_ANSWERS' });
  };

  const validate = async data => {
    try {
      const response = await fetch(
        'https://webapps.mepyd.gob.do/contact_tracing/api/Person',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.body),
        },
      );
      return response.json();
    } catch (e) {
      console.log('ha ocurrido un error', e);
    }
  };

  const sendDataToApi = async () => {
    let data = { body: {} };
    if (useIdCard) {
      data.body = {
        cid: cid,
        birth: moment(birth).format('YYYY-MM-DD'),
        phoneNumber: phoneNumber,
      };
    } else if (usePassport) {
      data.body = {
        passportId: passportId,
        passportName: passportName,
        birth: moment(birth).format('YYYY-MM-DD'),
        phoneNumber: phoneNumber,
      };
    } else {
      data.body = {
        nssid: nssId,
        birth: moment(birth).format('YYYY-MM-DD'),
        phoneNumber: phoneNumber,
      };
    }
    const { valid } = await validate(data);
    return valid;
  };

  const setSelectedOption = (option, selected) => {
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: { [option]: selected },
    });
  };
  const disabled =
    (cid.length > 10 || passportId || nssId) &&
    (phoneNumber.length > 13 || passportName) &&
    birth
      ? false
      : true;
  let isLoading = false;
  return (
    <Container>
      <Content>
        <ScrollView>
          <View style={{ flex: 1 }}>
            <Dialog
              onTouchOutside={() => closeDialog(true)}
              visible={showDialog}
              dialogStyle={{ backgroundColor: '#fff' }}>
              <View>
                <Button
                  transparent
                  onPress={() => closeDialog()}
                  style={{ marginTop: -10 }}>
                  <Icon name='times' size={25} color={Colors.GREEN} />
                </Button>
                {error && (
                  <Text style={[styles.text, { color: Colors.RED_TEXT }]}>
                    Datos incorrectos, por favor revise.
                  </Text>
                )}
                <Text style={styles.textSemiBold}>
                  Ingrese su No. de{' '}
                  {useNss
                    ? 'Seguro Social'
                    : useIdCard
                    ? 'cédula'
                    : 'pasaporte'}
                  :
                </Text>
                {useIdCard || useNss ? (
                  <Input
                    value={useIdCard ? cid : useNss && nssId}
                    onChange={text =>
                      setSelectedOption(
                        useIdCard ? 'cid' : useNss && 'nssId',
                        `${text}`.replace(/\D/g, ''),
                      )
                    }
                    style={{ marginBottom: 12 }}
                    keyboardType={'numeric'}
                    maxLength={useNss ? 9 : 11}
                  />
                ) : (
                  <Input
                    value={passportId}
                    onChange={text => setSelectedOption('passportId', text)}
                    style={{ marginBottom: 12 }}
                    keyboardType={'default'}
                    maxLength={10}
                  />
                )}

                {usePassport ? (
                  <View>
                    <Text style={styles.textSemiBold}>Nombre y apellido:</Text>
                    <Input
                      value={passportName}
                      onChange={text => setSelectedOption('passportName', text)}
                      style={{ marginBottom: 12 }}
                      keyboardType={'default'}
                      maxLength={35}
                    />
                  </View>
                ) : (
                  <View>
                    <Text style={styles.textSemiBold}>Número de teléfono:</Text>
                    <PhoneInput
                      value={phoneNumber}
                      handleOnChange={text =>
                        setSelectedOption('phoneNumber', text)
                      }
                      style={{ marginBottom: 12 }}
                    />
                  </View>
                )}
                <Text style={[styles.textSemiBold, { marginBottom: 10 }]}>
                  Fecha de Nacimiento:
                </Text>
                <CalendarButton
                  onChange={date => {
                    setSelectedOption(
                      'birth',
                      moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    );
                  }}
                  date={moment(birth).format('DD-MM-YYYY')}
                  minDate='01-01-1900'
                />
                <Button
                  disabled={disabled && !isLoading}
                  style={[
                    styles.buttons,
                    {
                      backgroundColor: disabled ? '#b7dbb2' : Colors.GREEN,
                      marginTop: 18,
                    },
                  ]}
                  onPress={async () => {
                    //Send data to API
                    isLoading = true;
                    if (await sendDataToApi()) {
                      isLoading = false;
                      navigation.navigate('Report');
                      closeDialog(false);
                    } else {
                      isLoading = false;
                      setError(true);
                    }
                  }}>
                  <Text style={styles.buttonText}>Continuar</Text>
                </Button>
              </View>
            </Dialog>

            <Header
              title='Ingrese sus datos'
              text='Utilizaremos estos datos para darle el apropiado seguimiento a sus resultados:'
              navigation={navigation}
              close={true}
              style={{ height: wp('38%') }}
            />
            <View
              style={{
                height: hp('60%'),
                alignItems: 'center',
                marginTop: 20,
              }}>
              <TouchableHighlight
                onPress={() => {
                  setShowDialog(true);
                  setUseIdCard(true);
                }}
                underlayColor='#FFF'>
                <Card style={[styles.bigCards, styles.userDataCard]}>
                  <Text
                    style={[
                      styles.textSemiBold,
                      { marginVertical: 10, marginHorizontal: 12 },
                    ]}>
                    Iniciar con cédula
                  </Text>
                  <Icon
                    name='id-card'
                    size={wp('8.5%')}
                    color={Colors.mainBlue}
                  />
                </Card>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  setShowDialog(true);
                  setUsePassport(true);
                }}
                underlayColor='#FFF'>
                <Card style={[styles.bigCards, styles.userDataCard]}>
                  <Text
                    style={[
                      styles.textSemiBold,
                      { marginVertical: 10, marginHorizontal: 12 },
                    ]}>
                    Iniciar con pasaporte
                  </Text>
                  <Icon
                    name='passport'
                    size={wp('9%')}
                    color={Colors.mainBlue}
                  />
                </Card>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  setShowDialog(true);
                  setUseNss(true);
                }}
                underlayColor='#FFF'>
                <Card
                  style={[
                    styles.bigCards,
                    styles.userDataCard,
                    { alignItems: 'center' },
                  ]}>
                  <Text
                    style={[
                      styles.textSemiBold,
                      { marginVertical: 10, marginHorizontal: 12 },
                    ]}>
                    Iniciar con Número de Seguridad Social (NSS) de República
                    Dominicana
                  </Text>
                  <Icon
                    name='id-card-alt'
                    size={wp('8.5%')}
                    color={Colors.mainBlue}
                  />
                </Card>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </Content>
    </Container>
  );
}
