package covidsafepaths.util

import java.util.Calendar

fun getCutoffTimestamp(daysToKeep: Int): Long {
  val calendar = Calendar.getInstance()
  calendar.add(Calendar.DAY_OF_YEAR, -daysToKeep)
  return calendar.timeInMillis
}