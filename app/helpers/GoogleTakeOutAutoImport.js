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

// Google Takout File Format.
let takeoutZip = /^takeout[\w,\s-]+\.zip$/gm;

// Download directory based on Platform OS
let downloadDir =
  Platform.OS === 'ios'
    ? RNFS.DocumentDirectoryPath + '/Downloads/'
    : RNFS.DownloadDirectoryPath;

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

  let year = new Date().getFullYear();
  // let month = monthNames[new Date().getMonth()].toUpperCase();
  return (
    downloadDir +
    '/Takeout/Location History/Semantic Location History/' +
    year +
    '/' +
    year +
    '_MARCH.json'
  );
}

export function SaveTakeoutFile(path) {
  RNFS.mkdir(downloadDir)
    .then(result => {
      console.log('The directory created', downloadDir);
    })
    .catch(err => {
      console.warn('err', err);
    });
  RNFS.downloadFile({
    fromUrl: path,
    toFile: downloadDir + '/takeout0.zip',
  });
}

export async function SearchAndImport() {
  //googleLocationJSON
  console.log('Auto-import start');

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

  // TODO: RNFS.DownloadDirectoryPath is not defined on iOS.
  // Find out how to access Downloads folder.
  // if (!RNFS.DownloadDirectoryPath) {
  //  return;
  //}

  RNFS.readDir(downloadDir)
    .then(result => {
      console.log('Checking Downloads Folder');

      // Looking for takeout*.zip files and unzipping them.
      result.map(function(
        file,
        //index
      ) {
        if (takeoutZip.test(file.name)) {
          console.log(
            `Found Google Takeout ${file.name} at ${file.path}`,
            file.name,
          );

          unzip(file.path, downloadDir)
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
        }
      });
    })
    .catch(err => {
      console.log(err.message, err.code);
      progress.remove();
    });
}
