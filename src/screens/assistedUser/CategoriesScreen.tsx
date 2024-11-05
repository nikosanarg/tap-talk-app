import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCategories } from '../../contexts/CategoriesContext';
import { useSupportGroup } from '../../contexts/SupportGroupContext';
import { CategoriesScreenContainer, CategoryBox, CategoryText, HelpButton, HelpButtonText, StyledCategoriesContainer } from '../../styles/categories';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundImageAcciones: any = require('../../../assets/images/category-acciones.jpg');
const backgroundImageGente: any = require('../../../assets/images/category-gente.jpg');
const backgroundImageSalud: any = require('../../../assets/images/category-salud.jpg');
const backgroundImageComida: any = require('../../../assets/images/category-comida.jpg');
const backgroundImageVacio: any = require('../../../assets/images/category-vacio.jpg');

const backgroundImages: Record<'Acciones' | 'Gente' | 'Salud' | 'Comida', any> = {
  Acciones: backgroundImageAcciones,
  Gente: backgroundImageGente,
  Salud: backgroundImageSalud,
  Comida: backgroundImageComida,
}

type CategoriesScreenNavProp = StackNavigationProp<RootStackParamList, 'Categories'>;

const CategoriesScreen = () => {
  const navigation = useNavigation<CategoriesScreenNavProp>();
  const { categories, loading, error } = useCategories();
  const { supportGroup } = useSupportGroup();

  const handleCategoryPress = (categoryId: string) => {
    if (!supportGroup) return
    navigation.navigate('Pictograms', { categoryId, supportGroupId: supportGroup.id });
  };

  const handleHelpPress = () => {
    console.log('AYUDA presionado');
  };

  useEffect(() => {
    if (!supportGroup) {
      const removeGroupId = async () => {
        await AsyncStorage.removeItem('groupId');
      };
      removeGroupId();
    }
  }, [supportGroup]);

  if (loading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!supportGroup) {
    return (
      <SafeAreaView>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
          No se encontró información del grupo de apoyo. Por favor, reinicie la aplicación.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 }}>
          {supportGroup.nombreAsistido}
        </Text>
        <CategoriesScreenContainer>
          <StyledCategoriesContainer>
            {categories.map(category => (
              <TouchableOpacity key={category.id} onPress={() => handleCategoryPress(category.id)}>
                <CategoryBox>
                  <ImageBackground
                    source={(backgroundImages[category.nombre as keyof typeof backgroundImages]) ?? backgroundImageVacio}
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                    imageStyle={{ borderRadius: 16 }}
                  >
                  </ImageBackground>
                </CategoryBox>
                <CategoryText>{category.nombre}</CategoryText>
              </TouchableOpacity>
            ))}
          </StyledCategoriesContainer>
          <HelpButton onPress={handleHelpPress}>
            <HelpButtonText>AYUDA</HelpButtonText>
          </HelpButton>
        </CategoriesScreenContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;