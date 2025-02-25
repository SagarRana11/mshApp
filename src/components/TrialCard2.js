import React from "react";
import { View } from "react-native";
import { Card, Title, Paragraph, Button, Divider, Avatar, IconButton } from "react-native-paper";
import moment from "moment";
import { Text } from "react-native-paper";

const MedicalCaseCard = ({ caseData }) => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Card 
        style={{ 
          backgroundColor: "#E3F2FD", // Light Blue
          borderRadius: 16, 
          elevation: 8, 
          shadowColor: "#90CAF9" 
        }}
      >
        {/* Card Header */}
        <Card.Title
          title={caseData.caseName}
          titleStyle={{ color: "#1B4F72", fontSize: 22, fontWeight: "bold" }}
          subtitle={`Status: ${caseData.status}`}
          subtitleStyle={{ 
            color: caseData.status === "Critical" ? "#D32F2F" : "#2E7D32", // Red for critical, Green for stable
            fontSize: 16 
          }}
          left={(props) => <Avatar.Icon {...props} icon="medical-bag" style={{ backgroundColor: "#A5D6A7" }} />}
          right={(props) => (
            <IconButton 
              {...props} 
              icon="dots-horizontal" 
              onPress={() => alert("More options")} 
            />
          )}
        />

        <Divider style={{ backgroundColor: "#B3E5FC", marginHorizontal: 16, marginBottom: 10 }} />

        {/* Case Details */}
        <Card.Content>
          <Paragraph style={{ color: "#2B2D42", fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Raised On: </Text> 
            {moment(caseData.raisedTime).format("DD MMM YYYY, hh:mm A")}
          </Paragraph>

          <Paragraph style={{ color: "#2B2D42", fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Patient Age: </Text> {caseData.age} years
          </Paragraph>

          <Paragraph style={{ color: "#2B2D42", fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Diagnosis: </Text> {caseData.diagnosis}
          </Paragraph>

          <Paragraph style={{ color: "#2B2D42", fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Doctor Assigned: </Text> Dr. {caseData.doctorAssigned}
          </Paragraph>

          <Paragraph style={{ 
            color: caseData.severity === "High" ? "#D32F2F" : "#388E3C", 
            fontSize: 16, fontWeight: "bold" 
          }}>
            <Text style={{ fontWeight: "bold" }}>Severity Level: </Text> {caseData.severity}
          </Paragraph>
        </Card.Content>

        {/* Actions Section */}
        <Divider style={{ backgroundColor: "#B3E5FC", marginVertical: 10 }} />
        <Card.Actions style={{ justifyContent: "space-between", paddingHorizontal: 10 }}>
          <Button 
            mode="outlined" 
            textColor="#1565C0"
            style={{ borderRadius: 8, borderColor: "#1565C0" }} 
            onPress={() => alert("More Details")}
          >
            More Details
          </Button>

          <Button 
            mode="contained" 
            buttonColor="#2E7D32" 
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
