/**
 * Max esposure reporting window in days
 */
export const MAX_EXPOSURE_WINDOW_DAYS = 14;

/**
 * The value in minutes of each "bin" in the crossed path data.
 */
export const DEFAULT_EXPOSURE_PERIOD_MINUTES = 5;

/**
 * The value in minutes of how long an exposure at a location is
 *    considered concerning.
 */
export const DEFAULT_CONCERN_TIME_FRAME_MINUTES = 30;

/**
 * The value between 0 and 100 representing the required precentage of matches
 *    in one time frame for it to be considered concerning.
 */
export const DEFAULT_THRESHOLD_MATCH_PERCENT = 66;

/**
 * The value in minutes of how frequently we should check intersection data if
 *    there has been no change to the authorities
 */
export const MIN_CHECK_INTERSECT_INTERVAL = 6 * 60;

/**
 * The value in minutes for the background task service to register for firing
 */
export const BACKGROUND_TASK_INTERVAL = 15;

/**
 * Format of a single history item
 *
 * @typedef {{
 *   date: import("dayjs").Dayjs,
 *   exposureMinutes: number,
 * }} HistoryDay
 */

/**
 * Exposure history
 *
 * @typedef {!HistoryDay[]} History
 */
