import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCategories } from '../../contexts/CategoriesContext';
import { useSupportGroup } from '../../contexts/SupportGroupContext';
import { CategoriesScreenContainer, CategoryBox, CategoryText, HelpButton, HelpButtonText, StyledCategoriesContainer } from '../../styles/categories';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AssistedUserHeader from '../../components/header/AssistedUserHeader';
import { ICategory } from '../../types/Category';

const activityIconImg: any = require('../../../assets/images/category-icons/activity.jpg');
const basicsIconImg: any = require('../../../assets/images/category-icons/basics.jpg');
const emotionsIconImg: any = require('../../../assets/images/category-icons/emotions.jpg');
const helpIconImg: any = require('../../../assets/images/category-icons/help.jpg');
const preferencesIconImg: any = require('../../../assets/images/category-icons/preferences.jpg');
const socialIconImg: any = require('../../../assets/images/category-icons/social.jpg');
const emptyIconImg: any = require('../../../assets/images/category-vacio.jpg');

const backgroundImages: Record<'Actividades' | 'Basicas' | 'Emociones' | 'Ayuda' | 'Preferencias' | 'Social' | 'Vacio', any> = {
  Actividades: activityIconImg,
  Basicas: basicsIconImg,
  Emociones: emotionsIconImg,
  Ayuda: helpIconImg,
  Preferencias: preferencesIconImg,
  Social: socialIconImg,
  Vacio: emptyIconImg,
}

type CategoriesScreenNavProp = StackNavigationProp<RootStackParamList, 'Categories'>;

const CategoriesScreen = () => {
  const navigation = useNavigation<CategoriesScreenNavProp>();
  const { categories, loading, error, setSelectedCategory, fetchCategories } = useCategories();
  const { supportGroup } = useSupportGroup();
  console.log(`👜 Categorías en CategoriesScreen (${categories.length}): ${categories?.map(c => c.nombre.slice(0, 3))}`);

  const handleCategoryPress = (category: ICategory) => {
    if (!supportGroup) return
    setSelectedCategory(category)
    navigation.navigate('Pictograms', { supportGroupId: supportGroup.id });
  };

  const handleHelpPress = () => {
    console.log('🔴 AYUDA presionado');
  };

  useEffect(() => {
    if (!supportGroup) {
      const removeGroupId = async () => {
        await AsyncStorage.removeItem('groupId');
      };
      removeGroupId();
    }
  }, [supportGroup]);

  useEffect(() => {
    fetchCategories();
  }, []);

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
        <AssistedUserHeader assistedUserName={supportGroup.nombreAsistido} />

        <CategoriesScreenContainer>
          <StyledCategoriesContainer>
            {categories.map(category => (
              <TouchableOpacity key={category.id} onPress={() => handleCategoryPress(category)}>
                <CategoryBox>
                  <ImageBackground
                    source={(backgroundImages[category.nombre as keyof typeof backgroundImages]) ?? emptyIconImg}
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                    imageStyle={{ borderRadius: 16 }}
                  >
                  </ImageBackground>
                </CategoryBox>
                <CategoryText>{category.nombre}</CategoryText>
              </TouchableOpacity>
            ))}
          </StyledCategoriesContainer>
          {/* <HelpButton onPress={handleHelpPress}>
            <HelpButtonText>AYUDA</HelpButtonText>
          </HelpButton> */}
        </CategoriesScreenContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
