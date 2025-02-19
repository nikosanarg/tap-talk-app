import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { SupportText } from '../../styles/auth';
import { BaseTouchableIconButton} from '../notification/styled';
import { BaseTouchableIcon } from '../../styles/touchableMenu';
import { View } from 'react-native';

interface TouchableMenuButtonProps {
  title: string;
  subtitle?: string;
  subtitleVisible?: boolean;
  iconName: string;
  onPress: () => void;
  disabled?: boolean;
}

const TouchableMenuButton: React.FC<TouchableMenuButtonProps> = ({ title, subtitle, subtitleVisible, iconName, onPress, disabled }) => {
  return (
    <BaseTouchableIcon disabled={disabled} onPress={disabled ? undefined : onPress}>
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <SupportText
          style={{
            fontSize: 14,
            color: disabled ? "#AAAAAA" : "#333333",
            fontWeight: "500",
          }}
        >
          {title}
        </SupportText>
        {subtitle && subtitleVisible && (
          <SupportText
            style={{
              fontSize: 20,
              lineHeight: 22,
              color: "#666666",
              fontWeight: "400",
              marginTop: -4,
            }}
          >
            {subtitle}
          </SupportText>
        )}
      </View>
      <BaseTouchableIconButton onPress={disabled ? undefined : onPress} disabled={disabled}>
        <Icon name={iconName} size={26} color={disabled ? "#AAAAAA" : "#9D6ACD"} />
      </BaseTouchableIconButton>
    </BaseTouchableIcon>
  );
};

export default TouchableMenuButton;
