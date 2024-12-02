import React, { useEffect, useState } from 'react';
import { GroupActionRightIcon, GroupCard, GroupSubtitle, GroupTextContainer, GroupTitle } from '../styles/assistCard';
import { IFirestoreSupportGroup, IFirestoreSupportMember } from '../types/SupportGroup';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSupportGroup } from '../contexts/SupportGroupContext';

interface IAssistCardProps {
  group?: IFirestoreSupportGroup;
  member?: Partial<IFirestoreSupportMember>;
  callback: () => void
}

const AssistCard = ({ group, member, callback }: IAssistCardProps) => {
  const { supportGroup } = useSupportGroup()

  return (
    <GroupCard onPress={callback}>
      <GroupTextContainer>
        <GroupTitle>👤 {group?.nombreAsistido ?? member?.nombre}</GroupTitle>
      </GroupTextContainer>
      {member
        ? member.id === supportGroup?.creadorId ? <></> : <TouchableOpacity onPress={callback}><Icon name="trash-bin" size={32} color="#E05154" /></TouchableOpacity>
        : <GroupActionRightIcon onPress={callback}>➲</GroupActionRightIcon>
      }
    </GroupCard>
  )
}

export default AssistCard