import React from 'react';
import { GroupActionRightIcon, GroupCard, GroupSubtitle, GroupTextContainer, GroupTitle } from '../styles/assistCard';
import { ISupportGroup } from '../types/SupportGroup';

interface ISupportGroupCardProps {
  group: ISupportGroup;
}

const SupportGroupCard = ({ group }: ISupportGroupCardProps) => {
  return (
    <GroupCard>
      <GroupTextContainer>
        <GroupTitle>👤 {group.name}</GroupTitle>
        <GroupSubtitle>desde {group.date}</GroupSubtitle>
      </GroupTextContainer>
      <GroupActionRightIcon>➲</GroupActionRightIcon>
    </GroupCard>
  )
}

export default SupportGroupCard