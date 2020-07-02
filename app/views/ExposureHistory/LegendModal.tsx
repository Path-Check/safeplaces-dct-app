import React from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { Typography } from '../../components/Typography';

import {
  Affordances,
  Outlines,
  Colors,
  Iconography,
  Spacing,
  Typography as TypographyStyles,
} from '../../styles';

export type ModalState = 'Open' | 'Closed';

interface LegendItem {
  backgroundStyle: ViewStyle | null;
  badgeStyle: ViewStyle | null;
  textStyle: TextStyle;
  iconContent: string;
  itemText: string;
}

interface LegendModalProps {
  status: ModalState;
  handleOnCloseModal: () => void;
}

const LegendModal = ({
  status,
  handleOnCloseModal,
}: LegendModalProps): JSX.Element => {
  const { t } = useTranslation();
  const legendItems: LegendItem[] = [
    {
      backgroundStyle: styles.possibleExposureIcon,
      badgeStyle: null,
      textStyle: styles.possibleExposureText,
      iconContent: '2',
      itemText: t('exposure_history.legend.exposure_possible'),
    },
    {
      backgroundStyle: null,
      badgeStyle: null,
      textStyle: styles.noExposureText,
      iconContent: '3',
      itemText: t('exposure_history.legend.no_exposure_detected'),
    },
    {
      backgroundStyle: null,
      badgeStyle: styles.todayIcon,
      textStyle: styles.todayText,
      iconContent: '4',
      itemText: t('exposure_history.legend.today'),
    },
  ];

  return (
    <Modal animationType={'fade'} transparent visible={status === 'Open'}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleOnCloseModal} style={styles.overlay} />
        <View style={styles.cardContainer}>
          {legendItems.map((legendItem, index) => {
            return (
              <View style={styles.legendItem} key={index}>
                <View style={[styles.exposureIcon, legendItem.backgroundStyle]}>
                  <Text style={legendItem.textStyle}>
                    {legendItem.iconContent}
                  </Text>
                  <View style={legendItem.badgeStyle} />
                </View>

                <Typography style={styles.legendText}>
                  {legendItem.itemText}
                </Typography>
              </View>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: Colors.transparentDark,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    borderRadius: Outlines.largeBorderRadius,
    width: '80%',
    padding: Spacing.small,
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.white,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    ...TypographyStyles.label,
    ...TypographyStyles.bold,
  },
  exposureIcon: {
    ...Iconography.smallIcon,
    marginRight: Spacing.small,
  },
  possibleExposureIcon: {
    ...Iconography.possibleExposure,
  },
  expectedExposureIcon: {
    ...Iconography.expectedExposure,
  },
  todayIcon: {
    ...Affordances.smallBottomDotBadge(Colors.primaryBlue),
  },
  possibleExposureText: {
    ...Iconography.possibleExposureText,
  },
  expectedExposureText: {
    ...Iconography.expectedExposureText,
  },
  noExposureText: {
    ...Iconography.noExposureText,
  },
  todayText: {
    ...Iconography.todayText,
  },
});

export default LegendModal;
