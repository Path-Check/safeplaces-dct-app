import { env } from 'jsdom-jscore-rn';
import { AsyncStorage } from 'react-native';
import utmObj from 'utm-latlng';

async function saveData(data, field) {
  if (!!data) {
    await AsyncStorage.setItem(`coviddr@${field}`, JSON.stringify(data));

    return data;
  } else {
    return JSON.parse(await AsyncStorage.getItem(`coviddr@${field}`));
  }
}

export async function getAllCases() {
  // eslint-disable-next-line no-undef
  const data = await fetch(
    'https://corona.lmao.ninja/v2/countries/do'
  ).then((res) => res.json());

  return await saveData(data, 'situation');
}

export async function requestBulletin() {
  const url =
    'http://digepisalud.gob.do/documentos/?drawer=Vigilancia%20Epidemiologica*Alertas%20epidemiologicas*Coronavirus*Nacional*Boletin%20Especial%20COVID-19';
  // eslint-disable-next-line no-undef
  const data = await fetch(url)
    .then((res) => res.text())
    .then((html) => {
      const elems = html.match(/http:..digepisalud.gob.do.docs([^f]*.)/g);
      const dates = html.match(/\d{1,2}\/\d{1,2}\/\d{4}([^am|pm]*)../g);
      const urls = [...new Set(elems)];
      const formatDate = (dateTime) => {
        const [date, time, ampm] = dateTime.split(' ');
        const [day, month, year] = date.split('/');
        const months = [
          'enero',
          'febrero',
          'marzo',
          'abril',
          'mayo',
          'junio',
          'julio',
          'agosto',
          'septiembre',
          'octubre',
          'noviembre',
          'diciembre',
        ];

        return `${
          months[month[1] - 1]
        } ${day}, ${year} ${time} ${ampm}`.toUpperCase();
      };

      const data = urls.map((pdfUrl, i) => ({
        title: `Boletín Especial ${i >= 9 ? i + 1 : `0${i + 1}`} COVID-19`,
        date: formatDate(dates[i]),
        image: {
          source: require('../assets/images/bulletin.jpg'),
        },

        url: pdfUrl,
      }));

      return data.reverse();
    })
    .catch(console.error);
  return await saveData(data, 'bulletins');
}

export function requestNews(pagination, callback) {
  const section = pagination === 1 ? '' : `page/${pagination}/`;
  const request = new Request(
    `http://coronavirusrd.gob.do/category/noticias/${section}`
  );

  fetch(request).then((response) => {
    if (response.status === 404) {
      callback([], false);
    }

    response
      .text()
      .then((html) => {
        env(html, (errors, { document }) => {
          const titles = document.querySelectorAll('.title > h2');
          const dates = document.querySelectorAll('.date');
          const contents = document.querySelectorAll('.content');
          const images = document.querySelectorAll('.photo > img');
          const urls = document.querySelectorAll('.items a');
          const res = [];
          for (let i = 0; i < titles.length; i += 1) {
            res.push({
              title: titles[i].innerHTML,
              date: dates[i].innerHTML,
              content: contents[i].innerHTML,
              image: {
                source: require('../assets/images/new.jpg'),
              },
              url: urls[i].href,
            });
          }
          callback(res, true);
        });
      })
      .catch(console.error);
  });
}

export function requestCovid19Hospitals() {
  const url =
    'https://services5.arcgis.com/vzuQ2GBv7eL3S9SR/arcgis/rest/services/capa_HOSPITALES_del_SNS_para_COVID_para_apps/FeatureServer/1//query?where=OBJECTID%3E0&outFields=OBJECTID%2CNombre_del_Centro%2CNivel_de_atenci%C3%B3n%2CTelCentro%2Cx%2Cy&f=pjson&token=';
  return fetch(url)
    .then((res) => res.json())
    .then((json) =>
      json.features
        .map(({ attributes }) => {
          if (!attributes) return null;

          // eslint-disable-next-line
          const { OBJECTID, Nombre_del_Centro, TelCentro, X, Y } = attributes;
          if (!X || !Y) return null;

          return {
            id: OBJECTID,
            name: Nombre_del_Centro,
            phone: TelCentro,
            latitude: X,
            longitude: Y,
          };
        })
        .filter((hospital) => hospital)
    );
}

export function requestCovid19Laboratories() {
  const url =
    'https://services5.arcgis.com/vzuQ2GBv7eL3S9SR/arcgis/rest/services/Laboratorios_Clinicos_Hijo/FeatureServer/0//query?where=FID%3E0&outFields=ID%2CNombre%2CTelefono%2Ccoord_X%2Ccoord_Y&f=pjson&token=';
  return fetch(url)
    .then((res) => res.json())
    .then((json) =>
      json.features
        .map(({ attributes }) => {
          if (!attributes) return null;

          // eslint-disable-next-line
          let { ID, Nombre, Telefono, Coord_X, Coord_Y } = attributes;
          if (!Coord_X || !Coord_Y) return null;

          Telefono = Telefono === ' ' ? '(000) 000-0000' : Telefono;

          const utm = new utmObj('International');

          // This is to change coordinates from utm to degree
          const { lat, lng } = utm.convertUtmToLatLng(
            Coord_X,
            Coord_Y,
            19,
            'Q'
          );

          return {
            id: ID,
            name: Nombre,
            phone: Telefono,
            latitude: lat,
            longitude: lng,
          };
        })
        .filter((laboratory) => laboratory)
    );
}
