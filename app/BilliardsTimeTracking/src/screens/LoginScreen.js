// Import React and Component
import React, {useState, createRef, useEffect} from 'react'
import { StyleSheet, TextInput, View, Text, ScrollView, Image, Keyboard, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import Loader from './components/Loader'
import { navigate } from '../RootNavigation'
import { useDispatch, useSelector } from 'react-redux'
import { Signin, SigninFacebook, SigninGoogle } from '../hooks/user'
import { stopLoading } from '../stores/actions/general'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'

const LoginScreen = () => {
  const user = useSelector(state => state.user)
  const general = useSelector(state => state.general)
  const dispatch = useDispatch()
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const passwordInputRef = createRef();

  const getResponseInfo = (error, result) => {
    if(error) 
    {
      alert('Error fetching data')
      console.error('Error fetching data: ', error.toString())
    } 
    else 
    {
      console.log("Signin infors: ", JSON.stringify(result))
      SigninFacebook(dispatch, {email: result.email, facebookId: result.id, name: result.name, avatar: result.picture.data.url}).catch(err => console.error(err.message))
    }
  }

  const loginFacebook = async () => {
    try 
    {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email'])
      if(result.isCancelled)
        alert('Login was cancelled')
      else 
        AccessToken.getCurrentAccessToken().then(async data => {
          // console.log(data.accessToken.toString())
          await AccessToken.refreshCurrentAccessTokenAsync()
          const processRequest = new GraphRequest(
            '/me?fields=name,email,picture.type(large)',
            null,
            getResponseInfo,
          )

          // Start the graph request.
          new GraphRequestManager().addRequest(processRequest).start()
        }).catch(error => {
          alert('Login failed! ' + error.message)
          console.error(error.message)
        })
    }
    catch (error) {
      alert("Login failed! " + error.message)
      console.log('Login failed with error: ' + error.message)
    }
  }

  const loginGoogle = async () => {
    try 
    {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      
      const userInfors = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(userInfors.idToken);
      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential)

      console.log("Signin infors: ", JSON.stringify(userInfors))
      SigninGoogle(dispatch, {email: userInfors.user.email, googleId: userInfors.user.id, name: userInfors.user.name, avatar: userInfors.user.photo}).catch(err => console.error(err.message))
    }
    catch(error) 
    {
      console.error(error.message)
      switch(error.code)
      {
        case statusCodes.SIGN_IN_CANCELLED:
          alert('You cancelled the login flow.')
          break
        case statusCodes.IN_PROGRESS:
          alert('Signing in ...')
          break
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          alert('Goodle play services not available or outdated!')
          break
        default: 
          alert(error.message)
          break
      }
    }
  }

  useEffect(() => {
    dispatch(stopLoading())
  }, [general.isLoading])

  return (
    <View style={styles.mainBody}>
      <Loader loading={general.isLoading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          // flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../images/logo.png')}
                style={{
                  width: '50%',
                  height: 100,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) => setUserEmail(UserEmail)}
                placeholder="Enter Email" //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                placeholder="Enter Password" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {user.errorMessage != '' ? (
              <Text style={styles.errorTextStyle}> {user.errorMessage} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => Signin(dispatch, {email: userEmail, password: userPassword}).catch(err => console.error(err.message))}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.buttonStyle, backgroundColor: "#2572e6" }}
              activeOpacity={0.5}
              onPress={loginFacebook}>
              <Text style={styles.buttonTextStyle}>LOGIN WITH FACEBOOK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.buttonStyle, backgroundColor: "#f11a1a" }}
              activeOpacity={0.5}
              onPress={loginGoogle}
              >
              <Text style={styles.buttonTextStyle}>LOGIN WITH GOOGLE</Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigate('RegisterScreen')}>
              New Here ? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#0cb50c',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: '#080808',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#0cb50c',
  },
  registerTextStyle: {
    color: '#32cd32',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});
