import React from 'react'
import { IFirestoreUser } from '../../types/User'
import { HeaderText, LogoutActionButton, LogoutButtonText, SupportGroupHeaderContainer } from './header'

interface HeaderProps {
  user: IFirestoreUser | null
  handleLogout: () => void
}

const Header = ({ user, handleLogout }: HeaderProps) => { 
  return (
    <SupportGroupHeaderContainer>
      <HeaderText>{`¡Hola${user?.nombre ? `, ${user.nombre}` : ''}!`}</HeaderText>
      <LogoutActionButton onPress={handleLogout}>
        <LogoutButtonText>Cerrar sesión</LogoutButtonText>
      </LogoutActionButton>
    </SupportGroupHeaderContainer>
  )
}

export default Header