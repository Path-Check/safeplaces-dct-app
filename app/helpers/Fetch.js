import axios from 'axios';

const Config = {
  //url: '/',
  withCredentials: true,
  //httpAgent: new http.Agent({ keepAlive: true }),
  //method: 'get',
};

const wrapFetch = (url, options) => {
  return axios({ url, ...options, ...Config });
};

export default wrapFetch;
