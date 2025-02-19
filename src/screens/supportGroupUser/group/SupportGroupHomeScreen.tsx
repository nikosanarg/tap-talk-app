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
  const { notifications, deleteResolvedNotifications } = useNotifications();
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && supportGroup) {
      setIsAdmin(user.uid === supportGroup.creadorId);
    }
  }, [user, supportGroup]);

  const handleDeleteResolvedNotifications = async () => {
    await deleteResolvedNotifications();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <HeaderBoldTitle>Asistiendo a {supportGroup?.nombreAsistido || '...'}</HeaderBoldTitle>

        <TouchableMenu>
          <TouchableMenuButton title='Modificar grupo y miembros' iconName="settings" onPress={() => navigation.navigate('SupportGroupEdit')} disabled={!isAdmin} />
          <TouchableMenuButton
            title="Copiar código de invitación"
            subtitle={supportGroup?.codigoInvitacion}
            subtitleVisible={subtitleVisible}
            iconName="copy"
            onPress={() => {
              if (supportGroup?.codigoInvitacion) {
                Clipboard.setString(supportGroup.codigoInvitacion);
                setSubtitleVisible(true);
              }
            }}
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
          <MenuActionButton onPress={() => navigation.navigate('SupportGroupMenu')}>
            <ActionButtonText>Volver a la lista de grupos</ActionButtonText>
          </MenuActionButton>
        </StyledContextualView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportGroupHomeScreen;
