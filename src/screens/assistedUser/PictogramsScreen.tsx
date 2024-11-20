import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { PictogramsScreenContainer, PictogramBox, PictogramText, StyledPictogramsContainer } from '../../styles/pictograms';
import { getCategoryColor } from '../../utils/getCategoryColor';
import { EMPTY_ICON_PLACEHOLDER } from '../../utils/constants';
import { useCategories } from '../../contexts/CategoriesContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { IPictogram } from '../../types/Pictogram';

type PictogramsScreenRouteProp = RouteProp<RootStackParamList, 'Pictograms'>;
type PictogramsScreenNavProp = StackNavigationProp<RootStackParamList, 'Pictograms'>;

function PictogramsScreen(): React.JSX.Element {
  const route = useRoute<PictogramsScreenRouteProp>();
  const navigation = useNavigation<PictogramsScreenNavProp>();
  const { selectedCategory, pictograms } = useCategories();
  const [categoryPictograms, setCategoryPictograms] = useState<IPictogram[]>([]);
  
  const { supportGroupId } = route.params;
  const [categoryColor, setCategoryColor] = useState<string>('#ffffff');
  
  useEffect(() => {
    if (!selectedCategory) {
      console.log('🚫 Error: Categoría no seleccionada');
      return;
    }
    const color = getCategoryColor(selectedCategory.nombre);
    setCategoryColor(color);
    const fetchedPictograms = pictograms[selectedCategory.id] || [];
    console.log(`🙏 Pictogramas en PictogramsScreen: ${fetchedPictograms?.map(p => p.nombre)}`);

    setCategoryPictograms(fetchedPictograms);
  }, [selectedCategory, pictograms]);

  const handlePictogramPress = (pictogram: IPictogram) => {
    console.log(`🟢 Pictograma seleccionado: ${pictogram.nombre} (ID ${pictogram.id})`);
    navigation.navigate('SendNotification', {
      pictogram,
      supportGroupId,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: categoryColor }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 }}>
          Pictogramas
        </Text>
        {categoryPictograms.length === 0 ? (
          <Text style={{ textAlign: 'center', marginVertical: 20 }}>No hay pictogramas disponibles.</Text>
        ) : (
          <PictogramsScreenContainer>
            <StyledPictogramsContainer>
              {categoryPictograms.map((pictogram) => (
                <TouchableOpacity
                  key={pictogram.id}
                  onPress={() => handlePictogramPress(pictogram)}
                >
                  <PictogramBox>
                    <ImageBackground
                      source={{ uri: pictogram.imagenUrl ?? EMPTY_ICON_PLACEHOLDER }}
                      style={{ width: '100%', height: '100%' }}
                      imageStyle={{ borderRadius: 16 }}
                    />
                  </PictogramBox>
                  <PictogramText>{pictogram.nombre}</PictogramText>
                </TouchableOpacity>
              ))}
            </StyledPictogramsContainer>
          </PictogramsScreenContainer>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default PictogramsScreen;
