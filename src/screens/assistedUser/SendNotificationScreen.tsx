import React, { useEffect } from 'react';
import { SafeAreaView, ImageBackground, Animated } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { EMPTY_ICON_PLACEHOLDER } from '../../utils/constants';
import { useCategories } from '../../contexts/CategoriesContext';
// import { TAPTALK_NOTIFICATIONS_BACKEND_URL } from '@env';
import firestore from '@react-native-firebase/firestore';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { IPictogram } from '../../types/Pictogram';
import { NotificationBox, NotificationText } from '../../styles/assistUser';
import { useBackendIp } from '../../contexts/BackendIpContext';
import NotificationApiService from '../../services/NotificationApiService';

type SendNotificationScreenRouteProp = RouteProp<RootStackParamList, 'SendNotification'>;
type SendNotificationScreenNavProp = StackNavigationProp<RootStackParamList, 'SendNotification'>;

function SendNotificationScreen(): React.JSX.Element {
  const route = useRoute<SendNotificationScreenRouteProp>();
  const navigation = useNavigation<SendNotificationScreenNavProp>();
  const { pictogram, supportGroupId } = route.params;
  const { selectedCategory } = useCategories()
  const { backendIp } = useBackendIp();

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const sendNotification = async () => {
      if (!selectedCategory || !supportGroupId) {
        console.error('🚫 Faltan datos: ', { selectedCategory, supportGroupId });
        return;
      }

      const groupDoc = await firestore().collection('Grupos').doc(supportGroupId).get();
      if (!groupDoc.exists) {
        throw new Error(`El grupo con ID ${supportGroupId} no existe`);
      }

      const groupData = groupDoc.data();
      const memberIds = groupData?.miembros || [];

      if (memberIds.length === 0) {
        console.log('⚠️ El grupo no tiene miembros para notificar');
        return;
      }

      const tokens: string[] = [];
      for (const memberId of memberIds) {
        const userDoc = await firestore().collection('Usuarios').doc(memberId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData?.deviceToken) {
            tokens.push(userData.deviceToken);
          }
        }
      }
      if (tokens.length === 0) {
        console.log('⚠️ No se encontraron tokens para enviar notificaciones');
        return;
      }

      const notificationPayload = {
        grupoId: supportGroupId,
        pictogramaId: pictogram.id,
        titulo: pictogram.nombre,
        categoria: selectedCategory.nombre,
        tokens,
        miembroResolutor: null,
        fechaCreacion: firestore.FieldValue.serverTimestamp(),
        fechaResuelta: null,
      };

      await firestore().collection('Notificaciones').add(notificationPayload);
      console.log(`✅ Notificación guardada correctamente para el pictograma: ${pictogram.nombre}`);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const notificationApiPayload = {
        pictograma_id: Number(pictogram.id),
        titulo: pictogram.nombre,
        categoria: selectedCategory.nombre,
        grupo_id: Number(supportGroupId),
        fecha_creacion: new Date().toISOString(),
        fecha_resuelta: null,
        miembro_resolutor: null,
      };
      console.log('📤 Payload a la API:', notificationApiPayload);
      try {
        await NotificationApiService.create(notificationApiPayload);
        console.log('✅ Notificación enviada a la API');
      } catch (error) {
      console.error('🚫 Error al enviar la notificación a la API:', error);
      }
      setTimeout(() => navigation.navigate('Categories'), 8000);

      try {
        const backendUrl = `http://${backendIp}:4000/send-notification`;
        console.log('🚀 Enviando notificación al backend:', backendUrl);
        const res = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            supportGroupId,
            pictogramId: pictogram.id
          }),
        });

        if (!res.ok) {
          console.error('🚫 Error en respuesta del backend:', await res.text());
        } else {
          console.log('✅ Notificación enviada al backend');
        }
      } catch (error) {
        console.error('🚫 Error al enviar notificación:', error);
      }
    };

    sendNotification();
  }, [pictogram]);

  const getButtonPictogramToShow = (pictogram: IPictogram, categoryColor: string) => {
    if (pictogram.icono !== "") {
      return (
        <Icon name={pictogram.icono || 'search-off'} size={128} color={categoryColor || '#9E9E9E'} />
      );
    } else {
      return (
        <ImageBackground
          source={{ uri: pictogram.imagenUrl || EMPTY_ICON_PLACEHOLDER }}
          style={{ width: '100%', height: '100%' }}
          imageStyle={{ borderRadius: 16 }}
        />
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: selectedCategory?.color ?? '#37ff37', justifyContent: 'center', alignItems: 'center' }}>
      <NotificationBox>
        {getButtonPictogramToShow(pictogram, selectedCategory?.color ?? '#37ff37')}
      </NotificationBox>
      <NotificationText>{pictogram.nombre}</NotificationText>
      <Animated.Text style={{ opacity: fadeAnim, fontSize: 100, marginTop: 20 }}>
        📨
      </Animated.Text>
    </SafeAreaView>
  );
}

export default SendNotificationScreen;
