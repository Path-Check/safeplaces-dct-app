import AsyncStorage from '@react-native-community/async-storage';
import { Button, Text } from 'native-base';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Dialog } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/Ionicons';
import Wizard from 'react-native-wizard';

import {
  MEPYD_C5I_API_URL,
  MEPYD_C5I_SERVICE,
} from './../../../constants/DR/baseUrls';
import Header from '../../../components/DR/Header/index';
import styles from '../../../components/DR/Header/style';
import context from '../../../components/DR/Reduces/context';
import Colors from '../../../constants/colors';
import { COVID_ID } from '../../../constants/storage';
import validateResponse from '../../../helpers/DR/validateResponse';
import { SetStoreData } from '../../../helpers/General';
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
  const { t } = useTranslation();

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
    let merged = {};
    if (answers.usage === 'mySelf') {
      let userInfo = await AsyncStorage.getItem('UserPersonalInfo');
      userInfo = await JSON.parse(userInfo);
      merged = { ...userInfo, ...answers };
    } else {
      merged = answers;
    }

    return await validateResponse(
      `${MEPYD_C5I_SERVICE}:443/${MEPYD_C5I_API_URL}/Form`,
      'POST',
      merged,
    );
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
  const { BLUE_RIBBON, LIGHT_GRAY, GREEN, WHITE, BLACK } = Colors;
  return (
    <View
      style={{
        backgroundColor: WHITE,
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
          <Text style={styles.subtitles}>
            {t('report.callEmergency.call_title')}
          </Text>
          <Text style={styles.text}>
            {t('report.callEmergency.call_subtitle')}
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
            <Text>{t('report.close')}</Text>
          </Button>
        </View>
      </Dialog>

      <Header
        title={t('report.title')}
        text={t('report.subtitle')}
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
              backgroundColor: index === currentStep ? BLUE_RIBBON : LIGHT_GRAY,
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
                color: BLACK,
              },
            ]}>
            {t('report.back')}
          </Text>
        )}

        <Button
          disabled={isLastStep ? false : !complete}
          title='Next'
          onPress={async () => {
            if (isLastStep) {
              try {
                const { covidId } = await sendDataToApi();
                SetStoreData(COVID_ID, covidId);
                navigation.navigate('Results');
              } catch (e) {
                console.log('[error] ', e);
              }
            }
            if (
              data === t('report.haveSymptoms.have_this_symptoms_others') ||
              data === t('report.haveSymptoms.have_this_symptoms_myself')
            ) {
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
            {isLastStep ? t('report.thankYou.finish') : t('report.continue')}
          </Text>
        </Button>
      </View>
    </View>
  );
}
