export const isValidCoordinates = (latitude, longitude) => {
  const isValid = num => {
    const regex = /^(-?\d+\.?\d*|\.\d+)$/;
    return typeof num === 'string' && regex.test(num);
  };
  return isValid(latitude) && isValid(longitude);
};

export const parseQRCodeUrl = url => {
  const split1 = url && url.split('/qr/');
  const split2 = split1 && split1.length === 2 && split1[1].split('/');
  const latitude = (split2 && split2.length === 2 && split2[0]) || undefined;
  const longitude = (split2 && split2.length === 2 && split2[1]) || undefined;
  return { latitude, longitude };
};
