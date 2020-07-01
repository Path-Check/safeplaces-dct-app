import React from 'react';
import { StyleSheet } from 'react-native';
import { Typography } from '../../../components/Typography';

export const InfoText = ({
  titleStyle,
  descriptionStyle,
  useTitleStyle,
  useDescriptionStyle,
  title,
  description,
}) => {
  return (
    <>
      <Typography
        use={useTitleStyle}
        style={[styles.headingSpacing, titleStyle]}>
        {title}
      </Typography>
      {description && (
        <Typography
          use={useDescriptionStyle}
          style={[styles.description, descriptionStyle]}
          testID='description'>
          {description}
        </Typography>
      )}
    </>
  );
};

export const styles = StyleSheet.create({
  headingSpacing: {
    marginVertical: 30,
  },
  description: {
    marginBottom: 20,
  },
});
