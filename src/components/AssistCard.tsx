import React, { useEffect, useState } from 'react';
import { GroupActionRightIcon, GroupCard, GroupSubtitle, GroupTextContainer, GroupTitle, StyledBadgeContainer, StyledBadgeText } from '../styles/assistCard';
import { AuxiliarGrupo } from '../services/GrupoApiService';
import { Grupo } from '../services/GrupoApiService';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSupportGroup } from '../contexts/SupportGroupContext';

interface IAssistCardProps {
  group?: Grupo;
  member?: Partial<AuxiliarGrupo>;
  pendingCount: number;
  callback: () => void
}

const AssistCard = ({ group, member, callback, pendingCount }: IAssistCardProps) => {
  const { supportGroup } = useSupportGroup()

  return (
    <GroupCard onPress={callback}>
      <GroupTextContainer>
        <GroupTitle>👤 {group?.nombre_paciente ?? member?.nombre}</GroupTitle>
      </GroupTextContainer>
      {pendingCount > 0 && (
        <StyledBadgeContainer>
          <StyledBadgeText>{pendingCount}</StyledBadgeText>
        </StyledBadgeContainer>
      )}
      {member
        ? member.id === supportGroup?.creador_id ? <></> : <TouchableOpacity onPress={callback}><Icon name="trash-bin" size={32} color="#E05154" /></TouchableOpacity>
        : <GroupActionRightIcon onPress={callback}>➲</GroupActionRightIcon>
      }
    </GroupCard>
  )
}

export default AssistCard