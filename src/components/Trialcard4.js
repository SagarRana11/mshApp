import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Touchable } from "react-native";
import { Card, Text, Button, Chip, Icon } from "react-native-paper";
import moment from "moment";

const HospitalCaseCard = ({ caseData }) => {
  const {
    hospitalName,
    status,
    caseId,
    contactNo,
    alarmRaisedOn,
    acceptedBy,
    caseRaisedTime,
  } = caseData;

  const [elapsedTime, setElapsedTime] = useState(moment().diff(moment(caseRaisedTime), 'seconds'));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(moment().diff(moment(caseRaisedTime), 'seconds'));
    }, 1000);
    return () => clearInterval(interval);
  }, [caseRaisedTime]);

  const formatTime = (seconds) => {
    const duration = moment.duration(seconds, 'seconds');
    return `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  };

  return (
    <Card style={styles.card}>
       <View style={{ backgroundColor: "#2E8B57"}}>
            <View style={styles.headerBackground}>
                <Text style={styles.hospitalName}>{hospitalName}</Text>
                <TouchableOpacity style={styles.touchableStyle}>
                  <Icon style={styles.buttonStyle} source="message-text" size={28} color="#FFFFFF"  />
                </TouchableOpacity>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusWithTimer}>
                  <View style={[styles.statusContainer, {color:'black'}]}>
                    <Text style={{fontFamily:"Poppins-Light",}}>
                      {status}
                    </Text>
                  </View>
                 
                  <View style={styles.timerContainer}>
                    <Icon source="timer" size={20} color="red" style={styles.iconTimer} />
                    <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
                  </View>
              </View>
              <TouchableOpacity style={[{marginRight:10}, styles.touchableStyle]}>
                <Icon source="video" size={28} color="#FFFFFF" style={styles.chatIcon} />
              </TouchableOpacity>
            </View>
       </View>
     
      <Card.Content style={styles.cardContent}>
       
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon source="clipboard" size={20} color="gray" />
            <Text style={styles.detail}><Text style={styles.bold}>Case ID: </Text> {caseId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon source="phone" size={20} color="gray" />
            <Text style={styles.detail}><Text style={styles.bold}>Contact No: </Text> {contactNo}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon source="alarm" size={20} color="gray" />
            <Text style={styles.detail}><Text style={styles.bold}>Alarm Raised On: </Text> {moment(alarmRaisedOn).format("DD MMM YYYY, hh:mm A")}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon source="account" size={20} color="gray" />
            <Text style={styles.detail}><Text style={styles.bold}>Accepted By: </Text> {acceptedBy || "N/A"}</Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button mode="contained" icon="plus" buttonColor="#2E8B57" textColor="#FFFFFF" onPress={() => console.log("Chat Pressed")}>
          Add Details
        </Button>
        <Button mode="contained" icon="eye" buttonColor="#2E8B57" textColor="#FFFFFF" onPress={() => console.log("View Details Pressed")}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: "#F0FFF0",
    borderRadius: 8,
    padding: 0,
    shadowColor: "#A8E6A2",
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
    color:'#FFFFFF',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: "100%",
  },
  hospitalName: {
    fontSize: 20,
    color:'#FFFFFF',
    fontWeight: "bold",
    marginLeft: 5,
    flex: 1,
    fontFamily:'Exo2-VariableFont_wght'
  },
  chatIcon: {
    marginLeft: "auto",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between',
    marginBottom: 10,
    paddingBottom:5,
    width: "100%",
  },
  statusWithTimer: {
    paddingLeft:12,
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
    fontSize: 12,
  },
  iconTimer:{
     backgroundColor:'white'
  },
  statusContainer: {
    backgroundColor:'white',
    height:30,
    width:110,
    borderRadius:15,
    flexDirection: "row",
    justifyContent:'center',
    alignItems: "center",

  },
  timerContainer: {
    backgroundColor:'white',
    height:30,
    width:110,
    borderRadius:15,
    flexDirection: "row",
    justifyContent:'center',
    alignItems: "center",

  },
  timer: {
    fontSize: 14,
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
    marginBottom: 10,
  },
  detail: {
    fontSize: 17,
    color: "#263238",
    marginLeft: 8,
    fontFamily: "serif",
  },
  bold: {
    color:'gray'
  },
  actions: {
    width:'100%',
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  touchableStyle:{
    paddingRight:10
  }
});



const caseData = {
  hospitalName: "City Hospital",
  status: "Emergency",
  caseId: "CH12345",
  contactNo: "+1 234 567 890",
  alarmRaisedOn: new Date(),
  acceptedBy: "Dr. Smith",
  caseRaisedTime: new Date(new Date().getTime() - 30 * 60 * 1000), // 30 minutes ago
};

export default function App() {
    return (
        <HospitalCaseCard caseData={caseData} />
    );
}
