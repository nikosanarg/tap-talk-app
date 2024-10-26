import styled from "styled-components/native";
import { ActionButton } from "../../styles/buttons";

export const SupportGroupHeaderContainer = styled.View`
  width: 100%;
  background-color: rgb(250, 190, 230);
  padding: 5px 16px 2px 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const HeaderText = styled.Text`
  font-size: 20px;
  color: #65558F;
  text-align: center;
`

export const LogoutActionButton = styled(ActionButton)`
  width: fit-content;
  background-color: rgb(255, 80, 100);
  color: rgb(255, 255, 255);
  padding: 8px 12px;
  border-radius: 50px;
  font-weight: 400;
  position: relative;
  top: 8px;
`;

export const LogoutButtonText = styled.Text`
  color: white;
  font-size: 12px;
  text-align: center;
`