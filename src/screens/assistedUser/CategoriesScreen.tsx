import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCategories } from '../../contexts/CategoriesContext';
import { CategoryBox, CategoryText } from '../../styles/categories';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type CategoriesScreenNavProp = StackNavigationProp<RootStackParamList, 'Categories'>;

const CategoriesScreen = () => {
  const navigation = useNavigation<CategoriesScreenNavProp>()
  const { categories } = useCategories();

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate('Pictograms', { categoryId });
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 }}>Mensajes</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(category => (
            <CategoryBox>
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
              >
                <CategoryText>{category.nombre}</CategoryText>
              </TouchableOpacity>
            </CategoryBox>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
