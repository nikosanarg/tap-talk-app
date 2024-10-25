import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react'
import { RootStackParamList } from '../navigation/AppNavigator';
import { StyledReturnButton, StyledReturnText } from '../styles/returnButton';
import { StyledContextualView } from '../styles/auth';

interface ReturnButtonProps {
  screenName: keyof RootStackParamList;
}

const ReturnButton: React.FC<ReturnButtonProps> = ({ screenName }) => {
  type XXXScreenNavProp = StackNavigationProp<RootStackParamList, typeof screenName>;
  const navigation = useNavigation<XXXScreenNavProp>();

  const handleGoBack = () => {
    navigation.navigate(screenName);
  };

  return (
    <StyledContextualView>
      <StyledReturnButton onPress={handleGoBack}>
        <StyledReturnText>Volver</StyledReturnText>
      </StyledReturnButton>
    </StyledContextualView>
  )
}

export default ReturnButton