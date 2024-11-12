import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import WelcomeScreen from '../screens/WelcomeScreen'
import RoleSelectionScreen from '../screens/RoleSelectionScreen'
import LoginScreen from '../screens/supportGroupUser/LoginScreen';
import RegisterScreen from '../screens/supportGroupUser/RegisterScreen';
import SupportGroupMenuScreen from '../screens/supportGroupUser/SupportGroupMenuScreen';
import CreateGroupScreen from '../screens/supportGroupUser/CreateGroupScreen';
import JoinGroupScreen from '../screens/supportGroupUser/JoinGroupScreen';
import SupportGroupHomeScreen from '../screens/supportGroupUser/group/SupportGroupHomeScreen';
import SupportGroupEditScreen from '../screens/supportGroupUser/group/SupportGroupEditScreen';
import LinkScreen from '../screens/assistedUser/LinkScreen';
import CategoriesScreen from '../screens/assistedUser/CategoriesScreen';
import PictogramsScreen from '../screens/assistedUser/PictogramsScreen';
import SendNotificationScreen from '../screens/assistedUser/SendNotificationScreen';
import { IPictogram } from '../types/Pictogram';

export type RootStackParamList = {
  Welcome: undefined;
  RoleSelection: undefined;
  Link: undefined;
  Categories: undefined;
  Pictograms: { categoryId: string, supportGroupId: string };
  SendNotification: {
    categoryName: string
    pictogram: IPictogram;
    supportGroupId: string;
  };
  Login: undefined;
  Register: undefined;
  SupportGroupMenu: undefined;
  CreateGroup: undefined;
  JoinGroup: undefined;
  SupportGroupHome: undefined;
  SupportGroupEdit: undefined;
};

const Stack = createStackNavigator<RootStackParamList>()

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />

      <Stack.Screen name="Link" component={LinkScreen} />

      <Stack.Screen name="Categories" component={CategoriesScreen} options={{
        headerShown: false,
        presentation: 'modal',
      }} />
      <Stack.Screen name="Pictograms" component={PictogramsScreen} options={{
        headerShown: false,
        presentation: 'modal',
      }} />
      <Stack.Screen name="SendNotification" component={SendNotificationScreen} options={{
        headerShown: false,
        presentation: 'modal',
      }} />

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="SupportGroupMenu" component={SupportGroupMenuScreen} />

      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="JoinGroup" component={JoinGroupScreen} />

      <Stack.Screen name="SupportGroupHome" component={SupportGroupHomeScreen} />
      <Stack.Screen name="SupportGroupEdit" component={SupportGroupEditScreen} />
    </Stack.Navigator>
  )
}

export default AppNavigator