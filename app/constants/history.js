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
