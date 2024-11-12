import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { TactileSelectionBox } from './TactileOptionButtonStyled';

interface TactileOptionButtonProps {
  sourceUri: string;
}

const TactileOptionButton: React.FC<TactileOptionButtonProps> = ({ sourceUri }) => {
  return (
    <TactileSelectionBox>
      <ImageBackground
        source={{ uri: sourceUri }}
        style={styles.imageBackground}
        imageStyle={styles.imageRadius}
      />
    </TactileSelectionBox>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  imageRadius: {
    borderRadius: 16,
  },
});

export default TactileOptionButton;
