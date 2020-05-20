import { Button, Text } from 'native-base';
import React, { useContext, useRef, useState } from 'react';
import { View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Dialog } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/Ionicons';
import Wizard from 'react-native-wizard';

import Header from '../../../components/DR/Header/index';
import styles from '../../../components/DR/Header/style';
import context from '../../../components/DR/Reduces/context';
import Colors from '../../../constants/colors';
import StepAdress from './sections/SetpAdress';
import StepAge from './sections/StepAge';
import StepCovidContact from './sections/StepCovidContact';
import StepHaveSymptoms from './sections/StepHaveSymptoms';
import StepMedicalConditions from './sections/StepMedicalConditions';
import StepSymptoms from './sections/StepSymptoms';
import StepWorkInHealth from './sections/StepWorkInHealth';
import ThankYou from './sections/thankYou';

export default function ReportScreenQuestions({ navigation }) {
  navigation.setOptions({
    headerShown: false,
  });
  const wizard = useRef(null);
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [isLastStep, setIsLastStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [data, setData] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [{ answers }, setGlobalState] = useContext(context);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setData({});
    });
    return unsubscribe;
  }, [navigation]);

  const sendDataToApi = async () => {
    try {
      const response = await fetch(
        'https://webapps.mepyd.gob.do:443/contact_tracing/api/Form',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answers),
        },
      );
      const data = await response.json();
      return data;
    } catch (e) {
      console.log('ha ocurrido un error', e);
    }
  };

  const stepList = [
    {
      content: (
        <StepHaveSymptoms setCompleted={setComplete} sendData={setData} />
      ),
    },
    {
      content: <StepAge setCompleted={setComplete} />,
    },
    {
      content: <StepSymptoms setCompleted={setComplete} />,
    },
    {
      content: <StepMedicalConditions setCompleted={setComplete} />,
    },
    {
      content: <StepCovidContact setCompleted={setComplete} />,
    },
    {
      content: <StepWorkInHealth setCompleted={setComplete} />,
    },
    {
      content: <StepAdress setCompleted={setComplete} navigation />,
    },
    {
      content: <ThankYou />,
    },
  ];
  const { MAIN_BLUE, LIGHT_GRAY, GREEN } = Colors;
  return (
    <View
      style={{
        backgroundColor: '#fff',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        height: hp('96%'),
      }}>
      <Dialog visible={dialogVisible} style={{ alignItems: 'center' }}>
        <View>
          <Icon
            name='md-medical'
            size={30}
            style={{ marginBottom: -6 }}
            color='#F54243'
          />
          <Text style={styles.subtitles}>Deberías llamar al *462.</Text>
          <Text style={styles.text}>
            Basado en los síntomas que reportaste, deberías buscar atención
            inmediatamente.
          </Text>
          <Button
            style={[
              styles.buttons,
              { backgroundColor: GREEN, width: '70%', marginTop: 25 },
            ]}
            onPress={() => {
              setDialogVisible(false);
              navigation.goBack();
              setGlobalState({ type: 'CLEAN_ANSWERS' });
            }}>
            <Text>Cerrar</Text>
          </Button>
        </View>
      </Dialog>

      <Header
        title='Reporte'
        text='Por favor responde las siguientes preguntas'
        navigation={navigation}
        close
        style={{ height: hp('19%') }}
      />

      <View
        style={{
          flexDirection: 'row',
          margin: 15,
          height: hp('1%'),
        }}>
        {stepList.map((val, index) => (
          <View
            key={`step-indicator-${index}`}
            style={{
              width: 10,
              marginHorizontal: 6,
              height: 10,
              borderRadius: 5,
              backgroundColor: index === currentStep ? MAIN_BLUE : LIGHT_GRAY,
            }}
          />
        ))}
      </View>

      <View style={[styles.wizardContainer, { height: hp('80%') }]}>
        <Wizard
          ref={wizard}
          steps={stepList}
          isFirstStep={val => setIsFirstStep(val)}
          isLastStep={val => setIsLastStep(val)}
          onNext={() => {
            setComplete(false);
          }}
          currentStep={({ currentStep }) => {
            setCurrentStep(currentStep);
          }}
        />
      </View>

      <View
        style={[
          styles.wizardActions,
          (isFirstStep || isLastStep) && { justifyContent: 'center' },
          isLastStep && {
            flexDirection: 'column-reverse',
            marginBottom: hp('2%'),
          },
        ]}>
        {!isFirstStep && (
          <Text
            disabled={isFirstStep}
            title='Prev'
            onPress={() => wizard.current.prev()}
            style={[
              styles.buttonText,
              {
                marginHorizontal: wp('5%'),
                color: 'black',
              },
            ]}>
            Atrás
          </Text>
        )}

        <Button
          disabled={isLastStep ? false : !complete}
          title='Next'
          onPress={async () => {
            if (isLastStep) {
              const { covidId } = await sendDataToApi();
              console.log('ELCOVID', covidId);
              navigation.navigate('Results');
            }
            if (data === 'Tengo al menos uno de estos síntomas') {
              setDialogVisible(true);
            } else {
              wizard.current.next();
            }
          }}
          style={[
            styles.buttons,
            {
              marginHorizontal: isFirstStep || isLastStep ? 0 : hp('3%'),
              marginVertical: 10,
              width: isFirstStep || isLastStep ? wp('85%') : 140,
              height: 45,
              backgroundColor: isLastStep
                ? GREEN
                : !complete
                ? '#b7dbb2'
                : GREEN,
            },
          ]}>
          <Text style={styles.buttonText}>
            {isLastStep ? 'Finalizar' : 'Continuar'}
          </Text>
        </Button>
      </View>
    </View>
  );
}
