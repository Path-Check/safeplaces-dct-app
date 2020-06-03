import { Text } from 'native-base';
import React from 'react';
import { Image, View } from 'react-native';

import styles from './Header/style';

export default function ResultsContent({
  title,
  subtitle,
  image,
  nextSteps = [],
  recomendations,
  subLink = null,
  subLinkText = null,
  navigation = null,
}) {
  return (
    <View>
      <Image
        resizeMode='contain'
        style={{ height: 200, width: 310, alignSelf: 'center', marginTop: 10 }}
        source={image}
      />
      <Text style={[styles.subtitles, { marginBottom: 15, fontSize: 19 }]}>
        {title}
      </Text>
      <Text
        style={[
          styles.text,
          { marginTop: 10, fontSize: 14, textAlign: 'justify' },
        ]}>
        {subtitle}
        {subLink && (
          <Text
            style={{ color: 'blue' }}
            onPress={() =>
              navigation.navigate('Details', {
                source: {
                  uri:
                    'http://digepisalud.gob.do/documentos/?drawer=Vigilancia%20Epidemiologica*Alertas%20epidemiologicas*Coronavirus*Nacional*Materiales%20IEC%20COVID-19',
                },
              })
            }>
            {subLinkText}
          </Text>
        )}
      </Text>
      <Text style={styles.textBold}>Siguientes pasos:</Text>
      <View style={styles.bottomLine} />
      <View style={{ marginTop: 10 }}>
        {nextSteps.map((step, index) => (
          <View key={index}>
            <Text style={[styles.textSemiBold]}>
              {index + 1}. {step.title}.
            </Text>
            <Text
              style={[
                styles.text,
                { marginLeft: 15, marginBottom: 10, textAlign: 'justify' },
              ]}>
              {step.content}
            </Text>
          </View>
        ))}
      </View>
      {recomendations && (
        <View>
          <Text style={styles.textBold}>Recomendación de prueba:</Text>
          <View style={styles.bottomLine} />
          <View style={{ marginTop: 10 }}>
            {recomendations.map((step, index) => (
              <View key={index}>
                <Text style={[styles.textSemiBold, { marginLeft: 10 }]}>
                  {step.title}.
                </Text>
                <Text
                  style={[
                    styles.text,
                    { marginLeft: 10, textAlign: 'justify' },
                  ]}>
                  {step.content}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
