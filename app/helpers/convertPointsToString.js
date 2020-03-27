export function convertPointsToString(count, updatedAt) {
  var timeString = "";
  // For testing Manually override count
  //  count = 3000

  // Get minutes
  let tot_mins = count * 5;

  // Calculate days
  let days = tot_mins / 60 / 24;
  let rdays = Math.floor(days);

  // Calculate Hours
  let hours = (days - rdays) * 24;
  let rhours = Math.floor(hours);

  // Calculate Minutes
  let minutes = (hours - rhours) * 60;
  let rminutes = Math.round(minutes);

  if (rdays > 0) {
    if (rdays > 1) {
      timeString = rdays + ' days, ';
    } else {
      timeString = rdays + ' day, ';
    }
  } else if (rhours > 0) {
    if (rhours > 1) {
      timeString = rhours + ' hours, ';
    } else {
      timeString = rhours + ' hour, ';
    }
  } else {
    timeString = rminutes + ' minutes, ';
  }

  let pointString = count + ' points';
  var updatedAgoString = "";

  if (updatedAt != undefined) {
    let nowUTC = new Date().toISOString();
    let unixtimeUTC = Date.parse(nowUTC);
    let lastUpdatedAgo = (unixtimeUTC - updatedAt) / (60 * 1000);
    let rlastUpdatedAgo = Math.round(lastUpdatedAgo);

    updatedAgoString = ', last updated ' + rlastUpdatedAgo + ' minutes ago';
  }

  return timeString + pointString + updatedAgoString + '.';
}
