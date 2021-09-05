import React, { useEffect } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { stopLoading } from '../stores/actions/general'
import Loader from './components/Loader'
import { FlatGrid } from 'react-native-super-grid'
import { navigate } from '../RootNavigation'
import { Signout } from '../hooks/user'

const HomeScreen = (props) => {
  const {user, general} = useSelector(state => {return {user: state.user, general: state.general}})

  const dispatch = useDispatch()

  const logout = () => {
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
  const [items, setItems] = React.useState([
    { name: 'BRANCH', code: '#16a085', routeName: 'BranchScreenStack' },
    { name: 'TABLE', code: '#27ae60', routeName: 'TableScreenStack' },
    { name: 'USER', code: '#2980b9', routeName: 'UserScreenStack' },
    { name: 'CUSTOMER', code: '#8e44ad', routeName: 'CustomerScreenStack' },
    { name: 'CUSTOMER LEVELS', code: '#2c3e50', routeName: 'CustomerLevelScreenStack' },
    { name: 'CATEGORY', code: '#f1c40f', routeName: 'CategoryScreenStack' },
    { name: 'PRODUCT', code: '#e67e22', routeName: 'ProductScreenStack' },
    { name: 'BILL', code: '#e74c3c', routeName: 'BillScreenStack' },
    { name: 'STATISTICS', code: '#f39c12', routeName: 'StatisticsScreenStack' },
    { name: 'COUPON', code: '#bdc3c7', routeName: 'CouponScreenStack' },
    { name: 'PROFILE', code: '#7f8c8d', routeName: 'ProfileScreenStack' },
    { name: 'SETTINGS', code: '#1abc9c', routeName: 'SettingScreenStack' },
    { name: 'NOTIFICATION', code: '#2ecc71', routeName: 'NotificationScreenStack' },
    { name: 'SIGN OUT', code: '#3498db', routeName: '' },
    { name: 'CALLS', code: '#9b59b6', routeName: 'CallScreenStack' },
    { name: 'CHATING', code: '#34495e', routeName: 'ChatScreenStack' }
  ])

  useEffect(() => {
    dispatch(stopLoading())
  }, [general.isLoading])

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <Loader loading={general.isLoading} />
      <FlatGrid
      itemDimension={130}
      data={items}
      style={styles.gridView}
      spacing={10}
      renderItem={({ item }) => (
        <TouchableOpacity style={{...styles.itemContainer, backgroundColor: item.code }} onPress={() => item.routeName ? navigate(item.routeName) : logout()}>
          <Text style={styles.itemName}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
    </View>
  )
}

const styles = StyleSheet.create({
  gridView: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10,
    height: 150,
    alignItems: 'center'
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  }
})

export default HomeScreen
