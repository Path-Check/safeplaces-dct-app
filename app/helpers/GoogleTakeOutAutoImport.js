/**
 * Checks the download folder, unzips and imports all data from Google TakeOut
 */
import { unzip, subscribe } from 'react-native-zip-archive';
import { MergeJSONWithLocalData } from '../helpers/GoogleData';
import { Platform } from 'react-native';

// require the module
let RNFS = require('react-native-fs');

// unzipping progress component.
let progress;

// Gets Path of the location file for the current month.
function GetFileName() {
  let monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  var year = new Date().getFullYear();
  var month = monthNames[new Date().getMonth()].toUpperCase();

  //TODO: Grab the last two months, to avoid the problem of people importing
  //at the beginning of the month (i.e. April 1st) and getting less data.

  return (
    RNFS.CachesDirectoryPath +
    '/Takeout/Location History/Semantic Location History/' +
    year +
    '/' +
    year +
    '_' +
    month +
    '.json'
  );
}
// Imports any Takeout location data
// Currently works for Google Takeout Location data
export async function ImportTakeoutData(filePath) {
  let unifiedPath = filePath;

  if (Platform.OS === 'ios') {
    unifiedPath = filePath.replace('file://', '');
  }

  console.warn('[INFO] Takeout import start. Path:', unifiedPath);

  // UnZip Progress Bar Log.
  progress = subscribe(
    ({
      progress,
      //  unifiedPath
    }) => {
      if (Math.trunc(progress * 100) % 10 === 0)
        console.log('Unzipping', Math.trunc(progress * 100), '%');
    },
  );

  unzip(unifiedPath, RNFS.CachesDirectoryPath).then(path => {
    console.warn(`Unzip Completed for ${path} and ${unifiedPath}`);

    RNFS.readFile(GetFileName())
      .then(result => {
        MergeJSONWithLocalData(JSON.parse(result));
        progress.remove();
      })
      .catch(err => {
        if (err.code === 'ENOENT') {
          console.log('Caught ENOENT');
          // TODO surface this as "no current data found in UI"
        }
        console.log(err.message, err.code);
        progress.remove();
      });
  });
}
