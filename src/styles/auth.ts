import styled from "styled-components/native"
import { LinkButton } from "./common";

export const ButtonSupportText = styled.Text`
  color: white;
  font-size: 20px;
  text-align: center;
`

export const LinkGoogleAuthButton = styled(LinkButton)`
  background-color: #B3261E;
`;

export const LinkFacebookAuthButton = styled(LinkButton)`
  background-color: #21005D;
  background-color: #999999;
`;

export const LinkLoginButton = styled(LinkButton)`
  background-color: #21005D;
`;

export const LinkRegisterButton = styled(LinkButton)`
  background-color: #21005D;
`;

export const ButtonsAuthContainer = styled.View`
  margin: 40px 0 60px;
  width: 100%;
  align-items: center;
`