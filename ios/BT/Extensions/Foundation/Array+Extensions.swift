import ExposureNotification
import Foundation

extension Array where Element == DownloadedPackage {

  func unpack(_ completion: @escaping (([URL]) -> Void)) throws {
    guard count > 0 else {
      completion([])
      return
    }
    var uncompressedFileUrls = [URL]()
    do {
      for idx in (0..<count) {
        let keyPackage = self[idx]
        let filename = UUID().uuidString
        uncompressedFileUrls.append(try keyPackage.writeKeysEntry(toDirectory: APIClient.documentsDirectory!, filename: filename))
        uncompressedFileUrls.append(try keyPackage.writeSignatureEntry(toDirectory: APIClient.documentsDirectory!, filename: filename))
        if idx == count - 1 {
          completion(uncompressedFileUrls)
        }
      }
    } catch {
      uncompressedFileUrls.cleanup()
      throw GenericError.unknown
    }

  }

}

extension Array where Element == ENTemporaryExposureKey {

  func minRollingStartNumber() -> UInt32 {
    let date = Calendar.current.date(byAdding: .hour, value: -Constants.exposureLifetimeHours, to: Date())!
    return ENTemporaryExposureKey.rollingStartNumber(date)
  }

  func current() -> [ENTemporaryExposureKey] {
    filter { $0.rollingStartNumber > self.minRollingStartNumber() }
  }

}

extension Array where Element == URL {

  func cleanup() {
    forEach { try? FileManager.default.removeItem(at: $0) }
  }

}

private extension String {
  static let binPath: String = "/export.bin"
  static let sigPath: String = "/export.sig"
}
