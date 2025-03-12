import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Touchable } from "react-native";
import { Card, Text, Button, Chip, Icon } from "react-native-paper";
import moment from "moment";
import { moderateScale } from "../utils/normalize";
import fontTheme from "../theme/fonttheme";
const HospitalCaseCard = ({item, navigation}) => {
  const [elapsedTime, setElapsedTime] = useState(moment().diff(moment(item.alarm_raise_on), 'seconds'));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(moment().diff(moment(item.alarm_raise_on), 'seconds'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const duration = moment.duration(seconds, 'seconds');
    return `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  };

  return (
    <Card style={styles.card}>
       <View style={{ backgroundColor: "white"}}>
            <View style={styles.headerBackground}>
                <Text style={[styles.hospitalName, {fontFamily: 'MavenPro-VariableFont_wght',}]}>{item.location.fullName}</Text>
                <TouchableOpacity style={styles.touchableStyle}>
                  <Icon source="message-text-outline" size={30} color="#000000"  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchableStyle}>
                  <Icon  source="video-outline" size={30} color="#000000"  />
                </TouchableOpacity>
            </View>
              <View style={styles.statusWithTimer}>
                  <View style={[styles.statusContainer, {color:'black'}]}>
                    <Text style={{fontFamily:"Poppins-Italic",fontSize: moderateScale(13)}}>
                      {item.status}
                    </Text>
                  </View>
                 
                  <View style={styles.timerContainer}>
                    <Icon source="timer" size={13} color="red" style={styles.iconTimer} />
                    <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
                  </View>
              </View>
              
       </View>
     
      <Card.Content style={styles.cardContent}>
       
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon source="clipboard-outline" size={20} color="gray" />
            <Text style={styles.detail}><Text style={styles.bold}>Case ID: </Text> {item.case_id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon source="phone-outline" size={20} color="gray" />
            <Text style={styles.detail}><Text style={styles.bold}>Contact No: </Text> {item.phone_number}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon source="alarm" size={20} color="gray" />
            <Text style={styles.detail}><Text style={styles.bold}>Alarm Raised On: </Text> {moment(item.alarm_raise_on).format("DD MMM YYYY, hh:mm A")}</Text>
          </View>
          {item.accepted_by &&
            <View style={styles.detailRow}>
             <Icon source="account-outline" size={20} color="gray" />
             <Text style={styles.detail}><Text style={styles.bold}>Accepted By: </Text> {item.accepted_by.name || "N/A"}</Text>
           </View>
          }
         
        </View>
      </Card.Content>
      <Card.Actions style={styles.actions}>
      <View style={styles.shadowWrapper}> 
        <Button
          mode="contained"
          icon="plus"
          labelStyle={styles.label}
          contentStyle={styles.buttonContent}
          buttonColor="#2978A0"
          textColor="white"
          onPress={() => navigation.navigate('ScreenC')}
        >
          Add   
        </Button>
      </View>
      <View style={styles.shadowWrapper}> 
        <Button
          mode="contained"
          icon="eye"
          labelStyle={styles.label}
          contentStyle={styles.buttonContent}
          buttonColor="#2978A0"
          textColor="white"
          onPress={() => navigation.navigate('ViewPatientDetails')}
        >
          View Details
        </Button>
      </View>

      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    width:'95%',
    backgroundColor: "white",
    borderRadius: 8,
    padding: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardContent: {
    paddingHorizontal: 10,
    width: "100%",
  },
  headerBackground: {
    flexDirection: "row",
    alignItems: "center",
    color:'#d5f4d6 ',
    paddingTop:7,
    padding: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: "100%",
  },
  hospitalName: {
    fontSize: moderateScale(23),
    color:'#000000',
    marginLeft: 5,
    flex: 1,
  },
  chatIcon: {
    marginLeft: "auto",
  },
  // statusRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent:'space-between',
  //   marginBottom: 10,
  //   paddingBottom:5,
  //   width: "100%",
  // },
  statusWithTimer: {
    // paddingLeft:12,
    padding:5,
    paddingLeft:13,
    paddingBottom:5,
    flexDirection: "row",
    justifyContent:'',
    alignItems: "center",
    gap: 10,
  },
  statusChip: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 20,
    height:30,
    justifyContent:'center',
    alignItems: 'center'
  },
  statusText: {
    color: "#2E8B57",
    fontFamily:"Poppins-SemiBold",
    fontWeight: "bold",
    padding:3,
    fontSize: moderateScale(12),
  },
  iconTimer:{
     backgroundColor:'white'
  },
  statusContainer: {
    backgroundColor:'#eafeed',
    borderRadius:15,
    padding:2,
    paddingLeft:10,
    paddingRight:10,
    flexDirection: "row",
    justifyContent:'center',
    alignItems: "center",
    shadowColor: "#A8E6A2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

  },
  timerContainer: {
    backgroundColor:'#fbdcdc',
    padding:3,
    paddingRight:7,
    borderRadius:15,
    flexDirection: "row",
    justifyContent:'center',
    alignItems: "center",
    shadowColor: "#A8E6A2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timer: {
    fontSize: moderateScale(13),
    color: "red",
    marginLeft: 5,
  },
  detailsContainer: {
    marginTop: 15,
    marginBottom:5,
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  detail: {
    fontSize: moderateScale(17),
    color: "#263238",
    marginLeft: 8,
    fontFamily: "Poppins-Light",
  },
  bold: {
    color:'gray'
  },
  actions: {
    width:'100%',
    flexDirection: "row",
    borderTopWidth:1,
    borderTopColor:'#D3D3D3',
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  touchableStyle:{
    paddingRight:10,
    paddingLeft:10,
  },
  button:{
    shadowColor: "#A8E6A2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowWrapper: {
    elevation: 1, // Required for Android shadows
    borderRadius: 20, // Ensure smooth shadow edges
  },
  label:{ fontSize: moderateScale(17), fontFamily:'Poppins-Light' }

});


export default HospitalCaseCard;
