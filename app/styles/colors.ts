const applyOpacity = (hexColor: string, opacity: number): string => {
  const red = parseInt(hexColor.slice(1, 3), 16);
  const green = parseInt(hexColor.slice(3, 5), 16);
  const blue = parseInt(hexColor.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

// Black and White
export const black = '#000000';
export const white = '#ffffff';

// Grays
export const faintGray = '#f8f8f8';
export const lightestGray = '#ededed';
export const lighterGray = '#d3d3d3';
export const lightGray = '#999999';
export const gray = '#333333';
export const mediumGray = '#606060';
export const darkGray = '#4e4e4e';
export const darkestGray = '#2e2e2e';
export const steelGray = '#9BA0AA';
export const grayBlue = '#F8F8FF';

// Reds
export const red = '#eb0000';
export const emergencyRed = '#D00000';

export const primaryRed = red;
export const secondaryRed = emergencyRed;

// Blues
export const royalBlue = '#4051db';
export const cornflowerBlue = '#5061e6';

export const primaryBlue = royalBlue;
export const secondaryBlue = cornflowerBlue;

// Greens
export const shamrock = '#41dca4';

export const primaryGreen = shamrock;

// Yellows
export const amber = '#ffcc00';
export const champangne = '#f9edcc';

export const primaryYellow = amber;

// Violets
const jacksonsPurple = '#1f2c9b';
const moonRaker = '#e5e7fa';
const indigo = '#4754C5';
const melrose = '#a5affb';
const faintViolet = '#f8f8ff';

export const primaryViolet = jacksonsPurple;
export const secondaryViolet = indigo;
export const tertiaryViolet = moonRaker;
export const quaternaryViolet = melrose;

// Transparent
export const transparent = 'rgba(0, 0, 0, 0)';
export const transparentDarkGray = applyOpacity(lighterGray, 0.8);
export const transparentDark = 'rgba(0,0,0,0.7)';

// Accents
export const defaultBlue = primaryBlue;
export const defaultRed = primaryRed;

// Backgrounds
export const primaryBackground = faintViolet;
export const primaryBackgroundFaintShade = faintGray;
export const secondaryBackground = moonRaker;
export const tertiaryBackground = lighterGray;

export const invertedPrimaryBackground = primaryBlue;
export const invertedSecondaryBackground = secondaryBlue;
export const surveyPrimaryBackground = grayBlue;

export const bottomSheetBackground = white;

// Underlays, corresponding to the background to be used for
export const underlayPrimaryBackground = moonRaker;

// Borders
export const primaryBorder = primaryViolet;
export const secondaryBorder = lighterGray;
export const radioBorder = lightGray;

// Nav
export const mainNav = primaryViolet;
export const navBar = primaryViolet;

// Icons
export const icon = mediumGray;

// Buttons
export const disabledButton = darkGray;
export const disabledButtonText = quaternaryViolet;

// Switches
export const switchDisabled = lightGray;
export const switchEnabled = defaultBlue;

// Text
export const primaryText = darkestGray;
export const secondaryText = darkGray;
export const tertiaryText = secondaryBlue;

export const invertedText = white;

export const primaryHeaderText = primaryViolet;
export const secondaryHeaderText = secondaryViolet;

export const linkText = primaryViolet;
export const linkTextInvert = amber;
export const errorText = primaryRed;

// Forms
export const formInputBackground = primaryBackgroundFaintShade;
export const formInputBorder = tertiaryBackground;
export const placeholderTextColor = lightGray;

export const success = primaryGreen;
export const warning = primaryYellow;

// Onboarding
export const onboardingIconYellow = champangne;
export const onboardingIconBlue = moonRaker;

// Exposure History
export const possibleExposure = royalBlue;
export const expectedExposure = amber;
