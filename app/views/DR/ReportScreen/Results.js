import { Button, Container, Content, Text } from 'native-base';
import React, { useContext } from 'react';
import { Image, ScrollView, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Header from '../../../components/DR/Header';
import styles from '../../../components/DR/Header/style';
import context from '../../../components/DR/Reduces/context';
import ResultsContent from '../../../components/DR/ResultsContent';
import Colors from '../../../constants/colors';

export default function Results({ navigation }) {
  navigation.setOptions({
    headerShown: false,
  });
  const [
    {
      answers: {
        HIV,
        asthma,
        age,
        bodyPain,
        cancer,
        chestPain,
        convultions,
        cough,
        diabetes,
        difficultyBreathing,
        disorientation,
        dontKnowExposition,
        doesntWorkInHealth,
        fever,
        hadCloseContact,
        hadFarContact,
        hardCough,
        headache,
        heartCondition,
        hepaticCirrhosis,
        hypertension,
        inmuneDeficiency,
        liveWith,
        malnutrition,
        noSympthoms,
        none,
        notExposed,
        obesity,
        planWorkInHealth,
        pregnancy,
        renalInsufficiency,
        runnyNose,
        runnyNoseWithBlood,
        sickleCellAnemia,
        sleepiness,
        soreThroat,
        threwUp,
        traveled,
        tuberculosis,
        workInHealth,
        workedInHealth,
      },
    },
    setGlobalState,
  ] = useContext(context);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setGlobalState({ type: 'CLEAN_ANSWERS' });
    });
    return unsubscribe;
  }, [navigation]);
  const hasSympthomps =
    fever ||
    difficultyBreathing ||
    cough ||
    soreThroat ||
    bodyPain ||
    threwUp ||
    runnyNose ||
    runnyNoseWithBlood ||
    headache ||
    chestPain ||
    convultions ||
    disorientation ||
    sleepiness
      ? true
      : false;
  const hadContact =
    hadCloseContact || hadFarContact || liveWith ? true : false;
  const hasHealthProblems =
    asthma ||
    cancer ||
    HIV ||
    heartCondition ||
    diabetes ||
    renalInsufficiency ||
    hepaticCirrhosis ||
    hardCough ||
    obesity ||
    pregnancy ||
    hypertension ||
    inmuneDeficiency ||
    malnutrition ||
    sickleCellAnemia ||
    tuberculosis
      ? true
      : false;
  const liveInFacility =
    workInHealth || workedInHealth || planWorkInHealth ? true : false;

  const notExpostion = notExposed || dontKnowExposition ? true : false;

  return (
    <Container>
      <Content>
        <ScrollView>
          <View style={{ flex: 1 }}>
            <Header
              title='Resultados'
              text='En base a las respuestas, estos son los resultados:'
              navigation={navigation}
              style={{ height: hp('18%') }}
            />
            <View style={styles.formContainer}>
              {noSympthoms &&
                none &&
                !traveled &&
                notExpostion &&
                doesntWorkInHealth && (
                  <ResultsContent
                    title='Deberías practicar distancia social'
                    subtitle='En este momento, usted no presenta síntomas de COVID-19, por lo que le recomendamos que continúes con las medidas preventivas de “lavado de manos con agua y jabón de manera frecuente y aplicar el distanciamiento social”'
                    image={require('../../../assets/images/socialDistancing.jpg')}
                    nextSteps={[
                      {
                        title: 'Mantener el distanciamiento social',
                        content:
                          'Manténgase al menos a un (1) metro de distancia de cualquier persona, evite estar en grupos y sólo use el transporte público si es necesario.',
                      },
                    ]}
                    recomendations={[
                      {
                        title: 'No se necesita prueba en este momento',
                        content:
                          'A partir de ahora, sus respuestas sugieren que no necesita hacerse la prueba. Si llega a presentar algún síntoma como fiebre, tos, secreción nasal, ligera dificultad para respirar, dolor de garganta, cabeza o del cuerpo, vuelva a completar este cuestionario o contáctese con la plataforma Aurora a través de los teléfonos 809-449-6262, 809 409 6262 y 809-352-6262.\nSi presenta algún síntoma de peligro (vómito o diarrea persistente o con sangre, dificultad marcada para respirar, somnolencia o convulsiones) acuda de forma inmediata al centro de salud más cercano o llame al *462.',
                      },
                      {
                        title:
                          '“Con tu ayuda, quedandote en casa y siguiendo las recomendaciones de salud, ponemos enfrentar al COVID-19”',
                        content: '',
                      },
                    ]}
                  />
                )}
              {noSympthoms &&
                none &&
                traveled &&
                (notExpostion || hadContact) &&
                (doesntWorkInHealth || liveInFacility) && (
                  <ResultsContent
                    title='Deberías practicar distancia social'
                    subtitle='Ayuda a detener la propagación. Cuando esté fuera de la casa, manténgase al menos a seis pies de distancia de otras personas, evite grupos y solo use el transporte público si es necesario.'
                    image={require('../../../assets/images/socialDistancing.jpg')}
                    nextSteps={[
                      {
                        title:
                          'Recuerda siempre “lavado de manos con agua y jabón de manera frecuente y aplicar el distanciamiento social”',
                        content: '',
                      },
                      {
                        title: 'Mantener el distanciamiento social',
                        content:
                          'Manténgase al menos a un (1) metro de distancia de cualquier persona, evite estar en grupos y sólo use el transporte público si es necesario.',
                      },
                      {
                        title: 'Monitorear síntomas',
                        content:
                          'Esté atento a los síntomas de COVID-19, como tos, fiebre y dificultad para respirar. Además, revise y mida su temperatura dos veces al día durante dos semanas.\nSi presenta algún síntoma de peligro (vómito o diarrea persistente o con sangre, dificultad marcada para respirar, somnolencia o convulsiones) acuda de forma inmediata al centro de salud más cercano o llame al *462.',
                      },
                    ]}
                    recomendations={[
                      {
                        title: 'No se necesita prueba en este momento',
                        content:
                          'A partir de ahora, sus respuestas sugieren que no necesita hacerse la prueba. Si llega a presentar algún síntoma como fiebre, tos, secreción nasal, ligera dificultad para respirar, dolor de garganta, cabeza o del cuerpo, vuelva a completar este cuestionario  o contáctese con la plataforma Aurora a través de los teléfonos 809-449-6262, 809 409 6262 y 809-352-6262.',
                      },
                      {
                        title:
                          '“Con tu ayuda, quedandote en casa y siguiendo las recomendaciones de salud, ponemos enfrentar al COVID-19”',
                        content: '',
                      },
                    ]}
                  />
                )}
              {noSympthoms &&
                hasHealthProblems &&
                (!traveled || traveled) &&
                notExpostion &&
                (doesntWorkInHealth || liveInFacility) && (
                  <ResultsContent
                    title='Deberías practicar distancia social'
                    subtitle='En este momento, usted no presenta síntomas de COVID-19, por lo que recomendamos que continúe con las medidas preventivas de “lavado de manos con agua y jabón de manera frecuente y aplicar el distanciamiento social”'
                    image={require('../../../assets/images/socialDistancing.jpg')}
                    nextSteps={[
                      {
                        title: 'Mantener el distanciamiento social',
                        content:
                          'Manténgase al menos a un (1) metro de distancia de cualquier persona, evite estar en grupos y sólo use el transporte público si es necesario.',
                      },
                      {
                        title: 'Preguntar sobre su medicación',
                        content:
                          'Si actualmente está tomando medicamentos recetados, debe comunicarse con su médico para obtener un suministro para 30 días.',
                      },
                    ]}
                    recomendations={[
                      {
                        title: 'No se necesita prueba en este momento',
                        content:
                          'A partir de ahora, sus respuestas sugieren que no necesita hacerse la prueba. Si llega a presentar algún síntoma como fiebre, tos, secreción nasal, ligera dificultad para respirar, dolor de garganta, cabeza o del cuerpo, vuelva a completar este cuestionario o contáctese con la plataforma Aurora a través de los teléfonos 809-449-6262, 809 409 6262 y 809-352-6262.\nSi presenta algún síntoma de peligro (vómito o diarrea persistente o con sangre, dificultad marcada para respirar, somnolencia o convulsiones) acuda de forma inmediata al centro de salud más cercano o llame al *462.',
                      },
                      {
                        title:
                          '“Con tu ayuda, quedandote en casa y siguiendo las recomendaciones de salud, ponemos enfrentar al COVID-19”',
                        content: '',
                      },
                    ]}
                  />
                )}
              {noSympthoms &&
                !traveled &&
                hadContact &&
                (doesntWorkInHealth || liveInFacility) && (
                  <ResultsContent
                    title='Deberías practicar distancia social'
                    subtitle='Ayuda a detener la propagación. Cuando esté fuera de la casa, manténgase al menos a seis pies de distancia de otras personas, evite grupos y solo use el transporte público si es necesario.'
                    image={require('../../../assets/images/socialDistancing.jpg')}
                    nextSteps={[
                      {
                        title: 'Cuarentena en casa',
                        content:
                          'Es posible que haya estado expuesto. Debe quedarse en casa durante los próximos 14 días y ver si aparece algún síntoma.También debe intentar limitar su contacto con otras personas fuera del hogar.',
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
                          'A partir de ahora, sus respuestas sugieren que no necesita hacerse la prueba. Si llega a presentar algún síntoma como fiebre, tos, secreción nasal, ligera dificultad para respirar, dolor de garganta, cabeza o del cuerpo, vuelva a completar este cuestionario  o contáctese con la plataforma Aurora a través de los teléfonos 809-449-6262, 809 409 6262 y 809-352-6262.',
                      },
                      {
                        title:
                          '“Con tu ayuda, quedandote en casa y siguiendo las recomendaciones de salud, ponemos enfrentar al COVID-19”',
                        content: '',
                      },
                    ]}
                  />
                )}
              {hasSympthomps &&
                none &&
                (hadContact || notExpostion) &&
                doesntWorkInHealth && (
                  <ResultsContent
                    title='Debe hacer aislamiento domiciliario'
                    subtitle='Según sus respuestas, debe quedarse en casa y lejos de los demás. Si puedes, ten una habitación y un baño que sean solo para ti. Esto puede ser difícil cuando no te sientes bien, pero protegerá a los que te rodean.'
                    image={require('../../../assets/images/selfIsolation.jpg')}
                    nextSteps={[
                      {
                        title: 'Aislarse',
                        content:
                          'Debe mantenerse alejado de los demás por 14 días a partir de la aparición de sus síntomas. Su aislamiento puede terminar si sus síntomas mejoran significativamente y si no ha tenido fiebre durante al menos 72 horas sin el uso de medicamentos. Al aislarse, puede reducir la propagación de COVID-19 y proteger a los demás.',
                      },
                      {
                        title: 'Descansar y cuidarse',
                        content:
                          'Coma bien, tome líquidos y descanse lo suficiente.',
                      },
                      {
                        title: 'Monitorear síntomas',
                        content:
                          'Esté atento a los síntomas de COVID-19, como tos, fiebre y dificultad para respirar. Además, revise y mida su temperatura dos veces al día durante dos semanas. Si presenta algún síntoma de peligro (vómito o diarrea persistente o con sangre, dificultad marcada para respirar, somnolencia o convulsiones) acuda de forma inmediata al centro de salud más cercano o llame al *462',
                      },
                    ]}
                    recomendations={[
                      {
                        title:
                          'Comuníquese con alguien para realizar la prueba',
                        content:
                          'Sus respuestas sugieren que es posible que deba hacerse la prueba de COVID‑19. Debe comunicarse con su médico, o contactarse con la plataforma Aurora a través de los teléfonos 809-449-6262, 809 409 6262 y 809-352-6262 o llamar al *462 para obtener más información. El acceso de prueba puede variar según la ubicación y el proveedor. Verifique los laboratorios autorizados por el Ministerio de Salud Pública disponibles en su provincia de residencia.',
                      },
                      {
                        title:
                          '“Con tu ayuda, quedandote en casa y siguiendo las recomendaciones de salud, ponemos enfrentar al COVID-19”',
                        content: '',
                      },
                    ]}
                  />
                )}
              {hasSympthomps &&
                hasHealthProblems &&
                (hadContact || notExpostion) &&
                doesntWorkInHealth && (
                  <ResultsContent
                    title='Contacte a su médico'
                    subtitle='Sus respuestas sugieren que debe hablar con un profesional médico acerca de hacerse la prueba de COVID‑19.'
                    image={require('../../../assets/images/contactDoctor.jpg')}
                    nextSteps={[
                      {
                        title: 'Aislarse',
                        content:
                          'Debe mantenerse alejado de los demás por 14 días a partir de la aparición de sus síntomas. Su aislamiento puede terminar si sus síntomas mejoran significativamente y si no ha tenido fiebre durante al menos 72 horas sin el uso de medicamentos. Al aislarse, puede reducir la propagación de COVID-19 y proteger a los demás.',
                      },
                      {
                        title: 'Descansar y cuidarse',
                        content:
                          'Coma bien, tome líquidos y descanse lo suficiente.',
                      },
                      {
                        title:
                          'Comuniquese con alguien para realizar la prueba',
                        content:
                          'Sus respuestas sugieren que es posible que deba hacerse la prueba de COVID‑19. Debe comunicarse con su médico, o contactarse con la plataforma Aurora a través de los teléfonos 809-449-6262, 809 409 6262 y 809-352-6262 o llamar al *462 para obtener más información. El acceso de prueba puede variar según la ubicación y el proveedor. Verifique los laboratorios autorizados por el Ministerio de Salud Pública disponibles en su provincia de residencia.',
                      },
                      {
                        title: 'Monitorear síntomas',
                        content:
                          'Esté atento a los síntomas de COVID-19, como tos, fiebre y dificultad para respirar. Además, revise y mida su temperatura dos veces al día durante dos semanas. Si presenta algún síntoma de peligro (vómito o diarrea persistente o con sangre, dificultad marcada para respirar, somnolencia o convulsiones) acuda de forma inmediata al centro de salud más cercano o llame al *462.',
                      },
                    ]}
                  />
                )}
              {hasSympthomps &&
                (hadContact || traveled || hasHealthProblems) &&
                liveInFacility && (
                  <ResultsContent
                    title='Contacte a su médico'
                    subtitle='Sus respuestas sugieren que debe hablar con un profesional médico acerca de hacerse la prueba de COVID‑19.'
                    image={require('../../../assets/images/callSupervisor.jpg')}
                    nextSteps={[
                      {
                        title: 'Aislarse',
                        content:
                          'Debe mantenerse alejado de los demás por 14 días a partir de la aparición de sus síntomas. Su aislamiento puede terminar si sus síntomas mejoran significativamente y si no ha tenido fiebre durante al menos 72 horas sin el uso de medicamentos. Al aislarse, puede reducir la propagación de COVID-19 y proteger a los demás.',
                      },
                      {
                        title: 'Toma precauciones',
                        content:
                          'Como trabajador esencial, debe hablar con su trabajo acerca de tomar los pasos apropiados para ayudar a protegerse y proteger a quienes lo rodean. Debe usar equipo de protección personal adecuado, incluidas máscaras faciales o cubiertas faciales de tela en caso de escasez. Además, debe mantener una distancia física de seis pies tanto como sea posible en el trabajo y siempre fuera del trabajo. También debe limpiarse las manos con frecuencia y evitar tocarse la cara.',
                      },
                      {
                        title: 'Descansar y cuidarse',
                        content:
                          'Coma bien, tome líquidos y descanse lo suficiente.',
                      },
                      {
                        title:
                          'Comuníquese con alguien para realizar la prueba',
                        content:
                          'sus respuestas sugieren que es posible que deba hacerse la prueba de COVID‑19. Debe comunicarse con su médico, o contactarse con la plataforma Aurora a través de los teléfonos 809-449-6262, 809 409 6262 y 809-352-6262 o llamar al *462 para obtener más información. El acceso de prueba puede variar según la ubicación y el proveedor. Verifique los laboratorios autorizados por el Ministerio de Salud Pública disponibles en su provincia de residencia.',
                      },
                      {
                        title: 'Monitorear síntomas',
                        content:
                          'Esté atento a los síntomas de COVID-19, como tos, fiebre y dificultad para respirar. Además, revise y mida su temperatura dos veces al día durante dos semanas. Si presenta algún síntoma de peligro (vómito o diarrea persistente o con sangre, dificultad marcada para respirar, somnolencia o convulsiones) acuda de forma inmediata al centro de salud más cercano o llame al *462.',
                      },
                      {
                        title:
                          '“Con tu ayuda, quedandote en casa y siguiendo las recomendaciones de salud, ponemos enfrentar al COVID-19”',
                        content: '',
                      },
                    ]}
                  />
                )}
              <Image
                resizeMode='contain'
                style={{
                  height: 70,
                  width: 80,
                  alignSelf: 'center',
                  marginTop: 10,
                }}
                source={require('../../../assets/images/logo_msp.png')}
              />
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
                <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
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
