import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { PictogramsScreenContainer, PictogramText, StyledPictogramsContainer, PictogramIconBox } from '../../styles/pictograms';
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
    
    console.log(`🎨 Categoría: ${selectedCategory.nombre}, Color: ${selectedCategory.color}`);
    setCategoryColor(selectedCategory.color || '#e0e0e0');
    const fetchedPictograms = pictograms[selectedCategory.id] || basicPictograms[selectedCategory.nombre as keyof typeof basicPictograms] || [];
    setCategoryPictograms(fetchedPictograms);
  }, [selectedCategory, pictograms]);

  const handlePictogramPress = (pictogram: IPictogram) => {
    console.log(`🟢 Pictograma seleccionado: ${pictogram.nombre} (ID ${pictogram.id}) para grupo ${supportGroupId}`);
    navigation.navigate('SendNotification', {
      pictogram,
      supportGroupId,
    });
  };

  const getButtonPictogramToShow = (pictogram: IPictogram, categoryColor: string) => {
    console.log(`🎨 Renderizando ${pictogram.nombre}: color="${categoryColor}", icono="${pictogram.icono}"`);
    if (pictogram.icono && pictogram.icono !== "") {
      return (
        <Icon name={pictogram.icono} size={80} color={categoryColor || '#333333'} />
      );
    } else if (pictogram.imagen_url) {
      return (
        <ImageBackground
          source={{ uri: pictogram.imagen_url }}
          style={{ width: '100%', height: '100%' }}
          imageStyle={{ borderRadius: 16 }}
        />
      );
    } else {
      return (
        <Icon name="help-outline" size={80} color="#999999" />
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: categoryColor }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 36, color: '#000000' }}>
          Pictogramas - {selectedCategory?.nombre}
        </Text>
        {categoryPictograms.length === 0 ? (
          <Text style={{ textAlign: 'center', marginVertical: 20, color: '#000000', fontSize: 18 }}>
            No hay pictogramas disponibles.
          </Text>
        ) : (
          <PictogramsScreenContainer>
            <StyledPictogramsContainer>
              {categoryPictograms.map((pictogram) => (
                <TouchableOpacity
                  key={pictogram.id}
                  onPress={() => handlePictogramPress(pictogram)}
                  style={{ margin: 8 }}
                >
                  <PictogramIconBox>
                    {getButtonPictogramToShow(pictogram, categoryColor)}
                  </PictogramIconBox>
                  <PictogramText style={{ color: '#000000' }}>{pictogram.nombre}</PictogramText>
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
