import { Button, Container, Content, Text } from 'native-base';
import React, { useContext } from 'react';
import { View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Header from '../../../components/DR/Header';
import context from '../../../components/DR/Reduces/context.js';
import Colors from '../../../constants/colors';
import styles from './style';

export default function ReportScreen({ navigation }) {
  const [, setGlobalState] = useContext(context);

  const setSelectedOption = selected => {
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: { usage: selected },
    });
  };
  return (
    <Container>
      <Content>
        <View style={{ flex: 1 }}>
          <Header
            title='Reporte'
            text='Las siguientes preguntas están relacionadas al COVID-19'
            navigation={navigation}
            close
            style={{ height: hp('18%') }}
          />
          <View style={styles.formContainer}>
            <Text style={[styles.text, { marginVertical: 30, fontSize: 17 }]}>
              Responderás algunas preguntas sobre tus síntomas, viajes y el
              contacto que has tenido con otros.
            </Text>
            <Button
              style={[
                styles.buttons,
                {
                  width: wp('70%'),
                  height: 38,
                  backgroundColor: Colors.BLUE_RIBBON,
                  marginBottom: 10,
                },
              ]}
              onPress={() => {
                setSelectedOption('mySelf');
                navigation.navigate('UserInfo');
              }}>
              <Text
                style={[
                  styles.text,
                  { color: '#fff', textTransform: 'capitalize' },
                ]}>
                Usar para mí
              </Text>
            </Button>
            <Button
              onPress={() => {
                setSelectedOption('others');
                navigation.navigate('UserInfo');
              }}
              style={[
                styles.buttons,
                {
                  width: wp('70%'),
                  height: 38,
                  backgroundColor: Colors.LIGHT_BLUE,
                },
              ]}>
              <Text
                style={[
                  styles.text,
                  { color: Colors.BLUE_RIBBON, textTransform: 'capitalize' },
                ]}>
                Usar para alguien más
              </Text>
            </Button>
          </View>
        </View>
      </Content>
    </Container>
  );
}
