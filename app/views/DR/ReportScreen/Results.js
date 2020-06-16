import { Button, Container, Content, Text } from 'native-base';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
              title={t('answers_translate.header.title')}
              text={t('answers_translate.header.text')}
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
                    title={t('answers_translate.social_distance.title')}
                    subtitle={t(
                      'answers_translate.social_distance.subtitle.no_traveled',
                    )}
                    image={require('../../../assets/images/socialDistancing.jpg')}
                    nextSteps={[
                      {
                        title: t(
                          'answers_translate.social_distance.next_steps.step_one.title',
                        ),
                        content: t(
                          'answers_translate.social_distance.next_steps.step_one.content',
                        ),
                      },
                    ]}
                    recomendations={[
                      {
                        title: t(
                          'answers_translate.social_distance.recomendations.tip.title',
                        ),
                        content: t(
                          'answers_translate.social_distance.recomendations.tip.content.no_sympthoms',
                        ),
                      },
                      {
                        title: t('answers_translate.thanksfull.title'),
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
                    title={t('answers_translate.social_distance.title')}
                    subtitle={t(
                      'answers_translate.social_distance.subtitle.traveled',
                    )}
                    image={require('../../../assets/images/socialDistancing.jpg')}
                    nextSteps={[
                      {
                        title: t(
                          'answers_translate.social_distance.next_steps.step_two.title',
                        ),
                        content: '',
                      },
                      {
                        title: t(
                          'answers_translate.social_distance.next_steps.step_one.title',
                        ),
                        content: t(
                          'answers_translate.social_distance.next_steps.step_one.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.social_distance.next_steps.step_three.title',
                        ),
                        content: t(
                          'answers_translate.social_distance.next_steps.step_three.content',
                        ),
                      },
                    ]}
                    recomendations={[
                      {
                        title: t(
                          'answers_translate.social_distance.recomendations.title',
                        ),
                        content: t(
                          'answers_translate.social_distance.recomendations.tip.content.no_sympthoms',
                        ),
                      },
                      {
                        title: t('answers_translate.thanksfull.title'),
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
                    title={t('answers_translate.social_distance.title')}
                    subtitle={t(
                      'answers_translate.social_distance.subtitle.no_traveled',
                    )}
                    image={require('../../../assets/images/socialDistancing.jpg')}
                    nextSteps={[
                      {
                        title: t(
                          'answers_translate.social_distance.next_steps.step_one.title',
                        ),
                        content: t(
                          'answers_translate.social_distance.next_steps.step_one.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.social_distance.next_steps.step_five.title',
                        ),
                        content: t(
                          'answers_translate.social_distance.next_steps.step_five.content',
                        ),
                      },
                    ]}
                    recomendations={[
                      {
                        title: t(
                          'answers_translate.social_distance.recomendations.title',
                        ),
                        content: t(
                          'answers_translate.social_distance.recomendations.tip.content.has_sympthoms',
                        ),
                      },
                      {
                        title: t('answers_translate.thanksfull.title'),
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
                    title={t('answers_translate.social_distance.title')}
                    subtitle={t(
                      'answers_translate.social_distance.subtitle.no_traveled',
                    )}
                    image={require('../../../assets/images/socialDistancing.jpg')}
                    nextSteps={[
                      {
                        title: t(
                          'answers_translate.social_distance.next_steps.step_four.title',
                        ),
                        content: t(
                          'answers_translate.social_distance.next_steps.step_four.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.social_distance.next_steps.step_three.title',
                        ),
                        content: t(
                          'answers_translate.social_distance.next_steps.step_three.content',
                        ),
                      },
                    ]}
                    recomendations={[
                      {
                        title: t(
                          'answers_translate.social_distance.recomendations.title',
                        ),
                        content: t(
                          'answers_translate.social_distance.recomendations.tip.content.no_sympthoms',
                        ),
                      },
                      {
                        title: t('answers_translate.thanksfull.title'),
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
                    title={t('answers_translate.home_insolation.title.none')}
                    subtitle={t(
                      'answers_translate.home_insolation.subtitle.none',
                    )}
                    image={require('../../../assets/images/selfIsolation.jpg')}
                    nextSteps={[
                      {
                        title: t(
                          'answers_translate.home_insolation.next_steps.step_one.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.next_steps.step_one.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.home_insolation.next_steps.step_two.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.next_steps.step_two.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.home_insolation.next_steps.step_three.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.next_steps.step_three.content',
                        ),
                      },
                    ]}
                    recomendations={[
                      {
                        title: t(
                          'answers_translate.home_insolation.recomendations.tip.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.recomendations.tip.content',
                        ),
                      },
                      {
                        title: t('answers_translate.thanksfull.title'),
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
                    title={t(
                      'answers_translate.home_insolation.title.has_health_problems',
                    )}
                    subtitle={t(
                      'answers_translate.home_insolation.subtitle.has_health_problems',
                    )}
                    image={require('../../../assets/images/contactDoctor.jpg')}
                    nextSteps={[
                      {
                        title: t(
                          'answers_translate.home_insolation.next_steps.step_one.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.next_steps.step_one.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.home_insolation.next_steps.step_two.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.next_steps.step_two.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.home_insolation.recomendations.tip.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.recomendations.tip.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.home_insolation.next_steps.step_three.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.next_steps.step_three.content',
                        ),
                      },
                    ]}
                  />
                )}
              {hasSympthomps &&
                (hadContact || traveled || hasHealthProblems) &&
                liveInFacility && (
                  <ResultsContent
                    title={t(
                      'answers_translate.home_insolation.title.has_health_problems',
                    )}
                    subtitle={t(
                      'answers_translate.home_insolation.subtitle.has_health_problems',
                    )}
                    image={require('../../../assets/images/callSupervisor.jpg')}
                    nextSteps={[
                      {
                        title: t(
                          'answers_translate.home_insolation.next_steps.step_one.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.next_steps.step_one.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.home_insolation.next_steps.step_four.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.next_steps.step_four.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.home_insolation.next_steps.step_two.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.next_steps.step_two.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.home_insolation.recomendations.tip.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.recomendations.tip.content',
                        ),
                      },
                      {
                        title: t(
                          'answers_translate.home_insolation.next_steps.step_three.title',
                        ),
                        content: t(
                          'answers_translate.home_insolation.next_steps.step_three.content',
                        ),
                      },
                      {
                        title: t('answers_translate.thanksfull.title'),
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
