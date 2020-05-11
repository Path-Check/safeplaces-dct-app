import React, { useRef, useState } from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import {
  Container, Content, Button,
} from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Wizard from 'react-native-wizard';

import styles from '../../components/styles';
import Color from '../../constants/Colors';

import StepSex from './steps/StepSex';
import StepName from './steps/StepName';
import StepAddress from './steps/StepAddress';

export default function PersonalInfoScreen() {
  const wizard = useRef(null);
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [isLastStep, setIsLastStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const stepList = [
    {
      content: <StepSex />,
    },
    {
      content: <StepName />,
    },
    {
      content: <StepAddress />,
    },
  ];

  const mystyles = StyleSheet.create({
    ...styles,
    wizardContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flex: 1,
    },
    wizard: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginLeft: 22,
      marginRight: 22,
    },
    wizardActions: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'white',
    },
  });

  const {
    mainBlue, lightGray, green,
  } = Color;
  return (
    <Container>
      <Content>
        <View style={[
          styles.scrollContainer,
          {
            display: 'flex',
            flexDirection: 'column',
            height: hp('101%'),
          },
        ]}
        >
          <View style={styles.header} />
          <View style={[styles.HeaderView, { padding: wp('3%') }]}>
            <Text style={styles.headerText}>Información Personal</Text>
            <Text style={[styles.text, { color: '#fff', width: wp('80%') }]}>
              Completar su información personal para darle una asistencia personalizada
            </Text>
          </View>

          <View style={mystyles.wizardContainer}>
            <View style={{ flexDirection: 'row', margin: 18 }}>
              {stepList.map((val, index) => (
                <View
                  key={`step-indicator-${index}`}
                  style={{
                    width: 10,
                    marginHorizontal: 6,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: index === currentStep ? mainBlue : lightGray,
                  }}
                />
              ))}
            </View>
            <ScrollView style={{ width: wp('100%') }} contentContainerStyle={mystyles.wizard}>
              <Wizard
                ref={wizard}
                steps={stepList}
                isFirstStep={(val) => setIsFirstStep(val)}
                isLastStep={(val) => setIsLastStep(val)}
                onNext={() => {
                  console.log('Next Step Called');
                }}
                onPrev={() => {
                  console.log('Previous Step Called');
                }}
                currentStep={({ currentStep, isLastStep, isFirstStep }) => {
                  setCurrentStep(currentStep);
                }}
              />
            </ScrollView>
            <View style={mystyles.wizardActions}>
              <Text
                disabled={isFirstStep}
                title="Prev"
                onPress={() => wizard.current.prev()}
                style={[
                  styles.buttonText,
                  {
                    margin: hp('3%'),
                    width: wp('30%'),
                    color: 'black',
                  },
                ]}
              >
                Atrás
              </Text>
              <Button
                disabled={isLastStep}
                title="Next"
                onPress={() => wizard.current.next()}
                style={[
                  styles.buttons,
                  {
                    margin: hp('3%'),
                    width: wp('30%'),
                    backgroundColor: green,
                  },
                ]}
              >
                <Text style={styles.buttonText}>Continuar</Text>
              </Button>
            </View>
          </View>
        </View>
      </Content>
    </Container>
  );
}
