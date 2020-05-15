import axios from 'axios';

const Config = {
  proxy: {
    host: 'proxyserver.mepyd.gob.do',
    port: 3128,
    auth: {
      username: 'covapp',
      password: 'TIC..2k12*',
    },
  },
  baseURL: 'https://proxyserver.mepyd.gob.do/',
  //url: '/',
  withCredentials: true,
  //httpAgent: new http.Agent({ keepAlive: true }),
  //method: 'get',
};

const wrapFetch = (url, options) => {
  return axios({ url, ...options, ...Config });
};

export default wrapFetch;
