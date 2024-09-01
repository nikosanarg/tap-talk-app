import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { UserProvider } from './contexts/UserContext'
import WelcomeScreen from './screens/WelcomeScreen'

const Stack = createStackNavigator()

function App(): React.JSX.Element {
  return (
    <UserProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" />
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </UserProvider>
  )
}

export default App
