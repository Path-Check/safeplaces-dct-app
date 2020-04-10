/**
 * Checks the download folder, unzips and imports all data from Google TakeOut
 */
import { unzip, subscribe } from 'react-native-zip-archive';
import { mergeJSONWithLocalData } from '../helpers/GoogleData';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export class NoRecentLocationsError extends Error {}
export class InvalidFileExtensionError extends Error {}

const ZIP_EXT_CHECK_REGEX = /\.zip$/;
let progress;
const MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];
/**
 * Safe paths is interested in locations for latest a couple of weeks.
 * Date for latest 2 months should be sufficient to cover all cases,
 * especially the case when we are in the early days of the current month.
 * @returns {string[]} - array of files for latest 2 months from google takeout archive
 */
export function getFilenamesForLatest2Months(rootPath) {
  const now = new Date();
  const previousMonth = new Date();
  previousMonth.setMonth(now.getMonth() - 1);

  return [previousMonth, now].map(date => {
    const year = date.getFullYear();
    const monthStr = MONTHS[date.getMonth()];
    return (
      `${rootPath}/Takeout/Location History/Semantic Location History/${year}/` +
      `${year}_${monthStr}.json`
    );
  });
}

// Imports any Takeout location data
// Currently works for Google Takeout Location data
export async function importTakeoutData(filePath) {
  let unifiedPath = filePath;

  if (Platform.OS === 'ios') {
    unifiedPath = filePath.replace('file://', '');
  }

  if (!ZIP_EXT_CHECK_REGEX.test(unifiedPath)) {
    throw new InvalidFileExtensionError();
  }

  // UnZip Progress Bar Log.
  // progress callback is required by unzip().
  progress = subscribe(
    ({
      progress,
      //  unifiedPath
    }) => {
      if (Math.trunc(progress * 100) % 10 === 0)
        console.log('[INFO] Unzipping', Math.trunc(progress * 100), '%');
    },
  );

  const extractDir = `${
    RNFS.CachesDirectoryPath
  }/Takeout-${new Date().toISOString()}`;

  console.log('[INFO] Takeout import start. Path:', unifiedPath);

  let newLocations = [];
  let path;
  let parsedFilesCount = 0;
  try {
    path = await unzip(unifiedPath, extractDir);

    console.log(`[INFO] Unzip Completed for ${path}`);

    const monthlyLocationFiles = getFilenamesForLatest2Months(path);
    for (const filepath of monthlyLocationFiles) {
      console.log('[INFO] File to import:', filepath);

      const isExist = await RNFS.exists(filepath);
      if (isExist) {
        const contents = await RNFS.readFile(filepath);

        newLocations = [
          ...newLocations,
          ...(await mergeJSONWithLocalData(JSON.parse(contents))),
        ];

        console.log('[INFO] Imported file:', filepath);
        parsedFilesCount++;
      }
    }
  } catch (err) {
    console.error('[Error] Failed to import Google Takeout', err);
  }
  // clean up unzipped folders
  if (path) {
    await RNFS.unlink(path);
  }
  progress.remove();
  if (parsedFilesCount === 0) {
    throw new NoRecentLocationsError();
  }
  return newLocations;
}
