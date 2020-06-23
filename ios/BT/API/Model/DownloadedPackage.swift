import Foundation
import ZIPFoundation
import CryptoKit

struct DownloadedPackage {

  init(keysBin: Data, signature: Data) {
    bin = keysBin
    self.signature = signature
  }

  init?(compressedData: Data) {
    guard let archive = Archive(data: compressedData, accessMode: .read) else {
      return nil
    }
    do {
      self = try archive.extractKeyPackage()
    } catch {
      return nil
    }
  }

  let bin: Data
  let signature: Data

}

private extension Archive {
  typealias KeyPackage = (bin: Data, sig: Data)
  enum KeyPackageError: Error {
    case binNotFound
    case sigNotFound
    case signatureCheckFailed
  }

  func extractData(from entry: Entry) throws -> Data {
    var data = Data()
    try _ = extract(entry) { slice in
      data.append(slice)
    }
    return data
  }

  func extractKeyPackage() throws -> DownloadedPackage {
    guard let binEntry = self["export.bin"] else {
      throw KeyPackageError.binNotFound
    }
    guard let sigEntry = self["export.sig"] else {
      throw KeyPackageError.sigNotFound
    }
    return DownloadedPackage(
      keysBin: try extractData(from: binEntry),
      signature: try extractData(from: sigEntry)
    )
  }
}
