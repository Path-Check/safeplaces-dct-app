export function getLanguages() {
  return new Promise(resolve => {
    process.nextTick(() => resolve(['en-US']));
  });
}
