import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { AssistedUserHeaderText, LogoutActionButton, LogoutButtonText, SupportGroupHeaderContainer } from './headerStyled';

interface AssistedUserHeaderProps {
  assistedUserName: string
}

const AssistedUserHeader = ({ assistedUserName }: AssistedUserHeaderProps) => {
  const { user, handleLogout } = useUser();

  return (
    <SupportGroupHeaderContainer>
      <AssistedUserHeaderText>{`¡Hola${assistedUserName ? `, ${assistedUserName}` : ''}!`}</AssistedUserHeaderText>
      <LogoutActionButton onPress={handleLogout}>
        <LogoutButtonText>Salir</LogoutButtonText>
      </LogoutActionButton>
    </SupportGroupHeaderContainer>
  );
};

export default AssistedUserHeader;

// kkdia0j5kap7j5p3