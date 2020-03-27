import * as convertPointsToString from '../convertPointsToString';
import languages from './../../locales/languages';

describe('timeSincePoint method', () => {
  it('returns the correct time strings', () => {
    // convertPointsToString.now = jest.fn().mockReturnValue(Date.parse('2020-03-27T10:00:00.00Z'));
    jest.spyOn(convertPointsToString, 'now').mockReturnValue(Date.parse('2020-03-27T10:00:00.00Z'));


    // const threeHoursAgo = Date.parse('2020-03-27T07:00:00.00Z');
    // expect(convertPointsToString.timeSincePoint({time: threeHoursAgo})).toBe('3 hours');

    const thirtySecondsAgo = Date.parse('2020-03-27T09:59:30.00Z');
    expect(convertPointsToString.timeSincePoint({time: thirtySecondsAgo})).toBe(languages.t('label.less_than_one_minute'));
  });
})
