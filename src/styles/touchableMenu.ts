import styled from "styled-components/native";

export const TouchableMenu = styled.View`
  display: flex;
  flex-direction: column;
  margin: 16px auto;
  gap: 8px;
  width: 66%;
`

export const BaseTouchableIcon = styled.TouchableOpacity<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  width: 100%;
  padding: 6px 15px;
  background-color: ${({ disabled }) => (disabled ? "#F0F0F0" : "#FFFFFF")};
  border: 1px solid ${({ disabled }) => (disabled ? "#CCCCCC" : "#E0E0E0")};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;