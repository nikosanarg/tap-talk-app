import React, { useEffect } from 'react';
import { SafeAreaView, Text, View, ImageBackground, Animated } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { NotificationBox, NotificationText } from '../../styles/assistUser';
import { EMPTY_ICON_PLACEHOLDER, FIREBASE_CLOUD_MESSAGING_ID } from '../../utils/constants';
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
    const sendNotification = async () => {
      try {
        if (!selectedCategory || !supportGroupId) 
          throw new Error('Faltan datos para enviar la notificación');
    
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
  
        setTimeout(() => navigation.navigate('Categories'), 8000);
    
        for (const token of tokens) {
          await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `key=${FIREBASE_CLOUD_MESSAGING_ID}`,
            },
            body: JSON.stringify({
              to: token,
              notification: {
                title: `Nueva solicitud en "${selectedCategory.nombre}"`,
                body: `Asistido requiere: ${pictogram.nombre}`,
              },
              data: {
                grupoId: supportGroupId,
                pictogramaId: pictogram.id,
              },
            }),
          });
          console.log(`✅ Notificación enviada a token: ${token}`);
        }
      } catch (error) {
        console.error("🚫 Error al enviar notificación:", error);
      }
    };    

    sendNotification();
  }, [pictogram]);

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
