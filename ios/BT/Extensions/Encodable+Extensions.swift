import RealmSwift

extension List where Element: Encodable {
  public func encode(to coder: Encoder) throws {
    var container = coder.unkeyedContainer()
    try container.encode(contentsOf: self)
  }
}
