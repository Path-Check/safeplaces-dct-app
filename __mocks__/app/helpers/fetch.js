global.mockSuccessResponse = {};

export default jest.fn().mockImplementation(() =>
  Promise.resolve({
    // 3
    json: () => Promise.resolve(global.mockSuccessResponse),
  }),
);
