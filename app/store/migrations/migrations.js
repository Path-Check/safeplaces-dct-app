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
  // Migration 2: Introduce auto-subscription
  2: (prevState) => {
    if (prevState && prevState.healthcareAuthorities) {
      prevState.healthcareAuthorities.autoSubscription = {
        bannerDismissed: false,
        selectedAuthority: null,
        // only auto-subscribe if user has no HAs.
        active:
          !prevState.healthcareAuthorities.availableCustomAuthorities ||
          prevState.healthcareAuthorities.availableCustomAuthorities.length ===
            0,
      };
    }
    return prevState;
  },
};

export default migrations;
