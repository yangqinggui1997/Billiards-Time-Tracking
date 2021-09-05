import React, {useState, useEffect} from 'react'
import SplashScreen from 'react-native-splash-screen'
import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'

import {createStackNavigator} from '@react-navigation/stack'

const Stack = createStackNavigator()

const AuthScreen = () => {
    // Stack Navigator for Login and Sign up Screen
    useEffect(() => {
        SplashScreen.hide()
    }, [])
    return (
        <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{
                    title: 'Register', //Set Header Title
                    headerStyle: {
                        backgroundColor: '#307ecc', //Set Header color
                    },
                    headerTintColor: '#fff', //Set Header text color
                    headerTitleStyle: {
                        fontWeight: 'bold', //Set Header text style
                    },
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthScreen