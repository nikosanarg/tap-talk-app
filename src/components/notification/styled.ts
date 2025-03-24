import styled from "styled-components/native";

export const NotificationCardContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  background-color: #FFF;
  padding: 4px;
  margin: 4px;
  border-radius: 10px;
`

export const NotificationCategoryIcon = styled.View`
  text-align: center;
  padding: 10px 15px 0 14px;
  border-radius: 30px;
  margin: 0 10px 6px 0;
  background-color: #CCC;
`

export const BaseTouchableIconButton = styled.TouchableOpacity`
  position: relative;
  top: 1px;
`

export const NotificationCategoryLabel = styled.Text`
  font-weight: bold;
  font-size: 14;
  color:#fff;
`

export const NotificationCategoryTitle = styled.Text`
  font-size: 18;
  color:#333;
`

export const NotificationCategorySubtitle = styled.Text`
  font-size: 13;
  color:#666;
`