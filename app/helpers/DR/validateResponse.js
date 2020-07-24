import getToken from '../../services/DR/getToken';

export default async function(url, method, body) {
  const responseFunc = (body, token) => {
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        gov_do_token: token,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  const token = await getToken();

  try {
    let response = await responseFunc(body, token);

    if (response.status === 401) {
      console.log('TOKEN NOT WORKING???');
      // CODE 401 TOKEN NOT VALID
      const newToken = await getToken(true);

      response = await responseFunc(body, newToken);
    }

    return await response.json();
  } catch (e) {
    console.log('[ERROR]', e);
  }
}
