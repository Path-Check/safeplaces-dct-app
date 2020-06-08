import axios from 'axios';

import fetch from '../Fetch';

describe('helpers/fetch', () => {
  it('should call through axios', () => {
    fetch();
    expect(axios).toBeCalled();
  });
});
