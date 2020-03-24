export function convertPointsToString(count) {
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
      if (rhours > 1) {
        return (
          rdays + ' days, ' + rhours + ' hours and ' + rminutes + ' minutes.'
        );
      } else {
        return (
          rdays + ' days, ' + rhours + ' hour and ' + rminutes + ' minutes.'
        );
      }
    } else {
      if (rhours > 1) {
        return (
          rdays + ' day, ' + rhours + ' hours and ' + rminutes + ' minutes.'
        );
      } else {
        return (
          rdays + ' day, ' + rhours + ' hour and ' + rminutes + ' minutes.'
        );
      }
    }
  } else if (rhours > 0) {
    if (rhours > 1) {
      return rhours + ' hours and ' + rminutes + ' minutes.';
    } else {
      return rhours + ' hour and ' + rminutes + ' minutes.';
    }
  } else {
    return rminutes + ' minutes.';
  }
}
