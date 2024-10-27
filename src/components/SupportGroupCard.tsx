import React from 'react';
import { GroupActionRightIcon, GroupCard, GroupSubtitle, GroupTextContainer, GroupTitle } from '../styles/assistCard';
import { IFirestoreSupportGroup } from '../types/SupportGroup';
import { formatDate } from '../utils/formatDate';

interface ISupportGroupCardProps {
  group: IFirestoreSupportGroup;
  callback: () => void
}

const SupportGroupCard = ({ group, callback }: ISupportGroupCardProps) => {
  return (
    <GroupCard>
      <GroupTextContainer>
        <GroupTitle>👤 {group.nombreAsistido}</GroupTitle>
        <GroupSubtitle>desde {formatDate(group.fechaCreacion)}</GroupSubtitle>
      </GroupTextContainer>
      <GroupActionRightIcon onPress={callback}>➲</GroupActionRightIcon>
    </GroupCard>
  )
}

export default SupportGroupCard