// Import React and Component
import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';

const NavigationHeaderRight = (props) => {
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer()
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Image
          source={{
            uri:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
          style={{width: 25, height: 25, marginRight: 5}}
        />
      </TouchableOpacity>
    </View>
  )
}
export default NavigationHeaderRight
