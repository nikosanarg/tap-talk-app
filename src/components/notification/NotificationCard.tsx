import React from 'react'
import { Text, View } from 'react-native'
import { INotification } from '../../types/Notification'
import Icon from 'react-native-vector-icons/Ionicons';
import { NotificationCardContainer, NotificationCategoryIcon } from './notificationStyled';
import { formatSinceTimeToHumanRead } from '../../utils/formatHour';

interface NotificationCardProps {
  notification: INotification
}

const NotificationCard = ({ notification }: NotificationCardProps) => {
  return (
    <NotificationCardContainer key={notification.id} >
      <NotificationCategoryIcon>
        <Text style={{ fontWeight: 'bold' }}>{notification?.categoria}</Text>
      </NotificationCategoryIcon>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{notification.mensaje}</Text>
        <Text style={{ fontSize: 13 }}>{formatSinceTimeToHumanRead(notification.fechaCreacion)}</Text>
      </View>
      {notification.resuelta ? (

        <Icon name="checkmark-circle" style={{ margin:6 }} size={32} color="green" />
      ) : (
        <Icon name="ellipse-outline" style={{ margin:6 }} size={32} color="gray" />
      )}
    </NotificationCardContainer>
  )
}

export default NotificationCard