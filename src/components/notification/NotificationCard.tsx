import React, { useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { INotification } from '../../types/Notification'
import Icon from 'react-native-vector-icons/Ionicons';
import { NotificationCardContainer, NotificationCategoryIcon, NotificationCategoryLabel, NotificationCategorySubtitle, NotificationCategoryTitle } from './styled';
import { formatSinceTimeToHumanRead } from '../../utils/formatHour';
import { getCategoryColor } from '../../utils/getCategoryColor';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../contexts/UserContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface NotificationCardProps {
  notification: INotification
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useUser();
  const { fetchNotifications } = useNotifications();
  const categoryColor = getCategoryColor(notification.categoria);

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleMarkAsResolved = async (notificationId?: string) => {
    if (!notificationId) {
      console.error("🚫 La notificación no tenía un ID de firestore");
      setModalVisible(false);
      return
    }
    try {
      await firestore().collection('Notificaciones').doc(notificationId).update({
        miembroResolutor: user?.uid || 'anonimo',
        fechaResuelta: firestore.FieldValue.serverTimestamp(),
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
          {notification.fechaCreacion instanceof firestore.Timestamp
            ? formatSinceTimeToHumanRead(notification.fechaCreacion)
            : 'Fecha desconocida'}
        </NotificationCategorySubtitle>
      </View>

      {notification.miembroResolutor ? (
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