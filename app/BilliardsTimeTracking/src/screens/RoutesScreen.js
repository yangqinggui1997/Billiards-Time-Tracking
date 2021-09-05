// Import React
import React, { useEffect } from 'react'

// Import component
import CustomSidebarMenu from './components/CustomSidebarMenu'
import NavigationHeaderLeft from './components/NavigationHeaderLeft'

// Import Screens
import HomeScreen from './HomeScreen'
import SettingsScreen from './SettingScreen'
import SplashScreen from 'react-native-splash-screen'
import BranchScreen from './BranchScreen'
import TableScreen from './TableScreen'
import UserScreen from './UserScreen'
import CustomerScreen from './CustomerScreen'
import CustomerLevelScreen from './CustomerLevelScreen'
import CategoryScreen from './CategoryScreen'
import ProductScreen from './ProductScreen'
import BillScreen from './BillScreen'
import StatisticsScreen from './StatisticsScreen'
import CouponScreen from './CouponScreen'
import ProfileScreen from './ProductScreen'
import NotificationScreen from './NotificationScreen'
import CallScreen from './CallScreen'
import ChatScreen from './ChatScreen'

import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

const HomeScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerRight: () => {

          },
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          }
        }}
      />
    </Stack.Navigator>
  )
}

const BranchScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="BranchScreen">
      <Stack.Screen
        name="BranchScreen"
        component={BranchScreen}
        options={{
          title: 'Branchs', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          }
        }}
      />
    </Stack.Navigator>
  )
}

const TableScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="TableScreen">
      <Stack.Screen
        name="TableScreen"
        component={TableScreen}
        options={{
          title: 'Tables', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          }
        }}
      />
    </Stack.Navigator>
  )
}

const UserScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="UserScreen">
      <Stack.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          title: 'Users', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          }
        }}
      />
    </Stack.Navigator>
  )
}

const CustomerScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="CustomerScreen">
      <Stack.Screen
        name="CustomerScreen"
        component={CustomerScreen}
        options={{
          title: 'Customers', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const CustomerLevelScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="CustomerLevelScreen">
      <Stack.Screen
        name="CustomerLevelScreen"
        component={CustomerLevelScreen}
        options={{
          title: 'Customer levels', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const CategoryScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="CategoryScreen">
      <Stack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{
          title: 'Categories', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const ProductScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="ProductScreen">
      <Stack.Screen
        name="ProductScreen"
        component={ProductScreen}
        options={{
          title: 'Products', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const BillScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="BillScreen">
      <Stack.Screen
        name="BillScreen"
        component={BillScreen}
        options={{
          title: 'Bills', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const StatisticsScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="StatisticsScreen">
      <Stack.Screen
        name="StatisticsScreen"
        component={StatisticsScreen}
        options={{
          title: 'Statistics', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const CouponScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="CouponScreen">
      <Stack.Screen
        name="CouponScreen"
        component={CouponScreen}
        options={{
          title: 'Coupon - Voucher', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const ProfileScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const SettingScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="SettingsScreen">
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const NotificationScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="NotificationScreen">
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          title: 'Notifications', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const CallScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="CallScreen">
      <Stack.Screen
        name="CallScreen"
        component={CallScreen}
        options={{
          title: 'Calls', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const ChatScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="ChatScreen">
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          title: 'Chats', //Set Header Title
          headerLeft: () => (
            <NavigationHeaderLeft navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#0078d4', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

const RoutesScreen = (props) => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomSidebarMenu {...props}/>}
      >
      <Drawer.Screen
        name="HomeScreenStack"
        options={{drawerLabel: 'Home', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={HomeScreenStack}
      />
      <Drawer.Screen
        name="BranchScreenStack"
        options={{drawerLabel: 'Branchs', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={BranchScreenStack}
      />
      <Drawer.Screen
        name="TableScreenStack"
        options={{drawerLabel: 'Tables', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={TableScreenStack}
      />
      <Drawer.Screen
        name="UserScreenStack"
        options={{drawerLabel: 'Users', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={UserScreenStack}
      />
      <Drawer.Screen
        name="CustomerScreenStack"
        options={{drawerLabel: 'Customers', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={CustomerScreenStack}
      />
      <Drawer.Screen
        name="CustomerLevelScreenStack"
        options={{drawerLabel: 'Customers', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={CustomerLevelScreenStack}
      />
      <Drawer.Screen
        name="CategoryScreenStack"
        options={{drawerLabel: 'Categories', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={CategoryScreenStack}
      />
      <Drawer.Screen
        name="ProductScreenStack"
        options={{drawerLabel: 'Products', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={ProductScreenStack}
      />
      <Drawer.Screen
        name="BillScreenStack"
        options={{drawerLabel: 'Bills', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={BillScreenStack}
      />
      <Drawer.Screen
        name="StatisticsScreenStack"
        options={{drawerLabel: 'Statistics', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={StatisticsScreenStack}
      />
      <Drawer.Screen
        name="CouponScreenStack"
        options={{drawerLabel: 'Coupon - Voucher', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={CouponScreenStack}
      />
      <Drawer.Screen
        name="ProfileScreenStack"
        options={{drawerLabel: 'Profile', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={ProfileScreenStack}
      />
      <Drawer.Screen
        name="SettingScreenStack"
        options={{drawerLabel: 'Settings', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={SettingScreenStack}
      />
      <Drawer.Screen
        name="NotificationScreenStack"
        options={{drawerLabel: 'Notifications', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={NotificationScreenStack}
      />
      <Drawer.Screen
        name="CallScreenStack"
        options={{drawerLabel: 'Calls', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={CallScreenStack}
      />
      <Drawer.Screen
        name="ChatScreenStack"
        options={{drawerLabel: 'Chats', drawerActiveBackgroundColor: '#0b7ed6', drawerLabelStyle: {color: '#ffffff'}}}
        component={ChatScreenStack}
      />
    </Drawer.Navigator>
  );
}

export default RoutesScreen
