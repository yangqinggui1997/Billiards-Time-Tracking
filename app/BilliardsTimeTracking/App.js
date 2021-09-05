// Import React and Component
import React from 'react'

// Import Navigators from React Navigation
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
// import 'react-native-gesture-handler'

// Import Screens
import SplashScreenHome from './src/screens/SplashScreenHome'
import AuthScreen from './src/screens/AuthScreen'
import RoutesScreen from './src/screens/RoutesScreen'

// Import Redux
import { combineReducers, createStore } from 'redux'

// Import Redux Provider
import { Provider } from 'react-redux'

// Import Reducers
import userReducer from './src/stores/reducers/user'
import generalReducer from './src/stores/reducers/general'

// Import navigationRef
import { navigationRef } from './src/RootNavigation'

import { SafeAreaProvider } from 'react-native-safe-area-context'

const rootReducer = combineReducers({
  general: generalReducer,
  user: userReducer 
})

const store = createStore(rootReducer)

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="SplashScreenHome">
          {/* SplashScreen which will come once for 5 Seconds */}
          <Stack.Screen
            name="SplashScreenHome"
            component={SplashScreenHome}
            // Hiding header for Splash Screen
            options={{headerShown: false}}
          />
          {/* Auth Navigator which includer Login Signup will come once */}
          <Stack.Screen
            name="AuthScreen"
            component={AuthScreen}
            options={{headerShown: false}}
          />
          {/* Navigation Drawer as a landing page */}
          <Stack.Screen
            name="RoutesScreen"
            component={RoutesScreen}
            // Hiding header for Navigation Drawer as we will use our custom header
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default () => {
  return <Provider store={store}>
    <App/>
  </Provider>
}