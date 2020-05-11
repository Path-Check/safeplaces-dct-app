import axios from 'axios';

import fetch from '../Fetch';

describe('helpers/fetch', () => {
  it('should call through a proxy server', () => {
    fetch();
    const { proxy } = axios.mock.calls[0][0];
    expect(proxy).not.toBe(undefined);
    expect(proxy.host).toBe('proxyserver.mepyd.gob.do');
    expect(proxy.port).toBe(3128);
  });
});
