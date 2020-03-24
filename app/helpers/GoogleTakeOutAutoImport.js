<<<<<<< HEAD
/**
 * Checks the download folder, unzips and imports all data from Google TakeOut
 */
import { unzip, subscribe } from 'react-native-zip-archive';
import { MergeJSONWithLocalData } from '../helpers/GoogleData';

// require the module
let RNFS = require('react-native-fs');
=======
// Unzips and imports all data from Google TakeOut

import { unzip, subscribe } from 'react-native-zip-archive';
import { MergeJSONWithLocalData } from '../helpers/GoogleData';

var RNFS = require('react-native-fs');
>>>>>>> initial commit. working on android

// unzipping progress component.
let progress;

<<<<<<< HEAD
// Google Takout File Format.
let takeoutZip = /^takeout[\w,\s-]+\.zip$/gm;

=======
>>>>>>> initial commit. working on android
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

<<<<<<< HEAD
  let year = new Date().getFullYear();
  // let month = monthNames[new Date().getMonth()].toUpperCase();
=======
  var year = new Date().getFullYear();
  var month = monthNames[new Date().getMonth()].toUpperCase();

  //TODO: Grab the last two months, to avoid the problem of people importing
  //at the beginning of the month (i.e. April 1st) and getting less data.

>>>>>>> initial commit. working on android
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
<<<<<<< HEAD

export async function SearchAndImport() {
  //googleLocationJSON
  console.log('Auto-import start');
=======
// Imports any Takeout location data
// Currently works for Google Takeout Location data
export async function ImportTakeoutData(filePath) {
  console.log('[INFO] Takeout import start. Path:', filePath);
>>>>>>> initial commit. working on android

  // UnZip Progress Bar Log.
  progress = subscribe(
    ({
      progress,
      //  filePath
    }) => {
      if (Math.trunc(progress * 100) % 10 === 0)
        console.log('Unzipping', Math.trunc(progress * 100), '%');
    },
  );

  unzip(filePath, RNFS.CachesDirectoryPath).then(path => {
    console.log(`Unzip Completed for ${path} and ${filePath}`);

<<<<<<< HEAD
  RNFS.readDir(RNFS.DownloadDirectoryPath)
    .then(result => {
      console.log('Checking Downloads Folder');

      // Looking for takeout*.zip files and unzipping them.
      result.map(function(
        file,
        //index
      ) {
        if (takeoutZip.test(file.name)) {
          console.log(
            `Found Google Takeout {file.name} at {file.path}`,
            file.name,
          );

          unzip(file.path, RNFS.DownloadDirectoryPath)
            .then(path => {
              console.log(`Unzip Completed for ${path} and ${file.path}`);

              RNFS.readFile(GetFileName())
                .then(result => {
                  console.log('Opened file');

                  MergeJSONWithLocalData(JSON.parse(result));
                  progress.remove();
                })
                .catch(err => {
                  console.log(err.message, err.code);
                  progress.remove();
                });
            })
            .catch(error => {
              console.log(error);
              progress.remove();
            });
=======
    RNFS.readFile(GetFileName())
      .then(result => {
        MergeJSONWithLocalData(JSON.parse(result));
        progress.remove();
      })
      .catch(err => {
        if (err.code === 'ENOENT') {
          console.log('Caught ENOENT');
>>>>>>> initial commit. working on android
        }
        console.log(err.message, err.code);
        progress.remove();
      });
  });
}
