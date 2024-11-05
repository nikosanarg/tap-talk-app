import React, { useEffect } from 'react';
import { SafeAreaView, Text, View, ImageBackground, Animated } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { NotificationBox, NotificationText } from '../../styles/assistUser';
import { IPictogram } from '../../types/Pictogram';
import { EMPTY_ICON_PLACEHOLDER } from '../../utils/constants';

type SendNotificationScreenRouteProp = RouteProp<RootStackParamList, 'SendNotification'>;
type SendNotificationScreenNavProp = StackNavigationProp<RootStackParamList, 'SendNotification'>;

interface NotificationProps {
  pictogram: IPictogram;
  supportGroupId: string;
}

function SendNotificationScreen(): React.JSX.Element {
  const route = useRoute<SendNotificationScreenRouteProp>();
  const navigation = useNavigation<SendNotificationScreenNavProp>();
  const { pictogram, supportGroupId } = route.params;

  // Animación de éxito
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const sendNotification = async () => {
      try {
        await firestore().collection('Notificaciones').add({
          groupId: supportGroupId,
          pictogramId: pictogram.id,
          pictogramName: pictogram.nombre,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        console.log(`✅ Notificación enviada correctamente para el pictograma: ${pictogram.nombre}`);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
        setTimeout(() => navigation.navigate('Categories'), 5000);
      } catch (error) {
        console.error("🚫 Error al enviar notificación:", error);
      }
    };

    sendNotification();
  }, [pictogram, supportGroupId, navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e0ffe0', justifyContent: 'center', alignItems: 'center' }}>
      <NotificationBox>
        <ImageBackground
          source={{ uri: pictogram.icono ?? EMPTY_ICON_PLACEHOLDER}}
          style={{ width: 200, height: 200, justifyContent: 'center', alignItems: 'center' }}
          imageStyle={{ borderRadius: 16 }}
        />
        <NotificationText>{pictogram.nombre}</NotificationText>
      </NotificationBox>

      <Animated.Text style={{ opacity: fadeAnim, fontSize: 24, color: 'green', marginTop: 20 }}>
        Notificación enviada correctamente
      </Animated.Text>
    </SafeAreaView>
  );
}

export default SendNotificationScreen;
