import React,{useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text,View,Image, StyleSheet,  Button, Pressable, TouchableOpacity, Linking,ImageBackground,KeyboardAvoidingView,TouchableWithoutFeedback, Platform, Keyboard } from 'react-native'
import { TextInput } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { login } from '../../services'
import { useNavigate } from 'react-router-native';
import { useMutation } from '@tanstack/react-query';
import {LinearGradient} from 'react-native-linear-gradient'
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon
const Link =()=>{
  const handlePress=(url)=> Linking.openURL(url);
  return(
    <View style={{flexDirection:'row', justifyContent:'space-between', width:'95%',marginLeft:1}}>
      <TouchableOpacity onPress={()=>handlePress('/about')}>
        <Text style={{color:'gray', fontSize:18}}>About</Text> 
      </TouchableOpacity>
      <TouchableOpacity  onPress={()=>handlePress('/forget-passsword')}>
        <Text style={{color:'gray', fontSize:18}}>Forgot password?</Text> 
      </TouchableOpacity>
      
    </View>
   
  )
}

const ShowError=({errorTextMessage})=>{
  return (
    <Text style={styles.errorMessageStyle}>
       {errorTextMessage}
    </Text>
  )
}
const LoginFormFake = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    const doesUserExists = async()=>{
      try {
        const token = await AsyncStorage.getItem('loggedUserToken');
        console.log('token--------->', token)
        if(token){
          navigate('/home')
        }
      } catch (error) {
        console.error("error", error)
      }

    }
    doesUserExists()
  },[])

  // useEffect(()=>{
  //   const logout =async()=>{
  //     await AsyncStorage.removeItem('loggedUserToken');
  //   }
  //   logout()
  // },[])

  const [passwordVisible, setPasswordVisible] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required('Required'),
    password:Yup.string()
        .min(4, "Password must be six character long")   
        .required('Required') 
  })


    const loginMutation = useMutation({
        mutationFn: async (values) => {
           return await login(values); // Call your login API
        },
        onSuccess: (data) => {
           console.log("Login successful:", data);
           navigate("/home"); // Navigate to home screen after login
        },
        onError: (error) => {
           console.error("Login failed:", error);
        }
    });


  const formik = useFormik({
    initialValues:{
        email:'',
        password:''
    },
    onSubmit: (values) => {
        loginMutation.mutate(values); // Call mutation on submit
    },
    validationSchema,
  })
  return(
    <LinearGradient
      colors={['white','#a8e2fd']} 
      locations={[0, 1]}
      style={[styles.gradient,styles.background ]}
      start={{ x: 0, y: 0 }} // Start from left (0)
      end={{ x: 1, y: 0 }}   // End at right (1)
    >
      <KeyboardAvoidingView style={{width:'100%'}}
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>

            <View style={styles.displaylogo}>
              <Image 
                  source={require('../../../assets/images/navHeaderLogo.png')}
                  resizeMode='contain'
                  style={{width:'120%'}}
                />
            </View>   
            <View style={styles.formContainer}>
            
              <View style={styles.welcomeBox}>
                <Text style={{fontSize:35,fontFamily:'Exo2-Italic-VariableFont_wght', color:'black',marginBottom:5}}>Welcome Back</Text>
                <Text style={{marginBottom:4, marginBottom:15, fontSize:18, color:'gray'}}>Sign in to continue</Text>
              </View>

              <View style={styles.loginForm}>
               
                <TextInput 
                  value={formik.values.email}
                  label='email'
                  placeholder='enter your email'
                  mode='outlined'
                  outlineColor='#67c9fd'
                  activeOutlineColor="#67c9fd" 
                  onBlur={formik.handleBlur('email')}
                  onChangeText={formik.handleChange('email')}
                  style={[styles.textInput,{width:'95%'}]}
                  theme={{
                    colors: {
                      onSurfaceVariant: 'gray',
                      // Placeholder color
                    }
                  }}
                  right={
                    <TextInput.Icon
                      icon={formik.values.email && !formik.errors.email && "check"}
                      color='#67c9fd'
                    />
                  }
                />
                {formik.touched.email && formik.errors.email && <ShowError errorTextMessage={formik.errors.email} />}
                {/* {emailError && <ShowError errorTextMessage={emailError} />} */}

                <TextInput 
                  value={formik.values.password}
                  label='password'
                  mode='outlined'
                  placeholder='enter your password'
                  outlineColor='#67c9fd'
                  activeOutlineColor="#67c9fd" 
                  theme={{
                    colors: {
                      onSurfaceVariant: 'gray',
                      // Placeholder color
                    }

                  }}
                  onChangeText={formik.handleChange('password')}
                  style={[styles.textInput,{width:'95%',color:'green'}]}
                  onBlur={formik.handleBlur('password')}
                  secureTextEntry={!passwordVisible}
                  right={
                    <TextInput.Icon
                      icon={passwordVisible ? "eye-off" : "eye"}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  }
                /> 
                {formik.touched.password && formik.errors.password && <ShowError errorTextMessage={formik.errors.password} />}
                <Pressable style={styles.loginButton} onPress={formik.handleSubmit}>
                  <Text style={{color:'black', fontSize:18}}>Login</Text>
                </Pressable>

                <Link/>
              </View>  

            </View> 

          </View>

        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

    </LinearGradient>
  )
  
  return (
    <ImageBackground
      source={require('../../../assets/images/imageBack6.jpg')} 
      style={styles.background}
    >
      <KeyboardAvoidingView style={{width:'100%'}}
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>

            <View style={styles.displaylogo}>
              <Image 
                  source={require('../../../assets/images/navHeaderLogo.png')}
                  resizeMode='contain'
                  style={{width:'120%'}}
                />
            </View>   
            <View style={styles.formContainer}>
            
              <View style={styles.welcomeBox}>
                <Text style={{fontSize:35,fontFamily:'Exo2-Italic-VariableFont_wght', color:'#3CB371',marginBottom:5}}>Welcome Back</Text>
                <Text style={{marginBottom:4, marginBottom:15, fontSize:18, color:'gray'}}>Sign in to continue</Text>
              </View>

              <View style={styles.loginForm}>
               
                <TextInput 
                  value={formik.values.email}
                  label='email'
                  placeholder='enter your email'
                  mode='outlined'
                  outlineColor='green'
                  activeOutlineColor="green" 
                  onBlur={formik.handleBlur('email')}
                  onChangeText={formik.handleChange('email')}
                  style={[styles.textInput,{width:'95%'}]}
                  theme={{
                    colors: {
                      onSurfaceVariant: 'gray',
                      // Placeholder color
                    }
                  }}
                  right={
                    <TextInput.Icon
                      icon={formik.values.email && !formik.errors.email && "check"}
                      color='green'
                    />
                  }
                />
                {formik.touched.email && formik.errors.email && <ShowError errorTextMessage={formik.errors.email} />}
                {/* {emailError && <ShowError errorTextMessage={emailError} />} */}

                <TextInput 
                  value={formik.values.password}
                  label='password'
                  mode='outlined'
                  placeholder='enter your password'
                  outlineColor='green'
                  activeOutlineColor="green" 
                  theme={{
                    colors: {
                      onSurfaceVariant: 'gray',
                      // Placeholder color
                    }

                  }}
                  onChangeText={formik.handleChange('password')}
                  style={[styles.textInput,{width:'95%',color:'green'}]}
                  onBlur={formik.handleBlur('password')}
                  secureTextEntry={!passwordVisible}
                  right={
                    <TextInput.Icon
                      icon={passwordVisible ? "eye-off" : "eye"}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  }
                /> 
                {formik.touched.password && formik.errors.password && <ShowError errorTextMessage={formik.errors.password} />}
                <Pressable style={styles.loginButton} onPress={formik.handleSubmit}>
                  <Text style={{color:'white', fontSize:18}}>Login</Text>
                </Pressable>

                <Link/>
              </View>  

            </View> 

          </View>

        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

  
      
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  gradient:{flex:1},
  background: {
    flex: 1,
    resizeMode: 'cover', // cover, contain, stretch
    justifyContent: 'center',
    alignItems: 'center',
  },
  container :{
    width:'100%',
    
    justifyContent:'center',
    alignItems:'center'
  },
  formContainer:{justifyContent:'center', alignItems:'center',width:'80%',marginLeft:30},
  header:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width: '100%',
  },
  logoView :{
    width : 100,
    height : 100,
    borderRadius : '50%',
    justifyContent:'center',
    alignItems:'center',
  },
  logo :{
    width:'80%',
    height:'80%'
  },
  nameBox :{
    marginLeft:10,
  }, 
  hospitalName:{
    fontFamily : 'Poppins-LightItalic',
    fontWeight:600,
    fontSize: 35,
  },
  tagline:{
  
    fontSize : 13,
    fontFamily : "Archivo-Italic-VariableFont_wdth,wght"
  },
  displayPictureView :{
    borderRadius : 3,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white'
  },
  displaylogo :{
    width : 150,
    height : 50,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:50,
  },
  welcomeBox:{
    width : '100%',
    alignItems : 'flex-start',
    justifyContent: 'flex-start'
  },
  loginForm :{
    width:'100%',
    paddingBottom:20
  },
  textInput:{
    color:'green',
    fontSize:15,
    width:'85%',
    marginBottom:10,
  },

  loginButton:{
    justifyContent:'center',
    alignItems:'center',
    width: '95%',
    height:50,
    backgroundColor: '#67c9fd',
    marginTop:20,
    marginBottom: 50,
    borderRadius: 5,
    color: 'red',
    shadowColor: 'white', // Green shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  text:{marginBottom:15, fontSize:20, color:'gray'},
  errorMessageStyle:{
    color:'red',
    fontSize:15,
    marginBottom:5,
    paddingLeft:5
  },
  iconButton: {
    padding: 10,
  },

})

export default LoginFormFake;
