import React, { useEffect } from 'react'
import { ActivityIndicator, SafeAreaView, ScrollView } from 'react-native'
import TapTalkTrademark from '../components/TapTalkTrademark'
import styled from 'styled-components/native'
import TapTalkLogo from '../components/TapTalkLogo'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/AppNavigator'

type WelcomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

function WelcomeScreen(): React.JSX.Element {
  const navigation = useNavigation<WelcomeScreenNavProp>()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('RoleSelection')
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigation])

  const LogoView = styled.View`
    flex: 1;
    justify-content:center;
    align-items: center;
    margin-top: 250px;
  `

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <LogoView>
          <TapTalkLogo width={130} height={160}/>
          <TapTalkTrademark fontSize='72px'/>
        </LogoView>
        <ActivityIndicator size="large" color="#65558F" style={{ marginTop: 20 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default WelcomeScreen
