import Geolocation from '@react-native-community/geolocation';
import React, { Component } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import BottomSheet from 'reanimated-bottom-sheet';

import Colors from '../constants/colors';
import { LocationData } from '../services/LocationService';
import DynamicText from '../components/DynamicText';

const InitialRegion = {
  latitude: 35.692863,
  longitude: -98.090517,
  latitudeDelta: 55,
  longitudeDelta: 55,
};

const BSDateSectionRow = ({ prefixTitle, title }) => {
  return (
    <View style={styles.BSDateSectionRow}>
      <DynamicText>
        <DynamicText
          style={{
            color: Colors.BLACK,
          }}>{`${prefixTitle} `}</DynamicText>
        <DynamicText
          style={{
            color: Colors.VIOLET_TEXT,
          }}>
          {title}
        </DynamicText>
      </DynamicText>
    </View>
  );
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
      region: InitialRegion,
      fullLocationData: [],
      locationDataForLine: [],
      locationDataForCircle: [],
    };
    Geolocation.getCurrentPosition(
      this.getCurrentLocation.bind(this),
      error => {
        console.log('get current position error: ' + JSON.stringify(error));
      },
    );

    this.getDeviceLocations();
  }

  async getDeviceLocations() {
    const locationData = new LocationData();
    const fullLocationData = await locationData.getLocationData();
    fullLocationData.sort((a, b) => (a.time < b.time ? 1 : -1));
    this.setState({
      fullLocationData,
    });

    const locationDataForLine = [];
    const locationDataForCircle = [];
    for (let i = 0; i < fullLocationData.length; i++) {
      const location = fullLocationData[i];
      locationDataForLine.push({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      locationDataForCircle.push({
        key: `circle ${i}`,
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
    }
    this.setState({
      locationDataForLine,
      locationDataForCircle,
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
        },
      });
    }
  }

  renderContent() {
    const covertToDate = time => {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const datetime = new Date(time);
      const month = monthNames[datetime.getMonth()];
      const date = datetime.getDate();
      const year = datetime.getFullYear();
      return `${month} ${date}, ${year}`;
    };
    const dates = [];
    const points = {};
    for (let location of this.state.fullLocationData) {
      const formattedDate = covertToDate(location.time);
      if (dates.length !== 0 && formattedDate === dates[dates.length - 1]) {
        points[formattedDate].push(location);
      } else {
        dates.push(formattedDate);
        points[formattedDate] = [location];
      }
    }

    return (
      <View style={styles.bsMainContainer}>
        <DynamicText>some content</DynamicText>
        <BSDateSectionRow prefixTitle={'test'} title={'test'} />
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
    return (
      <>
        <StatusBar
          barStyle='dark-content'
          backgroundColor='transparent'
          translucent
        />
        <View style={styles.mainContainer}>
          <MapView
            ref={this.map}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={this.state.region}
            showsUserLocation>
            <Polyline
              coordinates={this.state.locationDataForLine}
              strokeColor={Colors.MAP_LINE_STROKE}
              strokeWidth={1}
            />
            {this.state.locationDataForCircle.map(circle => (
              <Circle
                key={circle.key}
                center={circle.center}
                radius={2}
                lineJoin='round'
                strokeColor={Colors.MAP_LINE_STROKE}
                fillColor={Colors.MAP_LINE_STROKE}
              />
            ))}
          </MapView>
          <BottomSheet
            ref={this.bs}
            snapPoints={['60%', '30%']}
            initialSnap={1}
            renderContent={this.renderContent.bind(this)}
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
    backgroundColor: Colors.WHITE,
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
    backgroundColor: Colors.BOTTOM_SHEET_HEADER_INDICATOR,
    marginBottom: 8,
  },
  bsMainContainer: {
    backgroundColor: Colors.WHITE,
    height: '100%',
    padding: '2%',
  },
});

export default MapLocation;
