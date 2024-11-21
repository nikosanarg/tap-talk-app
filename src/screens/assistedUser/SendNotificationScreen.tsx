import React, { useEffect } from 'react';
import { SafeAreaView, Text, View, ImageBackground, Animated } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { NotificationBox, NotificationText } from '../../styles/assistUser';
import { EMPTY_ICON_PLACEHOLDER } from '../../utils/constants';
import { useCategories } from '../../contexts/CategoriesContext';

type SendNotificationScreenRouteProp = RouteProp<RootStackParamList, 'SendNotification'>;
type SendNotificationScreenNavProp = StackNavigationProp<RootStackParamList, 'SendNotification'>;

function SendNotificationScreen(): React.JSX.Element {
  const route = useRoute<SendNotificationScreenRouteProp>();
  const navigation = useNavigation<SendNotificationScreenNavProp>();
  const { pictogram, supportGroupId } = route.params;
  const { selectedCategory } = useCategories()

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const sendNotificationsToGroup = async (supportGroupId: string, notificationPayload: any) => {
      try {
        const groupDoc = await firestore().collection('Grupos').doc(supportGroupId).get();
        if (!groupDoc.exists) {
          throw new Error(`El grupo con ID ${supportGroupId} no existe`);
        }
    
        const groupData = groupDoc.data();
        const memberIds = groupData?.miembros || [];
        
        if (memberIds.length === 0) {
          console.warn('⚠️ El grupo no tiene miembros para notificar');
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
          console.warn('⚠️ No se encontraron tokens para enviar notificaciones');
          return;
        }
    
        for (const token of tokens) {
          await firestore().collection('Notificaciones').add({
            token,
            ...notificationPayload,
            fechaEnvio: firestore.FieldValue.serverTimestamp(),
          });
          console.log(`✅ Notificación enviada a token: ${token}`);
        }
      } catch (error) {
        console.error('🚫 Error al enviar notificaciones:', error);
      }
    };

    const sendNotification = async () => {
      try {
        if (!selectedCategory || !supportGroupId) 
          throw new Error('Faltan datos para enviar la notificación');
  
        const notificationPayload = {
          grupoId: supportGroupId,
          pictogramaId: pictogram.id,
          titulo: pictogram.nombre,
          categoria: selectedCategory.nombre,
          miembroResolutor: null,
          fechaCreacion: firestore.FieldValue.serverTimestamp(),
          fechaResuelta: null,
        };
  
        await sendNotificationsToGroup(supportGroupId, notificationPayload);
        console.log(`✅ Notificación enviada correctamente para el pictograma: ${pictogram.nombre}`);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
  
        setTimeout(() => navigation.navigate('Categories'), 8000);
      } catch (error) {
        console.error("🚫 Error al enviar notificación:", error);
      }
    }; 

    sendNotification();
  }, [pictogram, supportGroupId, navigation, selectedCategory]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#37ff37', justifyContent: 'center', alignItems: 'center' }}>
      <NotificationBox>
        <ImageBackground
          source={{ uri: pictogram.imagenUrl ?? EMPTY_ICON_PLACEHOLDER }}
          style={{ width: '100%', height: '100%' }}
          imageStyle={{ borderRadius: 16 }}
        />
      </NotificationBox>
      <NotificationText>{pictogram.nombre}</NotificationText>
      <Animated.Text style={{ opacity: fadeAnim, fontSize: 100, marginTop: 20 }}>
        📨
      </Animated.Text>
    </SafeAreaView>
  );
}

export default SendNotificationScreen;
