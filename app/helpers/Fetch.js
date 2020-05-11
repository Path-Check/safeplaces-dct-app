import axios from 'axios';

const proxyConfig = {
  proxy: {
    host: 'proxyserver.mepyd.gob.do',
    port: 3128,
    auth: {
      username: 'covapp',
      password: 'TIC..2k12*',
    },
  },
};

const wrapFetch = (url, options) => {
  return axios({ url, ...options, ...proxyConfig });
};

export default wrapFetch;
