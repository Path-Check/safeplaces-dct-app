import axios from 'axios';

const Config = {
  withCredentials: true,
};

const wrapFetch = (url, options) => {
  return axios({ url, ...options, ...Config });
};

export default wrapFetch;
