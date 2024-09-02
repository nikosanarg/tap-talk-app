import React from 'react'
import { SafeAreaView, ScrollView, Text } from 'react-native'
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type SupportGroupUserInitScreenNavProp = StackNavigationProp<RootStackParamList, 'SupportGroupUserInit'>;

function SupportGroupUserInitScreen(): React.JSX.Element {
  const navigation = useNavigation<SupportGroupUserInitScreenNavProp>()

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text>Miembro del grupo de apoyo</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SupportGroupUserInitScreen
