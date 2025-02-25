import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import moment from "moment";

import { Card, Title, Paragraph, Button, Divider, Avatar, IconButton } from "react-native-paper";

const MedicalCaseCard = ({ caseData }) => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Card 
        style={{ 
          backgroundColor: "#FAFAFA", 
          borderRadius: 16, 
          elevation: 6, 
          shadowColor: "#999" 
        }}
      >
        {/* Card Header */}
        <Card.Title
          title={caseData.caseName}
          titleStyle={{ color: "#2B2D42", fontSize: 22, fontWeight: "bold" }}
          subtitle={`Status: ${caseData.status}`}
          subtitleStyle={{ 
            color: caseData.status === "Critical" ? "#D90429" : "#1D3557", 
            fontSize: 16 
          }}
          left={(props) => <Avatar.Icon {...props} icon="stethoscope" style={{ backgroundColor: "#A8DADC" }} />}
          right={(props) => (
            <IconButton 
              {...props} 
              icon="dots-vertical" 
              onPress={() => alert("More options")} 
            />
          )}
        />

        <Divider style={{ backgroundColor: "#BFC0C0", marginHorizontal: 16, marginBottom: 10 }} />

        {/* Case Details */}
        <Card.Content>
          <Paragraph style={{ color: "#333", fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Raised On: </Text> 
            {moment(caseData.raisedTime).format("DD MMM YYYY, hh:mm A")}
          </Paragraph>

          <Paragraph style={{ color: "#333", fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Patient Age: </Text> {caseData.age} years
          </Paragraph>

          <Paragraph style={{ color: "#333", fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Diagnosis: </Text> {caseData.diagnosis}
          </Paragraph>

          <Paragraph style={{ color: "#333", fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Doctor Assigned: </Text> Dr. {caseData.doctorAssigned}
          </Paragraph>

          <Paragraph style={{ 
            color: caseData.severity === "High" ? "#D90429" : "#457B9D", 
            fontSize: 16, fontWeight: "bold" 
          }}>
            <Text style={{ fontWeight: "bold" }}>Severity Level: </Text> {caseData.severity}
          </Paragraph>
        </Card.Content>

        {/* Actions Section */}
        <Divider style={{ backgroundColor: "#BFC0C0", marginVertical: 10 }} />
        <Card.Actions style={{ justifyContent: "space-between", paddingHorizontal: 10 }}>
          <Button 
            mode="outlined" 
            textColor="#1D3557"
            style={{ borderRadius: 8, borderColor: "#1D3557" }} 
            onPress={() => alert("More Details")}
          >
            More Details
          </Button>

          <Button 
            mode="contained" 
            buttonColor="#1D3557" 
            textColor="white" 
            style={{ borderRadius: 8 }} 
            onPress={() => alert(`Viewing Patient: ${caseData.caseName}`)}
          >
            View Patient
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

// Example Data
const caseExample = {
  caseName: "Heart Arrhythmia",
  status: "Critical",
  raisedTime: "2025-02-22T14:30:00.000Z",
  age: 57,
  diagnosis: "Atrial Fibrillation",
  doctorAssigned: "James Smith",
  severity: "High"
};

// Usage Example
const App = () => {
  return <MedicalCaseCard caseData={caseExample} />;
};

export default App;
