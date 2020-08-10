export const BUNDLE_IDS = {
    ANDROID: 'org.pathcheck.covidsafepaths',
    IOS: 'org.pathcheck.covid-safepaths'
};

export const getBundleId = () => {
    if(driver.isAndroid) {
        return BUNDLE_IDS.ANDROID;
    } else {
        return BUNDLE_IDS.IOS;
    }
};

export const ApplicationState = {
    UNKNOWN: 0,
    NOT_RUNNING: 1,
    IN_BACKGROUND_AND_SUSPENDED: 2,
    IN_BACKGROUND_AND_NOT_SUSPENDED: 3,
    RUNNING_IN_FOREGROUND: 4,
}
