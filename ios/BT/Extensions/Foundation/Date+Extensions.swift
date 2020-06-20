extension Date {
  var posixRepresentation: Int {
    Int(timeIntervalSince1970) * 1000
  }
}
