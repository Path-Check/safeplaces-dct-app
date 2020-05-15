import React, { useRef, useState } from 'react';
import { View, Image } from 'react-native';
import { Button, Text } from 'native-base';
import Wizard from 'react-native-wizard';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import styles from './styles';
import Colors from '../constants/Colors';


export default function Instructions({ data = [], navigation }) {
  const wizard = useRef(null);
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [isLastStep, setIsLastStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(data[0].image);

  const { mainBlue, lightGray } = Colors;
  return (
    <View style={styles.instructionView}>
      <Image
        resizeMode="cover"
        source={backgroundImage}
        style={styles.instructionsImage}
      />
      <View
        style={{
          height: hp('100%'),
          justifyContent: 'flex-end'
        }}>
        <View style={[styles.instructionsContainer, styles.bottomMargin]}>
          <View style={styles.stepIndicatorContainer}>
            {data.map((val, index) => (
              <View
                key={`step-indicator-${index}`}
                style={[
                  styles.stepIndicator,
                  {
                    backgroundColor:
                      index === currentStep ? '#4acfff' : lightGray
                  }
                ]}
              />
            ))}
          </View>

          <Wizard
            ref={wizard}
            steps={data}
            isFirstStep={val => setIsFirstStep(val)}
            isLastStep={val => setIsLastStep(val)}
            nextStepAnimation="fade"
            currentStep={({ currentStep, isFirstStep, isLastStep }) => {
              setCurrentStep(currentStep);
              setBackgroundImage(data[currentStep].image);
            }}
          />
          <View
            style={{
              marginVertical: hp('3%'),
              marginBottom: hp('1.5%')
            }}>
            <Button
              onPress={() => {
                wizard.current.next();
                if (isLastStep) {
                  navigation.navigate('App');
                }
              }}
              style={[
                styles.buttons,
                {
                  width: '70%',
                  backgroundColor: '#fff'
                }
              ]}>
              <Text style={[styles.buttonText, { color: mainBlue }]}>
                Continuar
              </Text>
            </Button>
            <Button
              transparent
              onPress={() => navigation.navigate('App')}
              style={styles.buttons}>
              <Text
                style={[
                  styles.instructionsText,
                  {
                    margin: '1%',
                    alignSelf: 'center',
                    textTransform: 'capitalize'
                  }
                ]}>
                Saltar
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
