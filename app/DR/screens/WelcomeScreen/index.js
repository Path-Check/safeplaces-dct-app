import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Text } from 'native-base';
import Instructions from '../../components/Instructions';
import styles from '../../components/styles';

function InsideInstructions({ title, text }) {
  return (
    <View style={styles.instructionsContent}>
      <Text style={styles.instructionsTitle}>{title}</Text>
      <Text style={styles.instructionsText}>{text}</Text>
    </View>
  );
}

export default function WelcomeScreen({ navigation }) {
  navigation.setOptions({
    headerShown: false,
  });

  storeData = async () => {
    try {
      await AsyncStorage.setItem('welcomeShown', 'yes');
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      storeData();
    });
    return subscribe;
  }, [navigation]);

  return (
    <Instructions
      navigation={navigation}
      data={[
        {
          image: require('../../assets/images/recommendations.jpg'),
          content: (
            <InsideInstructions
              title="Evalua tus síntomas"
              text="Si tienes algún síntoma parecido al COVID-19 lo evaluamos y te damos el seguimiento apropiado"
            />
          ),
        },
        {
          image: require('../../assets/images/news.jpg'),
          content: (
            <InsideInstructions
              title="Tranquilo e informado"
              text="Te mantendremos informado de lo que necesitas saber del COVID-19 en R.D. en un solo lugar"
            />
          ),
        },
        {
          image: require('../../assets/images/bulletins.jpg'),
          content: (
            <InsideInstructions
              title="Recibe Alertas"
              text="Recibe las alertas del Ministerio de Salud para mantener a tu familia asegurada"
            />
          ),
        },
      ]}
    />
  );
}
