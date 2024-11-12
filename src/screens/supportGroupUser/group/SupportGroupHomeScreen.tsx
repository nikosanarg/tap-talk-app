import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../contexts/UserContext';
import { StyledContextualView, SupportText } from '../../../styles/auth';
import { HeaderBoldTitle, HeaderSubTitle, SupportGroupListContainer } from '../../../styles/supportGroup';
import { ActionButtonText, MenuActionButton } from '../../../styles/buttons';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../../components/header/Header';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useSupportGroup } from '../../../contexts/SupportGroupContext';
import NotificationCard from '../../../components/notification/NotificationCard';
import { InvitationHeader, NotificationsHeader } from '../../../components/notification/notificationStyled';
import Clipboard from '@react-native-clipboard/clipboard';
import { INotification } from '../../../types/Notification';

type SupportGroupHomeScreenNavProp = StackNavigationProp<RootStackParamList, 'SupportGroupHome'>;

const SupportGroupHomeScreen = (): React.JSX.Element => {
  const navigation = useNavigation<SupportGroupHomeScreenNavProp>();
  const { user } = useUser();
  const { supportGroup } = useSupportGroup();
  const { notifications, deleteResolvedNotifications } = useNotifications();
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
  };

  useEffect(() => {
    if (user && supportGroup) {
      setIsAdmin(user.uid === supportGroup.creadorId);
    }
  }, [user, supportGroup]);

  return (
    <SafeAreaView>
      <Header />

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <HeaderBoldTitle>Asistiendo a {supportGroup?.nombreAsistido || '...'}</HeaderBoldTitle>
        <InvitationHeader>
          <HeaderSubTitle>Copiar código de invitación</HeaderSubTitle>
          <TouchableOpacity onPress={handleCopyInvitationCode}>
            <Icon name="copy" size={20} color="#9D6ACD" />
          </TouchableOpacity>
        </InvitationHeader>

        <StyledContextualView>
          <MenuActionButton style={{ backgroundColor: isAdmin ? '#65558F' : '#AAA' }} onPress={handleGoToEdit} disabled={!isAdmin}>
            <ActionButtonText>Modificar grupo y miembros</ActionButtonText>
          </MenuActionButton>
        </StyledContextualView>

        <NotificationsHeader>
          <SupportText style={{ fontSize: 18 }}>Últimas notificaciones</SupportText>
          <TouchableOpacity onPress={deleteResolvedNotifications}>
            <Icon name="trash-bin" size={20} color="#9D6ACD" />
          </TouchableOpacity>
        </NotificationsHeader>

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
