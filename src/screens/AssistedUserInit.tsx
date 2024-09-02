import React from 'react'
import { SafeAreaView, ScrollView, Text } from 'react-native'
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type AssistedUserInitScreenNavProp = StackNavigationProp<RootStackParamList, 'AssistedUserInit'>;

function AssistedUserInitScreen(): React.JSX.Element {
  const navigation = useNavigation<AssistedUserInitScreenNavProp>()

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text>Usuario asistido</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AssistedUserInitScreen
