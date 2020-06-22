import Foundation
import SSZipArchive

extension Array where Element == URL {

  func decompress(_ completion: @escaping (([URL]) -> Void)) {
    var uncompressedFileUrls = [URL]()
    for idx in (0..<count) {
      let url = self[idx]

      if let uncompressedUrl = APIClient.documentsDirectory?.appendingPathComponent("\(idx)"),
        let filePath = URL(string: "\(uncompressedUrl.path)\(String.binPath)") {
        SSZipArchive.unzipFile(atPath: url.path, toDestination: uncompressedUrl.path)

        uncompressedFileUrls.append(filePath)
      }
      if idx == count - 1 {
        completion(uncompressedFileUrls)
      }
    }

  }

  func cleanup() throws {
    do {
      try forEach { try FileManager.default.removeItem(at: $0) }
    } catch {
      throw GenericError.unknown
    }
  }

}

private extension String {
  static let binPath: String = "/export.bin"
}
