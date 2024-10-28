import React, { useEffect, useState } from 'react';
import { GroupActionRightIcon, GroupCard, GroupSubtitle, GroupTextContainer, GroupTitle } from '../styles/assistCard';
import { IFirestoreSupportGroup, IFirestoreSupportMember } from '../types/SupportGroup';
import { formatDate } from '../utils/formatDate';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSupportGroup } from '../contexts/SupportGroupContext';

interface IAssistCardProps {
  group?: IFirestoreSupportGroup;
  member?: Partial<IFirestoreSupportMember>;
  callback: () => void
}

const AssistCard = ({ group, member, callback }: IAssistCardProps) => {
  const [dateMessage, setDateMessage] = useState('...')
  const { supportGroup } = useSupportGroup()
  useEffect(() => {
    let formattedDate = '...'
    if (group?.fechaCreacion) formattedDate = formatDate(group?.fechaCreacion)
    if (member?.fechaCreacion) formattedDate = formatDate(member.fechaCreacion)
    setDateMessage(formattedDate)
  }, [])

  return (
    <GroupCard>
      <GroupTextContainer>
        <GroupTitle>👤 {group?.nombreAsistido ?? member?.nombre}</GroupTitle>
        <GroupSubtitle>desde {dateMessage}</GroupSubtitle>
      </GroupTextContainer>
      {member
        ? member.id === supportGroup?.creadorId ? <></> : <TouchableOpacity onPress={callback}><Icon name="trash-bin" size={32} color="#E05154" /></TouchableOpacity>
        : <GroupActionRightIcon onPress={callback}>➲</GroupActionRightIcon>
      }
    </GroupCard>
  )
}

export default AssistCard