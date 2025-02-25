import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
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
      <View style={{ backgroundColor: "#87CEFA"}}>
                  <View style={styles.headerBackground}>
                      <Text style={styles.hospitalName}>{hospitalName}</Text>
                      <Button style={styles.buttonStyle} mode="outlined" icon="chat" buttonColor="#E3F2FD" textColor="black" onPress={() => console.log("Chat Pressed")}>
                        Chat
                      </Button>
                  </View>
                  <View style={styles.statusRow}>
                  <View style={styles.statusWithTimer}>
                      <Chip mode="outlined" style={styles.statusChip} textStyle={styles.statusText}>
                      {status}
                      </Chip>
                      <View style={styles.timerContainer}>
                        <Icon source="timer" size={20} color="red" style={styles.iconTimer} />
                        <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
                      </View>
                      <Button style={{marginLeft:33}} mode="outlined" icon="video" buttonColor="#E3F2FD" textColor="black" onPress={() => console.log("Chat Pressed")}>
                        video call
                      </Button>
                  </View>
                  </View>
             </View>

      
      <Card.Content style={styles.cardContent}>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon source="identifier" size={20} color="#87CEFA" />
            <Text style={styles.detail}><Text style={styles.bold}>Case ID:</Text> {caseId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon source="phone" size={20} color="#87CEFA" />
            <Text style={styles.detail}><Text style={styles.bold}>Contact No:</Text> {contactNo}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon source="alarm" size={20} color="#87CEFA" />
            <Text style={styles.detail}><Text style={styles.bold}>Alarm Raised On:</Text> {moment(alarmRaisedOn).format("DD MMM YYYY, hh:mm A")}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon source="account" size={20} color="#87CEFA" />
            <Text style={styles.detail}><Text style={styles.bold}>Accepted By:</Text> {acceptedBy || "N/A"}</Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button mode="contained" icon="chat" buttonColor="#E3F2FD" textColor="black" onPress={() => console.log("Chat Pressed")}>
          Chat
        </Button>
        <Button mode="contained" icon="eye" buttonColor="#E3F2FD" textColor="black" onPress={() => console.log("View Details Pressed")}>
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    width:'95%'
  },
  cardContent: {
    paddingHorizontal: 10,
    width: "100%",
  },
  headerBackground: {
    backgroundColor: "#87CEFA",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: "100%",
  },
  headerContent: {
    flex: 1,
    marginLeft: 10,
  },
  hospitalName: {
    fontSize: 20,
    color:'black',
    fontWeight: "bold",
    marginLeft: 5,
    flex: 1,
  },
  chatIcon: {
    marginLeft: "auto",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  statusWithTimer: {
    paddingLeft:12,
    flexDirection: "row",
    justifyContent:'flex-end',
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
    color: "#87CEFA",
    fontWeight: "bold",
    fontSize: 12,
  },
  timerContainer: {
    borderWidth:1,
    borderColor:'gray',
    backgroundColor: "#E3F2FD",
    width:120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'center',
    borderRadius:15,
    padding:3,
  },
  timer: {
    fontSize: 14,
    color: "red",
    marginLeft: 5,
  },
  detailsContainer: {
    marginTop: 10,
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    color: "#263238",
    marginLeft: 8,
    fontFamily: "serif",
  },
  bold: {
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    width: "100%",
  },
  buttonStyle:{
    width:20,
    backgroundColor:'white'
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
  