import React, { useEffect } from 'react';
import { SafeAreaView, ImageBackground, Animated } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { EMPTY_ICON_PLACEHOLDER } from '../../utils/constants';
import { useCategories } from '../../contexts/CategoriesContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IPictogram } from '../../types/Pictogram';
import { NotificationBox, NotificationText } from '../../styles/assistUser';
import { useBackendIp } from '../../contexts/BackendIpContext';
import NotificationApiService from '../../services/NotificationApiService';
import { GrupoApiService } from '../../services/GrupoApiService';

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

      try {
        // Obtener información del grupo
        const group = await GrupoApiService.getById(supportGroupId);
        if (!group) {
          console.error(`🚫 El grupo con ID ${supportGroupId} no existe`);
          return;
        }

        // Crear notificación en la base de datos
        const notificationApiPayload = {
          pictograma_id: pictogram.id,
          grupo_id: supportGroupId,
          contenido: `${selectedCategory.nombre}: ${pictogram.nombre}`,
          tipo: 'PICTOGRAMA',
          fecha_creacion: new Date().toISOString(),
          titulo: pictogram.nombre,
          categoria: selectedCategory.nombre,
        };

        console.log('📤 Payload a la API:', notificationApiPayload);
        await NotificationApiService.create(notificationApiPayload);
        console.log('✅ Notificación guardada correctamente para el pictograma:', pictogram.nombre);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        setTimeout(() => navigation.navigate('Categories'), 8000);

        // Enviar notificación push al backend
        try {
          const backendUrl = `http://${backendIp}:4000/send-notification`;
          console.log('🚀 Enviando notificación push al backend:', backendUrl);
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
            console.log('✅ Notificación push enviada al backend');
          }
        } catch (error) {
          console.error('🚫 Error al enviar notificación push:', error);
        }
      } catch (error) {
        console.error('🚫 Error al procesar la notificación:', error);
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
          source={{ uri: pictogram.imagen_url || EMPTY_ICON_PLACEHOLDER }}
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
