import { COV_CASES_SERVICE } from '../../constants/DR/baseUrls';
import { AUTHORITY_CASES } from '../../constants/storage';
import fetch from '../../helpers/Fetch';
import { GetStoreData, SetStoreData } from '../../helpers/General';

export function getAllCases() {
  const dataSaved = GetStoreData(AUTHORITY_CASES, false);
  return fetch(COV_CASES_SERVICE)
    .then(({ data }) => {
      SetStoreData(AUTHORITY_CASES, data);
      return data;
    })
    .catch(() => {
      return dataSaved;
    });
}
