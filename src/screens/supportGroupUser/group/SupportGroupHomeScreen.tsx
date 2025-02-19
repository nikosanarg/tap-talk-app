import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../contexts/UserContext';
import { StyledContextualView } from '../../../styles/auth';
import { HeaderBoldTitle, SupportGroupListContainer } from '../../../styles/supportGroup';
import { ActionButtonText, MenuActionButton } from '../../../styles/buttons';
import Header from '../../../components/header/Header';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useSupportGroup } from '../../../contexts/SupportGroupContext';
import NotificationCard from '../../../components/notification/NotificationCard';
import Clipboard from '@react-native-clipboard/clipboard';
import { INotification } from '../../../types/Notification';
import TouchableMenuButton from '../../../components/touchableScreenButton';
import { TouchableMenu } from '../../../styles/touchableMenu';

type SupportGroupHomeScreenNavProp = StackNavigationProp<RootStackParamList, 'SupportGroupHome'>;

const SupportGroupHomeScreen = (): React.JSX.Element => {
  const navigation = useNavigation<SupportGroupHomeScreenNavProp>();
  const { user } = useUser();
  const { supportGroup } = useSupportGroup();
  const { notifications, deleteResolvedNotifications, fetchNotifications } = useNotifications();
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleGoToMenu = () => {
    navigation.navigate('SupportGroupMenu');
  };

  const handleGoToEdit = () => {
    navigation.navigate('SupportGroupEdit');
  };

  const handleCopyInvitationCode = () => {
    if (supportGroup?.codigoInvitacion) {
      Clipboard.setString(supportGroup.codigoInvitacion);
      console.log("🔗 Código de invitación copiado al Clipboard:", supportGroup.codigoInvitacion);
    }
    setSubtitleVisible(true)
  };

  useEffect(() => {
    if (user && supportGroup) {
      setIsAdmin(user.uid === supportGroup.creadorId);
    }
  }, [user, supportGroup, notifications]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!!!supportGroup?.id) return
      await fetchNotifications();
      console.log(`📩 Update recurrente de Notificaciones para el Grupo "${supportGroup.id}"`);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications, supportGroup?.id]);

  const handleDeleteResolvedNotifications = async () => {
    await deleteResolvedNotifications();
  }

  return (
    <SafeAreaView>
      <Header />

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <HeaderBoldTitle>Asistiendo a {supportGroup?.nombreAsistido || '...'}</HeaderBoldTitle>

        <TouchableMenu>
          <TouchableMenuButton title='Modificar grupo y miembros' iconName="settings" onPress={handleGoToEdit} disabled={!isAdmin} />
          <TouchableMenuButton
            title="Copiar código de invitación"
            subtitle={supportGroup?.codigoInvitacion}
            subtitleVisible={subtitleVisible}
            iconName="copy"
            onPress={handleCopyInvitationCode}
          />
          <TouchableMenuButton title='Borrar notificaciones resueltas' iconName="trash-bin" onPress={handleDeleteResolvedNotifications} />
        </TouchableMenu>

        <SupportGroupListContainer>
          {notifications.length > 0 ? (
            notifications.map((notification: INotification, index: number) =>
              <NotificationCard
                key={`${notification.titulo.replace(/\s+/g, '-')}-${index}`}
                notification={notification}
              />
            )
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 10 }}>No hay notificaciones</Text>
          )}
        </SupportGroupListContainer>

        <StyledContextualView>
          <MenuActionButton onPress={handleGoToMenu}>
            <ActionButtonText>Volver a la lista de grupos</ActionButtonText>
          </MenuActionButton>
        </StyledContextualView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportGroupHomeScreen;
