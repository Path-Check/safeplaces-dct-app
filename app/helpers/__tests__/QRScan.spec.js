import { isValidCoordinates, parseQRCodeUrl } from '../QRScan';

describe('isValidCoordinates', () => {
  it('Should only validate strings', () => {
    expect(isValidCoordinates(40.7128, -74.006)).toBe(false);
    expect(isValidCoordinates(123, 456)).toBe(false);
    expect(isValidCoordinates(undefined, undefined)).toBe(false);
    expect(isValidCoordinates('40.7128', '-74.006')).toBe(true);
  });

  it('Should validate positive/negative integers/decimals', () => {
    expect(isValidCoordinates('40.7128', '-74.006')).toBe(true);
    expect(isValidCoordinates('40', '-50')).toBe(true);
    expect(isValidCoordinates('0', '0')).toBe(true);
    expect(isValidCoordinates('1.2.3', '4.5.6')).toBe(false);
    expect(isValidCoordinates('abc123', 'def456')).toBe(false);
  });
});

describe('parseQRCodeUrl', () => {
  it('Should parse valid URLs', () => {
    expect(parseQRCodeUrl('safepaths://qr/123/456')).toMatchObject({
      latitude: '123',
      longitude: '456',
    });
    expect(parseQRCodeUrl('safepaths://qr/12.3/-45.6')).toMatchObject({
      latitude: '12.3',
      longitude: '-45.6',
    });
  });

  it('Should not parse invalid URLs', () => {
    expect(parseQRCodeUrl('safepaths://qr/123')).toMatchObject({});
    expect(parseQRCodeUrl('safepath://qr/123/456')).toMatchObject({});
    expect(parseQRCodeUrl('safepaths//qr/123/456')).toMatchObject({});
    expect(parseQRCodeUrl('safepath:qr/123/456')).toMatchObject({});
    expect(parseQRCodeUrl('safepath:/qr/123/456')).toMatchObject({});
    expect(parseQRCodeUrl('safepath://123/456')).toMatchObject({});
    expect(parseQRCodeUrl('/qr/123/456')).toMatchObject({});
    expect(parseQRCodeUrl('123/456')).toMatchObject({});
  });
});
