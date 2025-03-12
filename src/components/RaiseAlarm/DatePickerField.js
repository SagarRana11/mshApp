import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
const DatePickerField = ({formik, name, title}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateChange = text => {
    let formattedText = text.replace(/[^0-9]/g, ''); // Allow only numbers

    // Auto-insert slashes as the user types
    if (formattedText.length > 2) {
      formattedText = formattedText.slice(0, 2) + '/' + formattedText.slice(2);
    }
    if (formattedText.length > 5) {
      formattedText = formattedText.slice(0, 5) + '/' + formattedText.slice(5);
    }
    if (formattedText.length > 10) {
      formattedText = formattedText.slice(0, 10); // Limit to 10 characters
    }

    formik.setFieldValue(name, formattedText);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDatePicker}>
        <TextInput
          label="Date Of Birth"
          placeholder="Enter Date (DD/MM/YYYY)"
          mode="outlined"
          outlineColor="#2978A0"
          activeOutlineColor="#2978A0"
          value={formik.values[name]}
          onChangeText={handleDateChange}
          keyboardType="numeric"
          maxLength={10}
          style={[styles.textInput]}
          onBlur={formik.handleBlur('DOB')}
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
              value={formik.values.name}
              // style={styles.input}
              onPress={showDatePicker}
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

            console.log('------->', date);
            setDatePickerVisibility(false);
            formik.setFieldValue(
              name,
              date.toISOString().split('T')[0]
            );
            console.log(
              'date now---->',
              date.toISOString().split('T')[0]
            );
          }}
          onCancel={hideDatePicker}
          mode="date"
          inline
          maximumDate={null}
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

export default DatePickerField;
