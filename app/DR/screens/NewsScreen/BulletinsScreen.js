import React, { useContext } from 'react';
import { View, ScrollView } from 'react-native';
import HeaderImage from '../../components/HeaderImage';
import DataList from '../../components/DataList';
import context from '../../components/reduces/context';
import image from '../../assets/images/bulletins.jpg';

export default function BulletinsScreen({ navigation }) {
  const [globaState] = useContext(context);
  const { bulletins } = globaState;

  return (
    <View style={{ flex: 1 }}>
      <HeaderImage imgUrl={image} title="Boletines Oficiales" />

      <ScrollView>
        <DataList
          data={bulletins}
          navigation={navigation}
          switchScreenTo="PDF"
        />
      </ScrollView>
    </View>
  );
}
