import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { PictogramsScreenContainer, PictogramBox, PictogramText, StyledPictogramsContainer, PictogramIconBox } from '../../styles/pictograms';
import { useCategories } from '../../contexts/CategoriesContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { IPictogram } from '../../types/Pictogram';
import { basicPictograms } from '../../mocks/pictograms.mock';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EMPTY_ICON_PLACEHOLDER } from '../../utils/constants';

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
    console.log(`🟢 Categoría seleccionada: ${selectedCategory.nombre} (ID ${selectedCategory.id})`);
    setCategoryColor(selectedCategory.color || '#e0e0e0');
    const fetchedPictograms = pictograms[selectedCategory.id] || basicPictograms[selectedCategory.nombre as keyof typeof basicPictograms] || [];
    console.log(`👜 Pictogramas en PictogramsScreen: ${fetchedPictograms?.map((p: IPictogram) => p.nombre)}`);

    setCategoryPictograms(fetchedPictograms);
  }, [selectedCategory, pictograms]);

  const handlePictogramPress = (pictogram: IPictogram) => {
    console.log(`🟢 Pictograma seleccionado: ${pictogram.nombre} (ID ${pictogram.id}) para grupo ${supportGroupId}`);
    navigation.navigate('SendNotification', {
      pictogram,
      supportGroupId,
    });
  };

  const getButtonPictogramToShow = (pictogram: IPictogram) => {
    if (pictogram.icono !== "") {
      return (
        <PictogramIconBox>
          <Icon name={pictogram.icono ?? 'search-off'} size={128} color={categoryColor ?? '#9E9E9E'} />
        </PictogramIconBox>
      );
    } else {
      return (
        <PictogramBox>
          <ImageBackground
            source={{ uri: pictogram.imagenUrl ?? EMPTY_ICON_PLACEHOLDER }}
            style={{ width: '100%', height: '100%' }}
            imageStyle={{ borderRadius: 16 }}
          />
        </PictogramBox>
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: categoryColor }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 36 }}>
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
                  { getButtonPictogramToShow(pictogram) }
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
