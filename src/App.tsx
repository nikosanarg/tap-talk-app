import React from 'react'
import { SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { UserProvider } from './contexts/UserContext'
import AppNavigator from './navigation/AppNavigator'
import { SupportGroupProvider } from './contexts/SupportGroupContext'
import { NotificationsProvider } from './contexts/NotificationContext'

function App(): React.JSX.Element {
  return (
    <UserProvider>
      <SupportGroupProvider>
        <NotificationsProvider>
          <NavigationContainer>
            <SafeAreaView style={{ flex: 1 }}>
              <AppNavigator />
            </SafeAreaView>
          </NavigationContainer>
        </NotificationsProvider>
      </SupportGroupProvider>
    </UserProvider>
  )
}

export default App
