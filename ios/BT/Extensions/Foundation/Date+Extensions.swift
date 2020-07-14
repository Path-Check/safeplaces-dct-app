extension Date {
  var posixRepresentation: Int {
    Int(timeIntervalSince1970) * 1000
  }

  static func hourDifference(from startDate: Date, to endDate: Date) -> Int {
    Calendar.current.dateComponents([.hour], from: startDate, to: endDate).hour ?? 0
  }

}
