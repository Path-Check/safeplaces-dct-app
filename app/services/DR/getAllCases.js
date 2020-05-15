import { AUTHORITY_CASES } from '../../constants/storage';
import fetch from '../../helpers/Fetch';
import { GetStoreData, SetStoreData } from '../../helpers/General';
const COV_CASES = 'https://corona.lmao.ninja/v2/countries/do';

export function getAllCases() {
  const dataSaved = GetStoreData(AUTHORITY_CASES, false);
  return fetch(COV_CASES)
    .then(({ data }) => {
      SetStoreData(AUTHORITY_CASES, data);
      return data;
    })
    .catch(() => {
      return dataSaved;
    });
}
