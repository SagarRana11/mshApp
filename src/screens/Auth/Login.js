import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-native'
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native'
import { login } from '../../services'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(()=>{
    const doesUserExists = async()=>{
      try {
        const token = await AsyncStorage.getItem('loggedUserToken');
        console.log('token--------->', token)
        if(token){
          navigate('/')
        }
      } catch (error) {
        console.error("error", error)
      }

    }
    doesUserExists()
  },[])
  const handleSubmit =async()=>{
    const loginData = await login({email, password}, navigate);
    // console.log("logindata---------------------------->", loginData);
    // console.log("here",email,password);
  }
  return (
    <View style={styles.container}>
       <Text style={styles.title}>Login Form</Text>
       <TextInput
         style={styles.inputStyle}
         placeholder='your email here'
         value={email}
         onChangeText={setEmail}
         keyboardType='email-address'
         
       />

       <TextInput
         style={styles.inputStyle}
         placeholder='your password here'
         value={password}
         onChangeText={setPassword}
        
       />

       <Button onPress={handleSubmit} title='Submit'/>
    </View>
  )
}

const styles = StyleSheet.create({
    text:{
        fontSize: 20,
        color: 'blue'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    inputStyle : {
        display : "flex",
        justifyContent: 'center',
        alignItems: "center",
        borderWidth : 2,
        width : 300,
        height : 60,
        marginBottom : 10
    },
    title: {
        fontSize : 20,
        fontWeight : 400,
        marginBottom : 20
    }
})


export default Login