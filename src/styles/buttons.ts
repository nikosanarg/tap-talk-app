import styled from "styled-components/native";

export const LinkButton = styled.TouchableOpacity`
  background-color: #65558F;
  padding: 15px 50px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  width: 86%;
  border-radius: 10px;
`

export const ButtonText = styled.Text`
  color: white;
  font-size: 28px;
  text-align: center;
`

const ActionButton = styled.TouchableOpacity`
  padding: 10px 50px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border-radius: 4px;
`

export const LogoutActionButton = styled(ActionButton)`
  background-color: #E05154;
  color: #FFFFFF;
`;

export const GroupActionButton = styled(ActionButton)`
  background-color: #E05154;
  color: #FFFFFF;
`;

export const MenuActionButton = styled(ActionButton)`
  background-color: #65558F;
  width: 86%;
  color: #FFFFFF;
`;

export const ActionButtonText = styled.Text`
  color: white;
  font-size: 16px;
  text-align: center;
`
