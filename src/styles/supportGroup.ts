import styled from "styled-components/native";
import { ActionButton } from "./buttons";

export const LogoutActionButton = styled(ActionButton)`
  background-color: #E05154;
  padding: 6px 0;
  width: 40%;
  color: #FFFFFF;
`;

export const SupportGroupHeaderContainer = styled.View`
  margin: 20px 0 0;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
`

export const SupportGroupListContainer = styled.View`
  background-color: #E7E7E7;
  padding: 20px 0;
  margin: 20px auto;
  display: flex;
  border-radius: 20px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`