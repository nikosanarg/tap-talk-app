import styled from "styled-components/native"
import { TextInput } from "react-native";
import { LinkButton } from "./buttons";

export const ButtonSupportText = styled.Text`
  color: white;
  font-size: 20px;
  text-align: center;
`

export const StyledAuthButton = styled(LinkButton)`
  background-color: #21005D;
`;

export const AuthSecondaryButton = styled(LinkButton)`
  border-color: #21005D;
  color: #21005D;
`;

export const StyledAuthTextInput = styled(TextInput)`
  width: 86%;
  margin-bottom: 10px;
  padding: 15px 20px; 
  border-width: 2px; 
  border-color: #D0B5D0;
  border-radius: 6px;
  font-size: 20px;
  color: #000;
`

export const StyledContextualView = styled.View`
  margin: 20px 0 0;
  width: 100%;
  align-items: center;
`

export const AssistedUserRoleButton = styled(LinkButton)`
  background-color: #E05154;
  color: #FFFFFF;
`;

export const StyledRegisterButton = styled(LinkButton)`
  background-color: #E05154;
  color: #FFFFFF;
`;

export const SupportText = styled.Text`
  font-size: 24px;
  color: #65558F;
  margin: 8px 0;
  text-align: center;
`

export const SupportTextAuthContainer = styled.View`
  margin: 20px 0 40px;
  width: 90%;
`