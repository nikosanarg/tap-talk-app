import React from 'react'
import { SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { UserProvider } from './contexts/UserContext'
import AppNavigator from './navigation/AppNavigator'
import { SupportGroupProvider } from './contexts/SupportGroupContext'
import { NotificationsProvider } from './contexts/NotificationContext'
import { CategoriesProvider } from './contexts/CategoriesContext'

function App(): React.JSX.Element {
  return (
    <UserProvider>
      <SupportGroupProvider>
        <NotificationsProvider>
          <CategoriesProvider>
            <NavigationContainer>
              <SafeAreaView style={{ flex: 1 }}>
                <AppNavigator />
              </SafeAreaView>
            </NavigationContainer>
          </CategoriesProvider>
        </NotificationsProvider>
      </SupportGroupProvider>
    </UserProvider>
  )
}

export default App
