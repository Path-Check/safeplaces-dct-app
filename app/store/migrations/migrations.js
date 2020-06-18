// Intentionally in JS to allow ensuring we can directly edit state between migrations.
const migrations = {
  0: (prevState) => prevState,
  // Migration 1: We introduce the "availableCustomAuthorities" property to the "healthcareAuthorities" slice
  1: (prevState) => {
    if (prevState && prevState.healthcareAuthorities) {
      prevState.healthcareAuthorities.availableCustomAuthorities = [];
    }
    return prevState;
  },
};

export default migrations;
