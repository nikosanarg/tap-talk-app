import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, ButtonSupportText, StyledAuthButton, StyledAuthTextInput, SupportTextAuthContainer, SupportText } from '../../styles/auth';
import { ScreenView } from '../../styles/common';
import { useUser } from '../../contexts/UserContext';
import ReturnButton from '../../components/returnButton/ReturnButton';
import { GrupoApiService } from '../../services/GrupoApiService';
import { config } from '../../config/config';

type JoinGroupScreenNavProp = StackNavigationProp<RootStackParamList, 'JoinGroup'>;

function JoinGroupScreen(): React.JSX.Element {
  const navigation = useNavigation<JoinGroupScreenNavProp>();
  const { user } = useUser();
  const [invitationCode, setInvitationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleJoinGroup = async () => {
    if (!user?.user_id) {
      console.log(`🚫 No existe un User en el Context al momento de Joinear un Grupo de apoyo`);
      setErrorMessage('🚫 Se perdió la información del usuario actual');
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelection' }],
      });
      return;
    }

    const groupCode = invitationCode.trim();
    console.log(`🟢 Iniciando Join a un Grupo con Código de invitación: ${groupCode}`);
    
    try {
      // Buscar el grupo por código de vinculación usando endpoint específico
      const group = await GrupoApiService.getByCodigo(groupCode);
  
      if (!group) {
        console.log(`🚫 Grupo no encontrado con el código: ${groupCode}`);
        setErrorMessage('🚫 No se encontró un grupo con ese código de invitación');
        return;
      }
  
      console.log(`🔵 Grupo encontrado: ID=${group.id}, Nombre: ${group.nombre_paciente}`);
  
      // Verificar si el usuario ya es miembro
      const userGroups = await GrupoApiService.getByAuxiliar(user.user_id);
      const alreadyMember = userGroups.some(g => g.id === group.id);
  
      if (alreadyMember) {
        console.log(`� El usuario ya es miembro del grupo con ID=${group.id}`);
        setErrorMessage(`👍 Ya sos miembro del grupo de ${group.nombre_paciente}\nEntrá clickeándolo en la lista`);
        return;
      }
  
      // Agregar el usuario al grupo mediante la API
      console.log(`🟡 Usuario no es miembro del grupo. Añadiendo usuario con ID=${user.user_id}...`);
      const response = await fetch(`${config.API_URL}/api/grupos/${group.id}/auxiliares`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          auxiliar_id: user.user_id,
          es_administrador: false
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al unirse al grupo:', errorText);
        setErrorMessage('� Error al unirse al grupo');
        return;
      }
  
      console.log('✅ Usuario añadido exitosamente al grupo.');
      navigation.navigate('SupportGroupMenu');
    } catch (error) {
      console.error(`🚫 Error al unirse al grupo:`, error);
      setErrorMessage('🚫 Error al procesar la solicitud');
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
            placeholderTextColor="#88B"
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
