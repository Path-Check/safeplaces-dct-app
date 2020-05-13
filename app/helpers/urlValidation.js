export const MAX_URL_LENGTH = 8000;

// https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
export const URL_REGEX = new RegExp(
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[-a-zA-Z0-9]+([-.]{1}[-a-zA-Z0-9]+)*\.[-a-zA-Z0-9]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm,
);

/**
 * Verifies that the url matches the `URL_REGEX` pattern
 * and is less than 8000 chars.
 * @param {string} url
 * @returns boolean
 */
export function isValidUrl(url) {
  return url.match(URL_REGEX) !== null && url.length <= MAX_URL_LENGTH;
}
