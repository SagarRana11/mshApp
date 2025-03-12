import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
const DateAndTimePickerField = ({formik, name, title}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDateAndTimePicker = () => setDatePickerVisibility(true);
  const hideDateAndTimePicker = () => setDatePickerVisibility(false);


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDateAndTimePicker}>
        <TextInput
          label="Medical Contact"
          placeholder="Enter Date (DD/MM/YYYY) and HH:mm"
          mode="outlined"
          outlineColor="#2978A0"
          activeOutlineColor="#2978A0"
          value={formik.values[name]}
          onPress={showDateAndTimePicker}
          editable={false}
          style={[styles.textInput]}
          onBlur={formik.handleBlur(name)}
          error={formik.touched[name] && formik.errors[name] ? true : false}
          theme={{
            colors: {
              onSurfaceVariant: 'gray',
              // Placeholder color
            },
          }}
          right={
            <TextInput.Icon
              icon="calendar"
              size={30}
              numberOfLines={1}
              editable={false}
              onPress={showDateAndTimePicker}
            />
          }
        />

        <DatePicker
          modal
          value={formik.values[name] ? new Date(formik.values[name]) : new Date()}

          open={isDatePickerVisible}
          date={new Date()}
          onConfirm={date => {
            console.log('onConfirm triggered');
            if (!date) {
              console.warn('Date is undefined or null.');
              return;
            }

            setDatePickerVisibility(false);
            const someDate = moment(date).format('DD/MM/YYYY, HH:mm') //string
            console.log("type of someDate------->", typeof(someDate))
            formik.setFieldValue(
              name,
              date.toISOString(),
            );
            console.log(
              'date ---->',
              date.toISOString()
            );
          }}
          onCancel={hideDateAndTimePicker}
          mode="datetime"
          maximumDate={moment()}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  input: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    color: 'purple',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  container: {
    width: '100%',
  },
  textInput: {
    color: '',
    fontSize: 13,
  },
};

export default DateAndTimePickerField;
