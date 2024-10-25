import React from 'react'
import { SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { UserProvider } from './contexts/UserContext'
import AppNavigator from './navigation/AppNavigator'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FIREBASE_OAUTH2_WEB_CLIENT_ID } from './utils/constants'

GoogleSignin.configure({
  webClientId: `${FIREBASE_OAUTH2_WEB_CLIENT_ID}.apps.googleusercontent.com`,
});

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
