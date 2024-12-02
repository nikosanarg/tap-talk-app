import styled from "styled-components/native";
import { ActionButton } from "./buttons";

export const GroupCard = styled.TouchableOpacity`
  background-color: #FFF;
  border: 1px solid #BBB;
  padding: 0px 16px 0px 32px;
  margin: 2px 4px;
  width: 98%;
  min-height: 72px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const GroupTextContainer = styled.View`
  flex-direction: column;
`;

export const GroupTitle = styled.Text`
  font-size: 16px;
  color: #65558F;
`;

export const GroupSubtitle = styled.Text`
  font-size: 12px;
  color: #65558F;
`;

export const GroupActionButton = styled(ActionButton)`
  background-color: #E05154;
  color: #FFFFFF;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  `;
  
  export const GroupActionRightIcon = styled.Text`
  font-size: 48px;
  color: #C7B0FF;
  text-align: center;
  padding-bottom: 6px;
`
