import React, { Component } from 'react';

import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import languages from '../locales/languages';
import ButtonWrapper from '../components/ButtonWrapper';
import Colors from '../constants/colors';
import { SetStoreData } from '../helpers/General';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { isPlatformiOS } from './../Util';
import BottomSheet from 'reanimated-bottom-sheet';
import { SvgXml } from 'react-native-svg';
import fontFamily from '../constants/fonts';

const width = Dimensions.get('window').width;

const InitialRegion = {
  latitude: 35.692863,
  longitude: -98.090517,
  latitudeDelta: 55,
  longitudeDelta: 55,
};

class MapLocation extends Component {
  map = React.createRef();
  bottomSheet = React.createRef();

  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerShown: true,
      title: 'Map',
      headerBackTitle: '',
    });
    this.state = {
      region: InitialRegion
    };
    Geolocation.getCurrentPosition(this.getCurrentLocation.bind(this), (error) => {
      console.log('get current position error: ' + JSON.stringify(error));
    });
  }

  getCurrentLocation(position) {
    if (position && position.coords) {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }
      });
    }
  }

  renderContent() {
    return (
      <View style={styles.bsMainContainer}>
        <Text>some content</Text>
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={styles.bsHeader}>
        <View style={styles.bsHeaderIndicatorContainer}>
          <View style={styles.bsHeaderIndicator} />
        </View>
      </View>
    );
  }

  render() {
    return (<>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='transparent'
        translucent={true}
      />
      <View style={styles.mainContainer}>
        <MapView
          ref={this.map}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={this.state.region}
          showsUserLocation={true}
        >
        </MapView>
        <BottomSheet
          ref={this.bs}
          snapPoints={['60%', '30%']}
          initialSnap={1}
          renderContent={this.renderContent}
          renderHeader={this.renderHeader}
        />
      </View>
    </>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bsHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 6,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  bsHeaderIndicatorContainer: {
    alignItems: 'center',
  },
  bsHeaderIndicator: {
    width: 40,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#E1E4FF',
    marginBottom: 8,
  },
  bsMainContainer: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    padding: '2%',
  },
});

export default MapLocation;
