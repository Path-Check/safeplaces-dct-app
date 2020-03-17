import React from 'react'
import { View, Text,Dimensions, Image, TouchableOpacity } from 'react-native'
const width = Dimensions.get('window').width;

const Intro2 = (props) => {
    return (
        <View style={{flex:1,backgroundColor:'white'}}>
            <View style={{width:width*0.7866,backgroundColor:'#3497fc',height:'70%',borderRadius:12,alignSelf:'center',marginTop:'9%',justifyContent:'center'}}>
                <Text 
                    style={{
                        fontFamily: "OpenSans-Bold",
                        fontSize: 24,
                        lineHeight: 55,
                        letterSpacing: 0,
                        textAlign: "center",
                        color: "#ffffff"
                        }}>
                Less than 100KB
                </Text>
                <Text 
                style={{
                    opacity: 0.8,
                    fontFamily: "OpenSans-SemiBold",
                    fontSize: 14,
                    lineHeight: 24,
                    letterSpacing: 0,
                    textAlign: "center",
                    color: "#ffffff",
                    maxWidth:'84%',
                    alignSelf:'center',
                    marginTop:12}}>
Private Kit’s trail generator logs your device’s location data in under 100KB of space – less space than a single picture. 
                </Text>

                <Text 
                    style={{
                        fontFamily: "OpenSans-Bold",
                        fontSize: 24,
                        lineHeight: 55,
                        letterSpacing: 0,
                        textAlign: "center",
                        color: "#ffffff",
                        marginTop:36
                        }}>
                You are in charge
                </Text>
                <Text 
                style={{
                    opacity: 0.8,
                    fontFamily: "OpenSans-SemiBold",
                    fontSize: 14,
                    lineHeight: 24,
                    letterSpacing: 0,
                    textAlign: "center",
                    color: "#ffffff",
                    maxWidth:'84%',
                    alignSelf:'center',
                    marginTop:12}}>
Data Never Leaves Your Device Without Your Consent                </Text>
            </View>
           
           <View style={{flexDirection:'row',left:width*.445,marginTop:30}}>
           <TouchableOpacity 
           onPress={()=>props.navigation.navigate('Intro1')}
               style={{
                width: 8,
                height: 8,
                borderRadius: 13,
                backgroundColor: "#78849e",
                opacity:.32,
                marginRight:8
            }}/>
               <View 
               style={{
                width: 8,
                height: 8,
                opacity: 1,
                borderRadius: 13,
                backgroundColor: "#665EFF",
                marginRight:8
            }}/>
            <TouchableOpacity 
            onPress={()=>props.navigation.navigate('Intro3')}
               style={{
                width: 8,
                height: 8,
                opacity: 0.32,
                borderRadius: 13,
                backgroundColor: "#78849e"
            }}/>
           </View>

            <View style={{flexDirection:'row',justifyContent:'space-between',width:width*.7866,alignSelf:'center'}}>
            <TouchableOpacity 
            onPress={()=>props.navigation.navigate('Intro1')}
            style={{
                borderRadius: 12,
                backgroundColor: "rgba(120, 132, 158, 0.16)",
                height:52,
                alignSelf:'center',
                width:width*.38,
                marginTop:30,
                justifyContent:'center'
                }} >
                <Text 
                    style={{
                        fontFamily: "OpenSans-Bold",
                        fontSize: 14,
                        lineHeight: 19,
                        letterSpacing: 0,
                        textAlign: "center",
                        color: "#454f63"}}>BACK</Text>
            </TouchableOpacity>
          
           <TouchableOpacity 
           onPress={()=>props.navigation.navigate('Intro3')}
            style={{
                borderRadius: 12,
                backgroundColor: "#665eff",
                height:52,
                alignSelf:'center',
                width:width*.38,
                marginTop:30,
                justifyContent:'center'
                }} >
                <Text 
                    style={{
                        fontFamily: "OpenSans-Bold",
                        fontSize: 14,
                        lineHeight: 19,
                        letterSpacing: 0,
                        textAlign: "center",
                        color: "#ffffff"}}>NEXT</Text>
            </TouchableOpacity>
            </View>
          
            {/* <TouchableOpacity><Text style={{marginTop:12,fontFamily:'OpenSans-SemiBold',alignSelf:'center',color:'#665eff'}}>Skip this</Text></TouchableOpacity> */}
        </View>
    )
}

export default Intro2
