export const eulaPicker = (selectedLocale: string): string => {
  if (selectedLocale) {
    return `https://covid-safe-paths-eula.herokuapp.com/${selectedLocale}`
  }
  return `https://covid-safe-paths-eula.herokuapp.com/en`
};
