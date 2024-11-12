import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { HeaderText, LogoutActionButton, LogoutButtonText, SupportGroupHeaderContainer } from './headerStyled';

const Header = () => {
  const { user, handleLogout } = useUser();

  return (
    <SupportGroupHeaderContainer>
      <HeaderText>{`¡Hola${user?.nombre ? `, ${user.nombre}` : ''}!`}</HeaderText>
      <LogoutActionButton onPress={handleLogout}>
        <LogoutButtonText>Cerrar sesión</LogoutButtonText>
      </LogoutActionButton>
    </SupportGroupHeaderContainer>
  );
};

export default Header;