export const isValidCoordinates = (latitude, longitude) => {
  const isValid = num => {
    const regex = /^(-?\d+\.?\d*|\.\d+)$/;
    return typeof num === 'string' && regex.test(num);
  };
  return isValid(latitude) && isValid(longitude);
};
