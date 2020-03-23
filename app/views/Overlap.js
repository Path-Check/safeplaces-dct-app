import React, {
    Component
} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Linking,
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,BackHandler
} from 'react-native';

import colors from "../constants/colors";
import WebView from 'react-native-webview';
import Button from "../components/Button";
import {
    GetStoreData
} from '../helpers/General';
import {
    convertPointsToString
} from '../helpers/convertPointsToString';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import LocationServices from '../services/LocationService';
import backArrow from './../assets/images/backArrow.png'
import languages from './../locales/languages'
import { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-map-clustering';


const width = Dimensions.get('window').width;

const base64 = RNFetchBlob.base64

const public_data = "https://docs.google.com/spreadsheets/d/1itaohdPiAeniCXNlntNztZ_oRvjh0HsGuJXUJWET008/export?format=csv"
const show_button_text = "Show Me Trace Overlap";
const INITIAL_REGION = {
    latitude: 14.5617,
    longitude: 121.0214,
    latitudeDelta: 25,
    longitudeDelta: 25,
};

class OverlapScreen extends Component {
    constructor(props) {
        super(props);
        //this.setState({region: {}});

        this.state = {
                        'region': {},
                        'markers': [],
                        'circles': [],
                        'showButton': {'disabled': false, 'text': show_button_text},
                        'initialRegion': INITIAL_REGION,
                    };
        this.getInitialState();
        this.setMarkers();
    }

    getOverlap = async () => {
        try {
            
        } catch (error) {
            console.log(error.message);
        }
    };

    setMarkers = async() => {
        GetStoreData('LOCATION_DATA')
        .then(locationArrayString => {
            var locationArray = JSON.parse(locationArrayString);
            var markers = [];
            for (var i = 0; i < locationArray.length - 1; i+=1) {
                console.log(i);
                const coord = locationArray[i];
                const marker = {
                                    coordinate: {
                                        latitude: coord["latitude"],
                                        longitude: coord["longitude"],
                                    },
                                    key: i + 1,
                                    color: '#f26964',
                                }
                markers.push(marker);
            }
            this.setState({
                markers: markers
            });
        });
    };

    getInitialState = async () => {
        try { 
            //const locationArray
            GetStoreData('LOCATION_DATA')
            .then(locationArrayString => {
                var locationArray = JSON.parse(locationArrayString);
                var lastCoords = locationArray[locationArray.length - 1];
                this.setState({
                    region: {
                        latitude: lastCoords["latitude"],
                        longitude: lastCoords["longitude"],
                        latitudeDelta: 10.10922,
                        longitudeDelta: 10.20421,
                    },
                    markers: [{coordinate: {
                                latitude: lastCoords["latitude"],
                                longitude: lastCoords["longitude"],
                              },
                              key: 0,
                              color: '#f26964',
                        },],
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    downloadAndPlot = async () => {
        // Downloads the file on the disk and loads it into memory
        try {
            // statements
            this.setState({'showButton': {'disabled': true,
                                          'text': 'Loading Public Trace'}});
            RNFetchBlob
              .config({
                // add this option that makes response data to be stored as a file,
                // this is much more performant.
                fileCache : true,
              })
              .fetch('GET', public_data, {
                //some headers ..
              })
              .then((res) => {
                // the temp file path
                console.log('The file saved to ', res.path())
                try {
                    RNFetchBlob.fs.readFile(res.path(), 'utf8')
                      .then((records) => {
                        this.parseCSV(records)
                        .then((parsedRecords) =>{
                            console.log(parsedRecords);
                            console.log(Object.keys(parsedRecords).length);
                            this.plotCircles(parsedRecords)
                            .then(() => {
                                this.setState({'showButton': {'disabled': false,
                                                'text': show_button_text}});
                            });
                        });
                      })
                      .catch((e) => {
                        console.error("got error: ", e);
                      })
                  } catch (err) {
                    console.log('ERROR:', err);
                  }
              })
              //Load csv
              //Convert to json
              //Remove 
        } catch(e) {
            // statements
            console.log(e);
        }
    }

    parseCSV = async (records) => {
        try {
              const rows = records.split('\n');
              var parsedRows = {}
              for (var i = rows.length - 1; i >= 0; i--) {
                  var row = rows[i].split(',');
                  const lat = parseFloat(row[7]);
                  const long = parseFloat(row[8]);
                  if (!isNaN(lat) && !isNaN(long)) {
                    key = String(lat) + "|" + String(long)
                    if (!(key in parsedRows)) {
                        parsedRows[key] = 0
                    }
                    parsedRows[key] += 1
                  }
              }
              return parsedRows;
        } catch(e) {
            // statements
            console.log(e);
        }
    };

    plotCircles = async (records) => {
        try {
            var circles = [];
            for (const key in records) {
                const latitude = parseFloat(key.split('|')[0]);
                const longitude = parseFloat(key.split('|')[1]);
                const count = records[key];
                if (!isNaN(latitude) && !isNaN(longitude)) {
                    var circle = {
                            center: {
                                latitude: latitude,
                                longitude: longitude,
                            },
                            radius: 200 * count
                            }
                    circles.push(circle);
                }
                console.log(count);
            }
            this.setState({
                    circles : circles
                    });
            console.log("done!");
        } catch(e) {
            console.log(e);
        }
    };

    onRegionChange = async(region) => {
        //console.log(this.setState());
        //this.setState({region});
    };

    backToMain() {
        this.props.navigation.navigate('LocationTrackingScreen', {})
    }

    handleBackPress = () => {     
        this.props.navigation.navigate('LocationTrackingScreen', {});
        return true;   
    };  

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress); 
    }

    componentWillUnmount() { 
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress); 
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>

                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backArrowTouchable} onPress={() => this.backToMain()}>
                         <Image style={styles.backArrow} source={backArrow} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{languages.t('label.overlap')}</Text>
                </View>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.main}
                        initialRegion={this.state.initialRegion}
                    >
                        {this.state.markers.map(marker => (
                        <Marker
                          coordinate={marker.coordinate}
                          title={marker.title}
                          description={marker.description}
                          tracksViewChanges={false}
                        />
                        ))}
                        {this.state.circles.map(circle => (
                        <Circle
                            center={circle.center}
                            radius={circle.radius}
                            fillColor="rgba(208, 35, 35, 0.3)"
                            strokeWidth={0}
                            zIndex={2}
                            strokeWidth={2}
                        />
                        ))}
                    </MapView>
                    {/*<MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.main}
                        initialRegion={this.state.initialRegion}
                        region={this.state.region}
                        clustering={true}
                    >
                        {this.state.markers.map(marker => (
                        <Marker
                          coordinate={marker.coordinate}
                          title={marker.title}
                          description={marker.description}
                          tracksViewChanges={false}
                        />
                        ))}

                        {this.state.circles.map(circle => (
                        <Circle
                            center={circle.center}
                            radius={circle.radius}
                            fillColor="rgba(208, 35, 35, 0.3)"
                            strokeWidth={0}
                            zIndex={2}
                            strokeWidth={2}
                        />
                        ))}
                    </MapView>*/}
                <View style={styles.main}>
                    <TouchableOpacity style={styles.buttonTouchable} onPress={() => this.downloadAndPlot()}
                     disabled={this.state.showButton.disabled}>
                        <Text style={styles.buttonText}>{languages.t(this.state.showButton.text)}</Text>
                    </TouchableOpacity>
                    <Text style={styles.sectionDescription}>{languages.t('label.overlap_para_1')}</Text>
                </View>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    // Container covers the entire screen
    container: {
        flex: 1,
        flexDirection: 'column',
        color: colors.PRIMARY_TEXT,
        backgroundColor: colors.WHITE
    },
    headerTitle: {
        textAlign: 'center',
        fontWeight: "bold",
        fontSize: 38,

        padding: 0
    },
    subHeaderTitle: {
        textAlign: 'center',
        fontWeight: "bold",
        fontSize: 22,
        padding: 5
    },
    main: {
        flex: 1,
        flexDirection: 'column',
        textAlignVertical: 'top',
       // alignItems: 'center',
        padding:20,
        width:'96%',
        alignSelf:'center'
    },
    buttonTouchable: {
        borderRadius: 12,
        backgroundColor: "#665eff",
        height:52,
        alignSelf:'center',
        width:width*.7866,
        marginTop:30,
        justifyContent:'center'
    },
    buttonText:{

        fontFamily: "OpenSans-Bold",
        fontSize: 14,
        lineHeight: 19,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff"
    },
    mainText: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '400',
        textAlignVertical: 'center',
        padding: 20,
    },
    smallText: {
        fontSize: 10,
        lineHeight: 24,
        fontWeight: '400',
        textAlignVertical: 'center',
        padding: 20,
    },

    headerContainer: {
        flexDirection: 'row',
        height:60,
        borderBottomWidth:1,
        borderBottomColor:'rgba(189, 195, 199,0.6)',
        alignItems:'center'
    },
    backArrowTouchable:{
        width:60,
        height:60,
        paddingTop:21,
        paddingLeft:20
    },
    backArrow: {
        height: 18, 
        width: 18.48
    },
    headerTitle:{
        fontSize: 24,
        fontFamily:'OpenSans-Bold'
    },
    sectionDescription: {
        fontSize: 16,
        lineHeight: 24,
        marginTop:12,
        fontFamily:'OpenSans-Regular',
    },
});

export default OverlapScreen;