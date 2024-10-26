import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, ButtonSupportText, StyledAuthButton, StyledAuthTextInput, SupportTextAuthContainer, SupportText } from '../../styles/auth';
import { ScreenView } from '../../styles/common';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../contexts/UserContext';
import ReturnButton from '../../components/returnButton/ReturnButton';

type JoinGroupScreenNavProp = StackNavigationProp<RootStackParamList, 'JoinGroup'>;

function JoinGroupScreen(): React.JSX.Element {
  const navigation = useNavigation<JoinGroupScreenNavProp>();
  const { user } = useUser();
  const [invitationCode, setInvitationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleJoinGroup = async () => {
    if (!user) {
      console.log(`🚫 No existe un User en el Context al momento de Joinear un Grupo de apoyo`);
      setErrorMessage('🚫 Se perdió la información del usuario actual');
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelection' }],
      });
      return
    }

    const groupCode = invitationCode;
    console.log(`🟢 Iniciando Join a un Grupo con Código de invitación: ${groupCode}`);
    try {
      const groupSnapshot = await firestore()
        .collection('Grupos')
        .where('codigoInvitacion', '==', groupCode)
        .get();
  
      if (groupSnapshot.empty) {
        console.log(`🚫 Grupo no encontrado con el código: ${groupCode}`);
        setErrorMessage('🚫 No se encontró un grupo con ese código de invitación');
        return;
      }
  
      const groupDoc = groupSnapshot.docs[0];
      const groupData = groupDoc.data();
      console.log(`🔵 Grupo encontrado: ID=${groupDoc.id}, Datos: ${JSON.stringify(groupData)}`);
  
      if (!groupData.miembros.includes(user.uid)) {
        console.log(`🟡 Usuario no es miembro del grupo. Añadiendo usuario con UID=${user.uid}...`);
        await groupDoc.ref.update({
          miembros: firestore.FieldValue.arrayUnion(user.uid),
        });
        console.log('✅ Usuario añadido exitosamente al grupo.');
      } else {
        console.log(`🟠 El usuario ya es miembro del grupo con ID=${groupDoc.id}`);
        setErrorMessage(`👍 Ya sos miembro del grupo de ${groupData.nombreAsistido}\nEntrá clickeándolo en la lista`);
        return;
      }
  
      navigation.navigate('SupportGroupMenu');
    } catch (error) {
      console.error(`🚫 Error al unirse al grupo: ${JSON.stringify(error)}`);
    }
  };
  
  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScreenView>
          <SupportTextAuthContainer>
            <SupportText>Unite como miembro del Grupo de apoyo con el código</SupportText>
          </SupportTextAuthContainer>
          
          <StyledAuthTextInput
            placeholder="Código de invitación"
            value={invitationCode}
            onChangeText={setInvitationCode}
          />
          
          <StyledContextualView>
            <StyledAuthButton onPress={handleJoinGroup}>
              <ButtonSupportText>Unirse</ButtonSupportText>
            </StyledAuthButton>
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
          </StyledContextualView>

          <ReturnButton screenName="SupportGroupMenu" />
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default JoinGroupScreen;
