import { Button, Container, Content, Text } from 'native-base';
import React from 'react';
import { ScrollView, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Header from '../../../components/DR/Header';
import styles from '../../../components/DR/Header/style';
import ResultsContent from '../../../components/DR/ResultsContent';
import Colors from '../../../constants/colors';
import languages from '../../../locales/languages';

export default function ExposedResponse({ navigation }) {
  return (
    <Container>
      <Content>
        <ScrollView>
          <View style={{ flex: 1 }}>
            <Header
              title={languages.t('label.exposure_next_steps')}
              text='No ha tenido síntomas de COVID-19, pero contacto expuesto a alguien con COVID-19.'
              navigation={navigation}
              style={{ height: hp('18%') }}
            />
            <View style={styles.formContainer}>
              {
                <ResultsContent
                  title='Deberías practicar distancia social'
                  subtitle='En este momento, usted no presenta síntomas de COVID-19, pero ha estado expuesto a un caso, por lo que le recomendamos que continúe con las medidas preventivas de “lavado de manos con agua y jabón de manera frecuente, aplicar el distanciamiento social” y aplicar las orientaciones básicas para el hogar y la comunidad: '
                  subLinkText='http://digepisalud.gob.do/documentos'
                  subLink='http://digepisalud.gob.do/documentos/?drawer=Vigilancia%20Epidemiologica*Alertas%20epidemiologicas*Coronavirus*Nacional*Materiales%20IEC%20COVID-19'
                  image={require('../../../assets/images/socialDistancing.jpg')}
                  navigation={navigation}
                  nextSteps={[
                    {
                      title: 'Cuarentena en casa',
                      content:
                        'Es posible que haya estado expuesto. Debe quedarse en casa durante los próximos 14 días y ver si aparece algún síntoma. Manténgase al menos a un (1) metro de distancia de cualquier persona y evite estar en grupos.',
                    },
                    {
                      title: 'Monitorear síntomas',
                      content:
                        'Esté atento a los síntomas de COVID-19, como tos, fiebre y dificultad para respirar. Además, revise y mida su temperatura dos veces al día durante dos semanas. Si presenta algún síntoma de peligro (vómito o diarrea persistente o con sangre, dificultad marcada para respirar, somnolencia o convulsiones) acuda de forma inmediata al centro de salud más cercano o llame al *462.',
                    },
                  ]}
                  recomendations={[
                    {
                      title: 'No se necesita prueba en este momento',
                      content:
                        'A partir de ahora, sus respuestas sugieren que no necesita hacerse la prueba. Si llega a presentar algún síntoma como fiebre, tos, secreción nasal, ligera dificultad para respirar, dolor de garganta, cabeza o del cuerpo, vuelva a completar este cuestionario  o contáctese con la plataforma Aurora a través de los teléfonos 809-449-6262, 809 409 6262 y 809-352-6262.',
                    },
                    {
                      title:
                        '“Con tu ayuda, quedandote en casa y siguiendo las recomendaciones de salud, ponemos enfrentar al COVID-19”',
                      content: '',
                    },
                  ]}
                />
              }
              <Button
                style={[
                  styles.buttons,
                  {
                    width: wp('70%'),
                    height: 38,
                    backgroundColor: Colors.GREEN,
                    marginTop: 15,
                  },
                ]}
                onPress={() => {
                  navigation.navigate('HomeScreen');
                }}>
                <Text style={[styles.buttonText, { color: '#fff' }]}>
                  Cerrar
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </Content>
    </Container>
  );
}
