import React,{useState} from 'react'
import { Text,View,Image, StyleSheet,  Button, Pressable, TouchableOpacity, Linking,ImageBackground,KeyboardAvoidingView,TouchableWithoutFeedback, Platform, Keyboard } from 'react-native'
import { TextInput } from 'react-native-paper';
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
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validEmail, setValidEmail] = useState(false);


  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email){
      setEmailError('please enter your email id ')
      return
    }
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      setValidEmail(false)
    } else {
      setEmailError('');
      setValidEmail(true);
    }
  };

  const validatePassword =()=>{
    if(!password){
      setPasswordError('Please enter your password')
      return
    }else{
      setPasswordError('');
    }
  }
  return (
    <ImageBackground
      source={require('../../assets/images/imageBack6.jpg')} 
      style={styles.background}
    >
      <KeyboardAvoidingView style={{width:'100%'}}
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>

            <View style={styles.displaylogo}>
              <Image 
                  source={require('../../assets/images/navHeaderLogo.png')}
                  resizeMode='contain'
                  style={{width:'120%'}}
                />
            </View>   
            <View style={styles.formContainer}>
            
              <View style={styles.welcomeBox}>
                <Text style={{fontSize:35,fontFamily:'Exo2-Italic-VariableFont_wght', color:'#2E8B57',marginBottom:5}}>Welcome Back</Text>
                <Text style={{marginBottom:4, marginBottom:15, fontSize:18, color:'gray'}}>Sign in to continue</Text>
              </View>

              <View style={styles.loginForm}>
                <TextInput 
                  value={email}
                  label='email'
                  placeholder='enter your email'
                  mode='outlined'
                  outlineColor='green'
                  activeOutlineColor="green" 
                  onBlur={validateEmail}
                  onChangeText={setEmail}
                  style={[styles.textInput,{width:'95%'}]}
                  theme={{
                    colors: {
                      onSurfaceVariant: 'gray',
                      // Placeholder color
                    }
                  }}
                  right={
                    <TextInput.Icon
                      icon={validEmail? "check" : ""}
                      color='green'
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  }
                />

                {emailError && <ShowError errorTextMessage={emailError} />}

                <TextInput 
                  value={password}
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
                  onChangeText={setPassword}
                  style={[styles.textInput,{width:'95%',color:'green'}]}
                  onBlur={validatePassword}
                  secureTextEntry={!passwordVisible}
                  right={
                    <TextInput.Icon
                      icon={passwordVisible ? "eye-off" : "eye"}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  }
                /> 
                {passwordError && <ShowError errorTextMessage={passwordError} />}

                <Pressable style={styles.loginButton} title='Login' >
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
    fontFamily : 'Exo2-VariableFont_wght',
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
    backgroundColor: '#2E8B57',
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

export default LoginForm;
