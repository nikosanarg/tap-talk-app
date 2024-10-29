import styled from 'styled-components/native';

export const PictogramsScreenContainer = styled.View`
  flex-direction: column;
  align-items: center;
`;

export const StyledPictogramsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
  gap: 12px;
`;

export const PictogramBox = styled.View`
  width: 140px;
  height: 140px;
  background-color: #e0e0e0;
  margin: 8px;
  border-radius: 16px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

export const PictogramText = styled.Text`
  font-size: 16px;
  color: #000;
  text-align: center;
  margin-top: 8px;
`;
