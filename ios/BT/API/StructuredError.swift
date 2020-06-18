import Foundation

struct StructuredError: Error, Decodable {

  let title: String?
  let message: String

  init(title: String? = nil, message: String) {
    self.title = title
    self.message = message
  }

}
