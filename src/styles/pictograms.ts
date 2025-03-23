import styled from 'styled-components/native';
import { TactileSelectionBox } from '../components/tactileOptionButton/TactileOptionButtonStyled';

export const PictogramsScreenContainer = styled.View`
  flex-direction: column;
  align-items: center;
`;

export const StyledPictogramsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
  gap: 12px;
`;

export const PictogramBox = styled(TactileSelectionBox)`
  width: 140px;
  height: 140px;
  background-color: #e0e0e0;
  margin: 8px;
`;

export const PictogramIconBox = styled(TactileSelectionBox)`
  width: 140px;
  height: 140px;
  margin: 8px;
  background-color: #FFFFFF;
`;

export const PictogramText = styled.Text`
  font-size: 24px;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 20px;
  margin-top: -12px;
`;
