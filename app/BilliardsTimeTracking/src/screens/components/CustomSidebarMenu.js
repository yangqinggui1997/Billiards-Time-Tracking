// Import React and Component
import React from 'react'
import {View, Text, Alert, StyleSheet, Image} from 'react-native'
import {DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer'
import { useDispatch, useSelector } from 'react-redux'
import { Signout } from '../../hooks/user'

const CustomSidebarMenu = (props) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const logout = () => {
    props.navigation.toggleDrawer()
    Alert.alert(
      'Logout',
      'Are you sure? You want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Confirm',
          onPress: () => {
            Signout(dispatch, user.infors.login.typeLogin).catch(err => console.error(err.message))
          },
        },
      ],
      {cancelable: false},
    )
  }
  return user.infors ?
  (
    <View style={stylesSidebar.sideMenuContainer}>
      <View style={stylesSidebar.profileHeader}>
        <View style={stylesSidebar.profileHeaderPicCircle}>
          <Image source={{uri: user.infors.login.avatar}} style={{width: '100%', height: '100%'}}/> 
        </View>
        <Text style={stylesSidebar.profileHeaderText}>{user.infors.login.name}</Text>
      </View>
      <View style={stylesSidebar.profileHeaderLine} />

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props}/>
        <DrawerItem
          label={() => <Text style={{color: '#ffffff'}}>Sign out</Text>}
          onPress={logout}
          
        />
      </DrawerContentScrollView>
    </View>
  )
  :
  null
}

export default CustomSidebarMenu

const stylesSidebar = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0078d4',
    paddingTop: 10,
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: '#0b7ed6',
    padding: 15,
    textAlign: 'center',
  },
  profileHeaderPicCircle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  profileHeaderText: {
    color: '#ffffff',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#e2e2e2',
    marginTop: 15,
  }
})
