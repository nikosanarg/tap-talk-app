import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import { PictogramsScreenContainer, PictogramBox, PictogramText, StyledPictogramsContainer } from '../../styles/pictograms';
import { getCategoryColor } from '../../utils/getCategoryColor';
import { IPictogram } from '../../types/Pictogram';
import { basicPictograms } from '../../mocks/pictograms.mock';
import { StackNavigationProp } from '@react-navigation/stack';
import { validateCategoryName } from '../../utils/validateCategoryName';
import { EMPTY_ICON_PLACEHOLDER } from '../../utils/constants';
import { useCategories } from '../../contexts/CategoriesContext';

type PictogramsScreenRouteProp = RouteProp<RootStackParamList, 'Pictograms'>;
type PictogramsScreenNavProp = StackNavigationProp<RootStackParamList, 'Pictograms'>;

function PictogramsScreen(): React.JSX.Element {
  const route = useRoute<PictogramsScreenRouteProp>();
  const navigation = useNavigation<PictogramsScreenNavProp>();
  const { selectedCategory } = useCategories()

  const { supportGroupId } = route.params;
  const [pictograms, setPictograms] = useState<IPictogram[]>([]);
  const [categoryColor, setCategoryColor] = useState<string>('#ffffff');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCategory) throw Error(`La categoría "${selectedCategory}" no existe`)
    if (!validateCategoryName(selectedCategory)) throw Error(`La categoría "${selectedCategory}" no es válida`)
    setPictograms(basicPictograms[selectedCategory]);
    const color = getCategoryColor(selectedCategory);
    setCategoryColor(color);
  }, [selectedCategory]);

  const handlePictogramPress = async (pictogram: IPictogram, supportGroupId: string) => {
    console.log(`🟢 Pictograma seleccionado: ${pictogram.id}`);
    navigation.navigate('SendNotification', {
      pictogram,
      supportGroupId
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: categoryColor }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 }}>Pictogramas</Text>
        {errorMessage && <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text>}
        <PictogramsScreenContainer>
          <StyledPictogramsContainer>
            {pictograms.map(pictogram => (
              <TouchableOpacity key={pictogram.id} onPress={() => handlePictogramPress(pictogram, supportGroupId)}>
                <PictogramBox>
                  <ImageBackground
                    source={{ uri: pictogram.icono ?? EMPTY_ICON_PLACEHOLDER }}
                    style={{ width: '100%', height: '100%' }}
                    imageStyle={{ borderRadius: 16 }}
                  />
                </PictogramBox>
                <PictogramText>{pictogram.nombre}</PictogramText>
              </TouchableOpacity>
            ))}
          </StyledPictogramsContainer>
        </PictogramsScreenContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PictogramsScreen;
