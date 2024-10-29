import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCategories } from '../../contexts/CategoriesContext';
import { useSupportGroup } from '../../contexts/SupportGroupContext';
import { CategoryBox, CategoryText } from '../../styles/categories';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CategoriesScreenNavProp = StackNavigationProp<RootStackParamList, 'Categories'>;

const CategoriesScreen = () => {
  const navigation = useNavigation<CategoriesScreenNavProp>();
  const { categories, loading, error } = useCategories();
  const { supportGroup } = useSupportGroup(); 

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate('Pictograms', { categoryId });
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
          {`¡Hola, ${supportGroup.nombreAsistido}!`}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(category => (
            <CategoryBox key={category.id}>
              <TouchableOpacity onPress={() => handleCategoryPress(category.id)}>
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
