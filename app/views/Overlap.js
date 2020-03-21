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
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';


const width = Dimensions.get('window').width;

const base64 = RNFetchBlob.base64

const public_data = "https://docs.google.com/spreadsheets/d/1itaohdPiAeniCXNlntNztZ_oRvjh0HsGuJXUJWET008/export?format=csv"


class OverlapScreen extends Component {
    constructor(props) {
        super(props);
        //this.setState({region: {}});
        this.state = {'region': {}, 'markers': [], 'circles': []};
        this.getInitialState();
        this.set_markers();
    }

    getOverlap = async () => {
        try {
            
        } catch (error) {
            console.log(error.message);
        }
    };

    set_markers = async() => {
        GetStoreData('LOCATION_DATA')
        .then(locationArrayString => {
            var locationArray = JSON.parse(locationArrayString);
            for (var i = 0; i < locationArray.length - 1; i+=50) {
                console.log(i);
                const coord = locationArray[i];
                this.setState({
                    markers : [
                        ...this.state.markers,
                        {
                            coordinate: {
                                latitude: coord["latitude"],
                                longitude: coord["longitude"],
                            },
                            key: i + 1,
                            color: '#f26964',
                        }
                    ],
                });
            }
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
                        latitudeDelta: 1.10922,
                        longitudeDelta: 1.20421,
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
                            this.plotCircles(parsedRecords);
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
              var rows = records.split('\n');
              var parsedRows = []
              for (var i = rows.length - 1; i >= 0; i--) {
                  var row = rows[i].split(',');
                  if (row[7].length > 0 && row[8].length > 0) {
                    parsedRows.push([parseFloat(row[7]), parseFloat(row[8])]);
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
            console.log("length is ", records.length);
            for (var i = records.length - 1; i >= 0; i-=100) {
                var latitude = records[i][0];
                var longitude = records[i][1];
                if (!isNaN(latitude) && !isNaN(longitude)) {
                    this.setState({
                    circles : [
                        ...this.state.circles,
                        {
                            center: {
                                latitude: latitude,
                                longitude: longitude,
                            },
                            radius: 7000
                        }
                    ],
                    });
                }
            }
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
                        region={this.state.region}
                    >
                        {this.state.markers.map(marker => (
                        <Marker
                          coordinate={marker.coordinate}
                          title={marker.title}
                          description={marker.description}
                        />
                        ))}

                        {this.state.circles.map(circle => (
                        <Circle
                            center={circle.center}
                            radius={circle.radius}
                            fillColor="rgba(208, 35, 35, 0.3)"
                            strokeColor="rgba(0,0,0,0.5)"
                            zIndex={2}
                            strokeWidth={2}
                        />
                        ))}
                    </MapView>
                <View style={styles.main}>
                    <TouchableOpacity style={styles.buttonTouchable} onPress={this.downloadAndPlot}>
                        <Text style={styles.buttonText}>{languages.t('label.show_overlap')}</Text>
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