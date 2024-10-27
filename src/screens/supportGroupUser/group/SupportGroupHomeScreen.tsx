import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../contexts/UserContext';
import { StyledContextualView, SupportText } from '../../../styles/auth';
import { SupportGroupListContainer } from '../../../styles/supportGroup';
import { ActionButtonText, MenuActionButton } from '../../../styles/buttons';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../../components/header/Header';
import { useNotifications } from '../../../contexts/NotificationContext';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { groupNotificationsMock } from '../../../mocks/groupNotifications.mock';

type SupportGroupHomeScreenNavProp = StackNavigationProp<RootStackParamList, 'SupportGroupHome'>;

const SupportGroupHomeScreen = (): React.JSX.Element => {
  const navigation = useNavigation<SupportGroupHomeScreenNavProp>();
  const { user } = useUser();
  const { notifications, setNotifications, deleteAllNotifications } = useNotifications();

  const handleGoToMenu = () => {
    navigation.navigate('SupportGroupMenu');
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'RoleSelection' }],
    });
  };

  useEffect(() => {
    setNotifications(groupNotificationsMock)
  }, [])
  

  return (
    <SafeAreaView>
      <Header user={user} handleLogout={handleLogout} />

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <StyledContextualView>
          <SupportText style={{ fontSize: 24, fontWeight: 'bold' }}>Notificaciones</SupportText>
          <TouchableOpacity onPress={deleteAllNotifications}>
            <Icon name="trash-bin" size={24} color="#E05154" />
          </TouchableOpacity>
        </StyledContextualView>

        <SupportGroupListContainer>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <View key={notification.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                <View style={{ backgroundColor: '#CCC', borderRadius: 20, padding: 10, marginRight: 10 }}>
                  <Text style={{ fontWeight: 'bold' }}>{notification.categoria[0].toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold' }}>{notification.titulo}</Text>
                  <Text>{notification.fechaCreacion.toDate().toLocaleString()}</Text>
                </View>
                {notification.resuelta ? (
                  <Icon name="checkmark-circle" size={24} color="green" />
                ) : (
                  <Icon name="ellipse-outline" size={24} color="gray" />
                )}
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 10 }}>No hay notificaciones.</Text>
          )}
        </SupportGroupListContainer>

        <StyledContextualView>
          <MenuActionButton onPress={handleGoToMenu}>
            <ActionButtonText>Ir al menú</ActionButtonText>
          </MenuActionButton>
        </StyledContextualView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportGroupHomeScreen;
