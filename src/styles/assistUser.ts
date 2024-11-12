import styled from 'styled-components/native';
import { TactileSelectionBox } from '../components/tactileOptionButton/TactileOptionButtonStyled';

export const NotificationBox = styled(TactileSelectionBox)`
  width: 250px;
  height: 250px;
  background-color: #f5f5f5;
  margin-bottom: 20px;
`;

export const NotificationText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #4a4a4a;
  text-align: center;
  margin-top: 10px;
`;
