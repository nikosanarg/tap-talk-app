import React from 'react'
import { SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { UserProvider } from './contexts/UserContext'
import AppNavigator from './navigation/AppNavigator'

function App(): React.JSX.Element {
  return (
    <UserProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </UserProvider>
  )
}

export default App
