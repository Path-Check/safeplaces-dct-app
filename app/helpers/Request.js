import utmObj from 'utm-latlng';

import fetch from '../helpers/Fetch';

export function requestCovid19Hospitals() {
  const URL =
    'https://services5.arcgis.com/vzuQ2GBv7eL3S9SR/arcgis/rest/services/capa_HOSPITALES_del_SNS_para_COVID_para_apps/FeatureServer/1//query?where=OBJECTID%3E0&outFields=OBJECTID%2CNombre_del_Centro%2CNivel_de_atenci%C3%B3n%2CTelCentro%2Cx%2Cy&f=pjson&token=';
  return fetch(URL).then(({ data }) =>
    data.features
      .map(({ attributes }) => {
        if (!attributes) return null;

        // eslint-disable-next-line
        const {
          OBJECTID,
          Nombre_del_Centro,
          TelCentro,
          FIELD_EXP_0: x,
          FIELD_EXP_1: y,
        } = attributes;

        if (!x || !y) return null;

        return {
          id: OBJECTID,
          name: Nombre_del_Centro,
          phone: TelCentro,
          latitude: x,
          longitude: y,
        };
      })
      .filter(hospital => hospital),
  );
}

export function requestCovid19Laboratories() {
  const URL =
    'https://services5.arcgis.com/vzuQ2GBv7eL3S9SR/arcgis/rest/services/Laboratorios_Clinicos_Hijo/FeatureServer/0//query?where=FID>0&outFields=ID%2CNombre%2CTelefono%2Ccoord_X%2Ccoord_Y&f=pjson&token=';
  return fetch(URL).then(({ data }) =>
    data.features
      .map(({ attributes }) => {
        if (!attributes) return null;

        // eslint-disable-next-line
        let {
          FID,
          Nombre,
          Telefono,
          FIELD_EXP_1: Coord_X,
          FIELD_EXP_2: Coord_Y,
        } = attributes;
        if (!Coord_X || !Coord_Y) return null;

        Telefono = Telefono === ' ' ? '(000) 000-0000' : Telefono;

        const utm = new utmObj('International');

        // This is to change coordinates from utm to degree
        const { lat, lng } = utm.convertUtmToLatLng(Coord_X, Coord_Y, 19, 'Q');

        return {
          id: FID,
          name: Nombre,
          phone: Telefono,
          latitude: lat,
          longitude: lng,
        };
      })
      .filter(laboratory => laboratory),
  );
}
