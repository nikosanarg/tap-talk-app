import React, { useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { INotification } from '../../types/Notification'
import Icon from 'react-native-vector-icons/Ionicons';
import { NotificationCardContainer, NotificationCategoryIcon, NotificationCategoryLabel, NotificationCategorySubtitle, NotificationCategoryTitle } from './styled';
import { getCategoryColor } from '../../utils/getCategoryColor';
import { useUser } from '../../contexts/UserContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useCategories } from '../../contexts/CategoriesContext';
import { NotificationApiService } from '../../services/NotificationApiService';

interface NotificationCardProps {
  notification: INotification
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useUser();
  const { fetchNotifications } = useNotifications();
  const { categories } = useCategories();
  if (categories.length === 0) return null;
  
  const categoryColor = getCategoryColor(notification.categoria, categories);

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleMarkAsResolved = async (notificationId: number) => {
    try {
      await NotificationApiService.update(notificationId, {
        miembro_resolutor: user?.user_id || 'anonimo',
        fecha_resuelta: new Date().toISOString(),
      });
      console.log(`✅ Notificación ${notificationId} marcada como resuelta`);
      await fetchNotifications();
    } catch (error) {
      console.error("🚫 Error al marcar la notificación como resuelta:", error);
    } finally {
      setModalVisible(false);
    }
  };

  return (<>
    <NotificationCardContainer key={notification.id} onPress={handlePress}>
      <NotificationCategoryIcon style={{ backgroundColor: categoryColor }}>
        <NotificationCategoryLabel>{notification?.categoria}</NotificationCategoryLabel>
      </NotificationCategoryIcon>

      <View style={{ flex: 1 }}>
        <NotificationCategoryTitle>{notification.titulo}</NotificationCategoryTitle>
        <NotificationCategorySubtitle>
          {new Date(notification.fecha_creacion).toLocaleString('es-AR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </NotificationCategorySubtitle>
      </View>

      {notification.miembro_resolutor ? (
        <Icon name="checkmark-circle" style={{ margin: 6 }} size={32} color="green" />
      ) : (
        <Icon name="ellipse-outline" style={{ margin: 6 }} size={32} color="gray" />
      )}
    </NotificationCardContainer>

    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text>¿Deseas marcar esta notificación como resuelta?</Text>
          <TouchableOpacity onPress={() => handleMarkAsResolved(notification.id)}>
            <Text style={{ color: 'green', marginTop: 10 }}>Sí, marcar como resuelta</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ color: 'red', marginTop: 10 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </>
  )
}

export default NotificationCard