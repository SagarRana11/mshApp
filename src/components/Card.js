import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

const rightContent = props =><View style={styles.statusbar}><Text style={styles.statusStyles}>Active</Text></View> 


const CalcificCard = () => (
  <Card>
    <Card.Title title="Mount Sinai Queens" subtitle="Card Subtitle" right={rightContent}  />
    <Card.Content>
      <Text variant="titleLarge">Card title</Text>
      <Text variant="bodyMedium">Card content</Text>
    </Card.Content>
    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
    statusbar:{
        backgroundColor:'orange',
        width:100,
        height:25,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15,
        marginRight:10

    },
    statusStyles:{
        fontSize:18,
        color:'white    '
    }
})

export default CalcificCard;

