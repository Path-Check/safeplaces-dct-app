extension Encodable {
  func jsonStringRepresentation() -> String {
    let encodedValue = try! JSONEncoder().encode(self)
    let string = String(data: encodedValue, encoding: .utf8)!
    return string
  }
}
