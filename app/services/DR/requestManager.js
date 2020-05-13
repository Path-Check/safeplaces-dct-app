import { AsyncStorage } from 'react-native';
import fetch from '../../helpers/Fetch';
const COV_CASES = 'https://corona.lmao.ninja/v2/countries/do';

async function saveData(data, field) {
  if (data) {
    await AsyncStorage.setItem(`coviddr@${field}`, JSON.stringify(data));

    return data;
  } else {
    return JSON.parse(await AsyncStorage.getItem(`coviddr@${field}`));
  }
}

export async function getAllCases() {
  // eslint-disable-next-line no-undef
  let data;
  fetch(`${COV_CASES}`)
  .then((raw) => data = raw.json())
  .then(({ data }) => {
    console.log('[INFO]',data);
  })
  .catch(() => {
    console.log('[ERROR]');
    return;
  });

  return await saveData(data, 'situation');
}

