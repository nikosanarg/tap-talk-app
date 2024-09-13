import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import WelcomeScreen from '../screens/WelcomeScreen'
import RoleSelectionScreen from '../screens/RoleSelectionScreen'
import AssistedUserInitScreen from '../screens/assistedUser/Init';
import SupportGroupUserInitScreen from '../screens/supportGroupUser/Init';

export type RootStackParamList = {
  Welcome: undefined;
  RoleSelection: undefined;
  AssistedUserInit: undefined;
  SupportGroupUserInit: undefined;
};

const Stack = createStackNavigator<RootStackParamList>()

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen}/>
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen}/>

      <Stack.Screen name="AssistedUserInit" component={AssistedUserInitScreen}/>

      <Stack.Screen name="SupportGroupUserInit" component={SupportGroupUserInitScreen}/>
    </Stack.Navigator>
  )
}

export default AppNavigator