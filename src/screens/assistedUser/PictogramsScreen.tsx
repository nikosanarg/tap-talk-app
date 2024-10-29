import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import { PictogramsScreenContainer, PictogramBox, PictogramText, StyledPictogramsContainer } from '../../styles/pictograms';
import { getCategoryColor } from '../../styles/assistedUser';
import { IPictogram } from '../../types/Pictogram';
import { mockPictograms } from '../../mocks/pictograms.mock';
import { StackNavigationProp } from '@react-navigation/stack';

type PictogramsScreenRouteProp = RouteProp<RootStackParamList, 'Pictograms'>;
type PictogramsScreenNavProp = StackNavigationProp<RootStackParamList, 'Pictograms'>;


function PictogramsScreen(): React.JSX.Element {
  const route = useRoute<PictogramsScreenRouteProp>();
  const navigation = useNavigation<PictogramsScreenNavProp>();

  const { categoryId } = route.params;
  const [pictograms, setPictograms] = useState<IPictogram[]>([]);
  const [categoryColor, setCategoryColor] = useState<string>('#ffffff');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryColor = async () => {
      try {
        const categoryDoc = await firestore().collection('Categorías').doc(categoryId).get();
        if (categoryDoc.exists) {
          const categoryData = categoryDoc.data();
          if (categoryData && categoryData.nombre) {
            const color = getCategoryColor(categoryData.nombre);
            setCategoryColor(color);
          }
        }
      } catch (error) {
        setErrorMessage('Error al cargar el color de la categoría.');
      }
    };
    setPictograms(mockPictograms);
    fetchCategoryColor();
  }, [categoryId]);

  const handlePictogramPress = (pictogramId: string) => {
    console.log(`🟢 Pictograma seleccionado: ${pictogramId}`);
    navigation.navigate('Categories');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: categoryColor }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 }}>Pictogramas</Text>
        {errorMessage && <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text>}
        <PictogramsScreenContainer>
          <StyledPictogramsContainer>
            {pictograms.map(pictogram => (
              <TouchableOpacity key={pictogram.id} onPress={() => handlePictogramPress(pictogram.id)}>
                <PictogramBox>
                  <ImageBackground
                    source={{ uri: pictogram.icono }}
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                    imageStyle={{ borderRadius: 16 }}
                  />
                  <PictogramText>{pictogram.nombre}</PictogramText>
                </PictogramBox>
              </TouchableOpacity>
            ))}
          </StyledPictogramsContainer>
        </PictogramsScreenContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PictogramsScreen;
