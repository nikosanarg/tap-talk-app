import React from 'react'
import { SafeAreaView, ScrollView, Text } from 'react-native'
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type SupportGroupMenuScreenNavProp = StackNavigationProp<RootStackParamList, 'SupportGroupMenu'>;

function SupportGroupMenuScreen(): React.JSX.Element {
  const navigation = useNavigation<SupportGroupMenuScreenNavProp>()

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text>{"Menú (Lista de grupos) del usuario de apoyo"}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SupportGroupMenuScreen
