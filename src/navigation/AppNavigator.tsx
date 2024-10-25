import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import WelcomeScreen from '../screens/WelcomeScreen'
import RoleSelectionScreen from '../screens/RoleSelectionScreen'
import AssistedUserInitScreen from '../screens/assistedUser/Init';
import LoginScreen from '../screens/supportGroupUser/LoginScreen';
import RegisterScreen from '../screens/supportGroupUser/RegisterScreen';
import SupportGroupMenuScreen from '../screens/supportGroupUser/SupportGroupMenuScreen';

export type RootStackParamList = {
  Welcome: undefined;
  RoleSelection: undefined;
  AssistedUserInit: undefined;
  Login: undefined;
  Register: undefined;
  SupportGroupMenu: undefined;
};

const Stack = createStackNavigator<RootStackParamList>()

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen}/>
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen}/>

      <Stack.Screen name="AssistedUserInit" component={AssistedUserInitScreen}/>

      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="Register" component={RegisterScreen}/>
      <Stack.Screen name="SupportGroupMenu" component={SupportGroupMenuScreen}/>
    </Stack.Navigator>
  )
}

export default AppNavigator