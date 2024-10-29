import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, ButtonSupportText, StyledAuthButton, StyledAuthTextInput, SupportTextAuthContainer, SupportText } from '../../styles/auth';
import { ScreenView } from '../../styles/common';
import firestore from '@react-native-firebase/firestore';
import ReturnButton from '../../components/returnButton/ReturnButton';
import { useSupportGroup } from '../../contexts/SupportGroupContext';
import { IFirestoreSupportGroup } from '../../types/SupportGroup';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LinkScreenNavProp = StackNavigationProp<RootStackParamList, 'Link'>;

function LinkScreen(): React.JSX.Element {
  const navigation = useNavigation<LinkScreenNavProp>();
  const [linkCode, setLinkCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { supportGroup, setSupportGroup } = useSupportGroup()

  const handleLinkUser = async () => {
    const groupCode = linkCode;
    console.log(`🟢 Iniciando vinculación con el código: ${groupCode}`);
    try {
      const groupSnapshot = await firestore()
        .collection('Grupos')
        .where('codigoInvitacion', '==', groupCode)
        .get();
  
      if (groupSnapshot.empty) {
        console.log(`🚫 Grupo no encontrado con el código: ${groupCode}`);
        setErrorMessage('🚫 No se encontró un grupo con ese código de vinculación');
        return;
      }
  
      const groupDoc = groupSnapshot.docs[0];
      const groupData: IFirestoreSupportGroup = groupDoc.data() as IFirestoreSupportGroup;
      console.log(`🔵 Grupo encontrado: ID=${groupDoc.id}, Datos: ${JSON.stringify(groupData)}`);

      await AsyncStorage.setItem('groupId', groupDoc.id);
      setSupportGroup(groupData)
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
