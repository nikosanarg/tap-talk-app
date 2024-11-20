import React, { useEffect } from 'react';
import { SafeAreaView, Text, View, ImageBackground, Animated } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { NotificationBox, NotificationText } from '../../styles/assistUser';
import { EMPTY_ICON_PLACEHOLDER } from '../../utils/constants';
import { INotification } from '../../types/Notification';
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
        console.log(selectedCategory, supportGroupId)
        if (!selectedCategory || !supportGroupId) 
          throw Error(`Se perdió la categoría o el ID del grupo de soporte`)
        else {
          setTimeout(() => navigation.navigate('Categories'), 8000);
          const newNotification: INotification = {
            grupoId: supportGroupId,
            pictogramaId: pictogram.id,
            titulo: pictogram.nombre,
            categoria: selectedCategory.nombre,
            miembroResolutor: null,
            fechaCreacion: firestore.FieldValue.serverTimestamp(),
            fechaResuelta: null,
          }
          console.log('REQUEST', JSON.stringify(newNotification))
          await firestore().collection('Notificaciones').add(newNotification);
          console.log(`✅ Notificación enviada correctamente para el pictograma: ${pictogram.nombre}`);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
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
