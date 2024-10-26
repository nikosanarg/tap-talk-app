import React from 'react'
import { SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { UserProvider } from './contexts/UserContext'
import AppNavigator from './navigation/AppNavigator'
import { SupportGroupProvider } from './contexts/SupportGroupContext'

function App(): React.JSX.Element {
  return (
    <UserProvider>
      <SupportGroupProvider>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1 }}>
            <AppNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </SupportGroupProvider>
    </UserProvider>
  )
}

export default App
