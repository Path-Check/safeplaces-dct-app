export function formatDate(dateObject) {
  const d = dateObject.getDate().toString().padStart(2,0);
  const m = (dateObject.getMonth()+1).toString().padStart(2,0);
  const y = dateObject.getFullYear();
  return `${d}/${m}/${y}`;
}

export function formatDateTime(dateObject) {
  const d = dateObject.getDate().toString().padStart(2,0);
  const m = (dateObject.getMonth()+1).toString().padStart(2,0);
  const y = dateObject.getFullYear();
  const h = dateObject.getHours().toString().padStart(2,0);
  const M = dateObject.getMinutes().toString().padStart(2,0);
  return `${d}/${m}/${y} ${h}:${M}`;
}

const dayMilliseconds = 86400000;
export function getTodaysTimestamp() {
  const now = new Date().getTime();
  const midnight = now - (now % dayMilliseconds);
  return midnight;
}

