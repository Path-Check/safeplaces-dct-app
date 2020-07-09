import AsyncStorage from '@react-native-community/async-storage';
import DocumentPicker from 'react-native-document-picker';

/* eslint-disable @typescript-eslint/no-explicit-any*/
export async function GetStoreData(key: string, isString = true): Promise<any> {
  try {
    const data = await AsyncStorage.getItem(key);

    if (isString) {
      return data;
    }

    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.log(error.message);
  }
  return false;
}

export async function SetStoreData(
  key: string,
  item: Record<string, string> | string,
): Promise<void> {
  try {
    //we want to wait for the Promise returned by AsyncStorage.setItem()
    //to be resolved to the actual value before returning the value
    if (typeof item !== 'string') {
      item = JSON.stringify(item);
    }

    return await AsyncStorage.setItem(key, item);
  } catch (error) {
    console.log(error.message);
  }
}

export async function pickFile(): Promise<string | null> {
  // Pick a single file - returns actual path on Android, file:// uri on iOS
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.zip, DocumentPicker.types.allFiles],
      usePath: true,
    });
    return res.uri;
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
      return null;
    } else {
      throw err;
    }
  }
}
