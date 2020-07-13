extension Date {
  var posixRepresentation: Int {
    Int(timeIntervalSince1970) * 1000
  }

  func difference(from date: Date, only component: Calendar.Component, calendar: Calendar = .current) -> Int {
    let a = calendar.component(component, from: self)
    let b = calendar.component(component, from: date)
    return a - b
  }

}
