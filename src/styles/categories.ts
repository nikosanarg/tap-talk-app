import styled from 'styled-components/native';
import { TactileSelectionBox } from './assistUser';

export const CategoriesScreenContainer = styled.View`
  flex-direction: column;
  align-items: center;
`;

export const StyledCategoriesContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
  gap: 12px;
`;

export const CategoryBox = styled(TactileSelectionBox)`
  width: 160px;
  height: 160px;
  background-color: #e0e0e0;
  margin: 8px;
`;

export const CategoryText = styled.Text`
  font-size: 28px;
  color: #000000;
  text-align: center;
  position: relative;
  bottom: 10px;
  align-self: center;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #6c63ff;
  text-align: center;
  margin-vertical: 16px;
`;

export const HelpButton = styled.TouchableOpacity`
  background-color: #df1d1d;
  padding: 20px 40px;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  margin-bottom: 20px;
`;

export const HelpButtonText = styled.Text`
  color: #fff;
  font-size: 72px;
  font-weight: bold;
`;
