/**
 * The max amount of attempts to get desired accuracy.
 * @type {number}
 */
export const MAX_ACCURACY_RETRY = 2;

/**
 * The desired accuracy (in meters) quality which serves as a threshold.
 *
 * @type {number}
 */
export const DESIRED_ACCURACY_QUALITY = 30;

/**
 * The desired location interval, and the minimum acceptable interval.
 * Time (in milliseconds) between location information polls.
 * E.g. 60000*5 = 5 minutes
 * @type {number}
 */
export const LOCATION_INTERVAL = 60000 * 5;

/**
 * Maximum time that we will backfill for missing data
 * Time (in milliseconds).  60000 * 60 * 8 = 24 hours
 * @type {number}
 */
export const MAX_BACKFILL_TIME = 60000 * 60 * 24;
