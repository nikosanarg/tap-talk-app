import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, ButtonSupportText, StyledAuthButton, StyledAuthTextInput, SupportTextAuthContainer, SupportText } from '../../styles/auth';
import { ScreenView } from '../../styles/common';
import ReturnButton from '../../components/returnButton/ReturnButton';
import { useSupportGroup } from '../../contexts/SupportGroupContext';
import { IFirestoreSupportGroup } from '../../types/SupportGroup';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LinkScreenNavProp = StackNavigationProp<RootStackParamList, 'Link'>;

function LinkScreen(): React.JSX.Element {
  const navigation = useNavigation<LinkScreenNavProp>();
  const [linkCode, setLinkCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setSupportGroup, fetchGroupByCode } = useSupportGroup()
  
  const handleLinkUser = async () => {
    console.log(`🟢 Iniciando vinculación con el código: ${linkCode}`);
    try {
      const groupData = await fetchGroupByCode(linkCode);
      if (!groupData) {
        console.log(`🚫 Grupo no encontrado con el código: ${linkCode}`);
        setErrorMessage('🚫 No se encontró un grupo con ese código de vinculación');
        return;
      }
  
      try {
        await AsyncStorage.setItem('groupId', groupData.id);
        console.log(`📥 Grupo descargado y almacenado en el Storage`);
      } catch (error) {
        console.error(`🚫 Error guardando el grupo vinculado`);
        setErrorMessage('Error guardando el grupo vinculado.');
        return;
      }
  
      setSupportGroup(groupData);
      navigation.navigate('Categories');
    } catch (error) {
      console.error(`🚫 Error al vincularse al grupo: ${JSON.stringify(error)}`);
      setErrorMessage('Error al vincularse. Intente de nuevo.');
    }
  };
  
  
  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScreenView>
          <SupportTextAuthContainer>
            <SupportText>Ingresa el código de vinculación generado en el Grupo de apoyo</SupportText>
          </SupportTextAuthContainer>
          
          <StyledAuthTextInput
            placeholder="Código de vinculación"
            placeholderTextColor="#88B"
            value={linkCode}
            onChangeText={setLinkCode}
          />
          
          <StyledContextualView>
            <StyledAuthButton onPress={handleLinkUser}>
              <ButtonSupportText>Vincular</ButtonSupportText>
            </StyledAuthButton>
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
          </StyledContextualView>

          <ReturnButton screenName="RoleSelection" />
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LinkScreen;
