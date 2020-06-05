import Foundation

struct TestResult: Codable {
  var id: UUID                // A unique identifier for this test result
  var isAdded: Bool           // Whether the user completed the add positive diagnosis flow for this test result
  var dateAdministered: Date  // The date the test was administered
  var isShared: Bool          // Whether diagnosis keys were shared with the Health Authority for the purpose of notifying others
}
