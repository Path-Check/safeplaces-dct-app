describe('Onboarding', () => {
  beforeEach(async () => {
    console.log('reload');
    await device.reloadReactNative();
    console.log('reloaded');
  });

  it('starts at onboarding step 1', async () => {
    await expect(element(by.label('Get Started'))).toBeVisible();
  });

  // it('proceeds to step 2', async () => {
  //   await element(by.label('Get Started')).tap();

  //   await expect(
  //     element(
  //       by.text(
  //         'Get notified if you cross paths with someone later diagnosed ' +
  //           'for COVID-19.',
  //       ),
  //     ),
  //   ).toBeVisible();
  //   await expect(element(by.label('Next'))).toBeVisible();
  // });
});
