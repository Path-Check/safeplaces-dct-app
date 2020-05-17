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
export const CONCERN_TIME_WINDOW_MINUTES = 4 * 60; // 4 hours, in minutes

/**
 * The value in minutes of how frequently we should check intersection data if
 *    there has been no change to the authorities
 */
export const MIN_CHECK_INTERSECT_INTERVAL = 6 * 60;

/**
 * The value in minutes for the background task service to register for firing
 */
export const INTERSECT_INTERVAL = 60 * 12; // 12 Hours, the value is received in minutes

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
