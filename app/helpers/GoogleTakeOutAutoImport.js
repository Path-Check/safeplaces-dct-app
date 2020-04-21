import dayjs from 'dayjs';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
/**
 * Checks the download folder, unzips and imports all data from Google TakeOut
 */
import { subscribe, unzip } from 'react-native-zip-archive';

import { mergeJSONWithLocalData } from '../helpers/GoogleData';

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
export function getFilenamesForLatest2Months(rootPath, now) {
  const previousMonth = dayjs(now).subtract(1, 'month');

  return [previousMonth, now].map(date => {
    const year = date.year();
    const monthStr = MONTHS[date.month()];
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

    const monthlyLocationFiles = getFilenamesForLatest2Months(path, dayjs());
    for (const filepath of monthlyLocationFiles) {
      console.log('[INFO] File to import:', filepath);

      const isExist = await RNFS.exists(`file://${filepath}`);
      if (isExist) {
        console.log('[INFO] File exists:', `file://${filepath}`);

        const contents = await RNFS.readFile(`file://${filepath}`).catch(
          err => {
            console.log(
              `[INFO] Caught error on opening "file://${filepath}"`,
              err,
            );
            console.log(
              `[INFO] Attempting to open file "file://${filepath}" again`,
              err,
            );

            /**
             * IMPORTANT!!!
             * A temporary hack around URI generation bug in react-native-fs on android.
             * An exception is thrown as `file://` is not in the file URI:
             * "Error: ENOENT: No content provider:
             *  /data/user/0/edu.mit.privatekit/cache/Takeout-2020-04-12T15:48:54.295Z/Takeout/Location History/Semantic Location History/2020/2020_APRIL.json,
             *  open '/data/user/0/edu.mit.privatekit/cache/Takeout-2020-04-12T15:48:54.295Z/Takeout/Location History/Semantic Location History/2020/2020_APRIL.json'
             * "
             * @see https://github.com/itinance/react-native-fs/blob/master/android/src/main/java/com/rnfs/RNFSManager.java#L110
             */
            return RNFS.readFile(`file://file://${filepath}`);
          },
        );

        newLocations = [
          ...newLocations,
          ...(await mergeJSONWithLocalData(JSON.parse(contents))),
        ];

        console.log('[INFO] Imported file:', filepath);
        parsedFilesCount++;
      }
    }
  } catch (err) {
    console.log('[Error] Failed to import Google Takeout', err);
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
