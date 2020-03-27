export function convertPointsToString(count, updatedAt) {
  var timeString = "";
  // For testing Manually override count
  //  count = 3000

  // Get minutes
  let tot_mins = count * 5;

  // Calculate days
  var days = tot_mins / 60 / 24;
  var rdays = Math.floor(days);

  // Calculate Hours
  var hours = (days - rdays) * 24;
  var rhours = Math.floor(hours);

  // Calculate Minutes
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);

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
