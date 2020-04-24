export function getLanguages() {
  return new Promise((resolve, reject) => {
    process.nextTick(() => resolve(['en-US']));
  });
}
