import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import { ScreenView } from '../../styles/common';
import { PictogramBox, PictogramText } from '../../styles/pictograms';

type PictogramsScreenRouteProp = RouteProp<RootStackParamList, 'Pictograms'>;

interface IPictogram {
  id: string;
  nombre: string;
  icono: string;
}

function PictogramsScreen(): React.JSX.Element {
  const route = useRoute<PictogramsScreenRouteProp>();
  const { categoryId } = route.params;
  const [pictograms, setPictograms] = useState<IPictogram[]>([]);
  const [categoryColor, setCategoryColor] = useState<string>('#ffffff');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPictograms();
    fetchCategoryColor();
  }, [categoryId]);

  const fetchPictograms = async () => {
    try {
      const pictogramSnapshot = await firestore()
        .collection('Pictogramas')
        .where('categoriaId', '==', categoryId)
        .where('activo', '==', true)
        .get();
      const fetchedPictograms = pictogramSnapshot.docs.map(doc => ({
        ...(doc.data() as IPictogram),
        id: doc.id,
      }));
      console.log('Pictogramas obtenidos:', fetchedPictograms);
      setPictograms(fetchedPictograms);
    } catch (error) {
      console.error('🚫 Error al obtener pictogramas:', error);
      setErrorMessage('Error al cargar los pictogramas. Intente nuevamente.');
    }
  };

  const fetchCategoryColor = async () => {
    try {
      const categoryDoc = await firestore().collection('Categorías').doc(categoryId).get();
      if (categoryDoc.exists) {
        const categoryData = categoryDoc.data();
        if (categoryData && categoryData.colorFondo) {
          setCategoryColor(categoryData.colorFondo);
        }
      }
    } catch (error) {
      console.error('🚫 Error al obtener el color de la categoría:', error);
      setErrorMessage('Error al cargar el color de la categoría.');
    }
  };

  const handlePictogramPress = (pictogramId: string) => {
    // Lógica para manejar la acción al presionar un pictograma (enviar notificación o marcar como "pedido")
    console.log(`🟢 Pictograma seleccionado: ${pictogramId}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: categoryColor }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScreenView>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 }}>Pictogramas</Text>
          {errorMessage && <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text>}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {pictograms.map(pictogram => (
              <PictogramBox>
                <TouchableOpacity
                  key={pictogram.id}
                  onPress={() => handlePictogramPress(pictogram.id)}
                >
                  {/* colocar icono en lugar de texto */}
                  <PictogramText>{pictogram.nombre}</PictogramText>
                </TouchableOpacity>
              </PictogramBox>
            ))}
          </View>
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PictogramsScreen;
