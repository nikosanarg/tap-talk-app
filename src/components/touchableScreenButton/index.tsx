import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { SupportText } from '../../styles/auth';
import { BaseTouchableIconButton} from '../notification/styled';
import { BaseTouchableIcon } from '../../styles/touchableMenu';

interface TouchableMenuButtonProps {
  title: string;
  iconName: string;
  onPress: () => void;
  disabled?: boolean;
}

const TouchableMenuButton: React.FC<TouchableMenuButtonProps> = ({ title, iconName, onPress, disabled }) => {
  return (
    <BaseTouchableIcon disabled={disabled} onPress={disabled ? undefined : onPress}>
      <SupportText
        style={{
          fontSize: 14,
          color: disabled ? "#AAAAAA" : "#333333",
          fontWeight: "500",
        }}
      >
        {title}
      </SupportText>
      <BaseTouchableIconButton onPress={disabled ? undefined : onPress} disabled={disabled}>
        <Icon name={iconName} size={26} color={disabled ? "#AAAAAA" : "#9D6ACD"} />
      </BaseTouchableIconButton>
    </BaseTouchableIcon>
  );
};

export default TouchableMenuButton;
