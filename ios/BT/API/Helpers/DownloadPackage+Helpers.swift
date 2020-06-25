import Foundation

extension DownloadedPackage {

  func writeSignatureEntry(toDirectory directory: URL, filename: String) throws -> URL {
    let url = directory.appendingPathComponent(filename).appendingPathExtension("sig")
    try signature.write(to: url)
    return url
  }

  func writeKeysEntry(toDirectory directory: URL, filename: String) throws -> URL {
    let url = directory.appendingPathComponent(filename).appendingPathExtension("bin")
    try bin.write(to: url)
    return url
  }

}
