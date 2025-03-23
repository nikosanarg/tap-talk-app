import styled from 'styled-components/native';

export const TactileSelectionBox = styled.View`
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

export const NotificationBox = styled(TactileSelectionBox)`
  width: 250px;
  height: 250px;
  background-color: #f5f5f5;
  margin-bottom: 20px;
`;

export const NotificationText = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-top: 10px;
`;
